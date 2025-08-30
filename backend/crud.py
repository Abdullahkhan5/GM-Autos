from sqlalchemy.orm import Session
import models, schemas
from typing import List, Optional
from sqlalchemy import func

def get_items(db: Session) -> List[models.Item]:
    return db.query(models.Item).all()

def get_item(db: Session, item_id: int) -> Optional[models.Item]:
    return db.query(models.Item).filter(models.Item.id == item_id).first()

def create_item(db: Session, item: schemas.ItemCreate, image_filename: Optional[str] = None) -> models.Item:
    db_item = models.Item(**item.dict(), image_filename=image_filename)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def update_item(db: Session, item_id: int, item_update: schemas.ItemUpdate, image_filename: Optional[str] = None) -> Optional[models.Item]:
    db_item = get_item(db, item_id)
    if not db_item:
        return None
    for field, value in item_update.dict(exclude_unset=True).items():
        setattr(db_item, field, value)
    if image_filename is not None:
        db_item.image_filename = image_filename
    db.commit()
    db.refresh(db_item)
    return db_item 

# Customer CRUD operations
def get_customers(db: Session) -> List[models.Customer]:
    return db.query(models.Customer).filter(models.Customer.customer_type == "regular").all()

def get_customer(db: Session, customer_id: int) -> Optional[models.Customer]:
    return db.query(models.Customer).filter(models.Customer.id == customer_id).first()

def create_customer(db: Session, customer: schemas.CustomerCreate) -> models.Customer:
    db_customer = models.Customer(**customer.dict())
    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)
    return db_customer

def update_customer(db: Session, customer_id: int, customer_update: schemas.CustomerUpdate) -> Optional[models.Customer]:
    db_customer = get_customer(db, customer_id)
    if not db_customer:
        return None
    for field, value in customer_update.dict(exclude_unset=True).items():
        setattr(db_customer, field, value)
    db.commit()
    db.refresh(db_customer)
    return db_customer

def delete_customer(db: Session, customer_id: int) -> bool:
    db_customer = get_customer(db, customer_id)
    if not db_customer:
        return False
    db.delete(db_customer)
    db.commit()
    return True

def create_invoice(db: Session, invoice_data: 'schemas.InvoiceCreate'):
    from models import Invoice, InvoiceItem, Item
    invoice = Invoice(
        customer_id=invoice_data.customer_id,
        client_name=invoice_data.client_name,
        client_phone=invoice_data.client_phone,
        # Add payment tracking fields
        total_amount=invoice_data.total_amount,
        amount_paid=invoice_data.amount_paid or 0.0,
        outstanding_balance=invoice_data.outstanding_balance,
        payment_status=invoice_data.payment_status or "unpaid"
    )
    db.add(invoice)
    db.flush()  # Get invoice.id
    for line in invoice_data.lines:
        item = db.query(Item).filter(Item.id == line.productId).first()
        if not item or item.quantity < line.quantity:
            raise ValueError(f"Not enough stock for item {line.productId}")
        item.quantity -= line.quantity
        db.add(InvoiceItem(invoice_id=invoice.id, item_id=item.id, quantity=line.quantity, price=item.price))
    db.commit()
    db.refresh(invoice)
    return invoice 

def get_customer_outstanding_balance(db: Session, customer_id: int) -> float:
    """Calculate total outstanding balance for a customer"""
    from models import Invoice, Customer
    
    # Get customer details
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        return 0.0
    
    # Sum outstanding balance from invoices with matching customer_id
    result_by_id = db.query(
        func.sum(func.coalesce(Invoice.outstanding_balance, 0))
    ).filter(
        Invoice.customer_id == customer_id
    ).scalar() or 0.0
    
    # Also sum outstanding balance from invoices with matching client_name (for legacy invoices without customer_id)
    result_by_name = db.query(
        func.sum(func.coalesce(Invoice.outstanding_balance, 0))
    ).filter(
        Invoice.client_name == customer.name,
        Invoice.customer_id.is_(None)  # Only count invoices without customer_id to avoid double counting
    ).scalar() or 0.0
    
    total_outstanding = result_by_id + result_by_name
    
    # Return the sum, but never return negative (customer doesn't owe negative money)
    return max(0.0, total_outstanding)

def update_invoice_payment(db: Session, invoice_id: int, payment_update: schemas.PaymentUpdate):
    """Update invoice payment status"""
    from models import Invoice
    
    # Get the invoice
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not invoice:
        return None
    
    # Update payment fields
    invoice.amount_paid = payment_update.amount_paid
    invoice.outstanding_balance = max(0, invoice.total_amount - payment_update.amount_paid)
    
    # Update payment status
    if payment_update.amount_paid >= invoice.total_amount:
        invoice.payment_status = "paid"
    elif payment_update.amount_paid > 0:
        invoice.payment_status = "partial"
    else:
        invoice.payment_status = "unpaid"
    
    db.commit()
    db.refresh(invoice)
    return invoice

def process_customer_payment(db: Session, customer_payment: schemas.CustomerPayment):
    """Process payment for a customer across multiple unpaid invoices"""
    from models import Invoice, Customer
    
    # Get customer details
    customer = db.query(Customer).filter(Customer.id == customer_payment.customer_id).first()
    if not customer:
        return {"updated_invoices": 0, "amount_applied": 0, "remaining_payment": customer_payment.payment_amount}
    
    # Get all unpaid invoices for this customer, ordered by date (oldest first)
    # Include both invoices with customer_id and legacy invoices with matching client_name
    from sqlalchemy import or_, and_
    unpaid_invoices = db.query(Invoice).filter(
        or_(
            Invoice.customer_id == customer_payment.customer_id,
            and_(Invoice.client_name == customer.name, Invoice.customer_id.is_(None))
        ),
        Invoice.outstanding_balance > 0
    ).order_by(Invoice.created_at.asc()).all()
    
    remaining_payment = float(customer_payment.payment_amount)
    updated_invoices = []
    
    # Apply payment to invoices starting from oldest
    for invoice in unpaid_invoices:
        if remaining_payment <= 0:
            break
            
        outstanding = float(invoice.outstanding_balance or 0)
        if outstanding <= 0:
            continue
            
        # Calculate how much to pay on this invoice
        payment_for_this_invoice = min(remaining_payment, outstanding)
        
        # Update invoice payment
        current_paid = float(invoice.amount_paid or 0)
        new_paid_amount = current_paid + payment_for_this_invoice
        
        invoice.amount_paid = new_paid_amount
        invoice.outstanding_balance = max(0, float(invoice.total_amount) - new_paid_amount)
        
        # Update payment status
        if new_paid_amount >= float(invoice.total_amount):
            invoice.payment_status = "paid"
        elif new_paid_amount > 0:
            invoice.payment_status = "partial"
        else:
            invoice.payment_status = "unpaid"
            
        updated_invoices.append(invoice)
        remaining_payment -= payment_for_this_invoice
    
    db.commit()
    
    # Refresh all updated invoices
    for invoice in updated_invoices:
        db.refresh(invoice)
    
    return {
        "updated_invoices": len(updated_invoices),
        "amount_applied": customer_payment.payment_amount - remaining_payment,
        "remaining_payment": remaining_payment
    }

def assign_invoice_to_customer(db: Session, invoice_id: int, customer_assignment: schemas.InvoiceCustomerAssignment):
    """Assign an existing invoice to a customer"""
    from models import Invoice
    
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not invoice:
        return None
    
    invoice.customer_id = customer_assignment.customer_id
    db.commit()
    db.refresh(invoice)
    return invoice

def get_sales_tracker(db: Session):
    from models import Invoice, InvoiceItem, Item
    results = (
        db.query(
            Invoice.created_at.label('date'),
            Item.name.label('product_name'),
            Item.category.label('category'),
            InvoiceItem.quantity.label('quantity'),
            (InvoiceItem.quantity * func.coalesce(InvoiceItem.price, 0)).label('revenue')
        )
        .join(InvoiceItem, Invoice.id == InvoiceItem.invoice_id)
        .join(Item, InvoiceItem.item_id == Item.id)
        .order_by(Invoice.created_at.desc())
        .all()
    )
    return results 