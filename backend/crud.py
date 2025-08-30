from sqlalchemy.orm import Session
from . import models, schemas
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
    from .models import Invoice, InvoiceItem, Item
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
    from .models import Invoice
    result = db.query(
        func.sum(func.coalesce(Invoice.outstanding_balance, 0))
    ).filter(
        Invoice.customer_id == customer_id,
        Invoice.outstanding_balance > 0
    ).scalar()
    return result or 0.0

def get_sales_tracker(db: Session):
    from .models import Invoice, InvoiceItem, Item
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