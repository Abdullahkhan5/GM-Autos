from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class ItemBase(BaseModel):
    name: str
    price: float  # Sales price
    purchase_price: float  # Cost price
    product_code: str
    category: str
    quantity: int

class ItemCreate(ItemBase):
    pass

class ItemUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[float] = None  # Sales price
    purchase_price: Optional[float] = None  # Cost price
    product_code: Optional[str] = None
    category: Optional[str] = None
    quantity: Optional[int] = None

class ItemResponse(BaseModel):
    id: int
    name: str
    price: float  # Sales price
    purchase_price: float  # Cost price
    product_code: str
    category: str
    image_filename: Optional[str] = None
    quantity: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class CustomerBase(BaseModel):
    name: str
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    customer_type: str = "regular"  # "regular" or "walk-in"

class CustomerCreate(CustomerBase):
    pass

class CustomerUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    customer_type: Optional[str] = None

class CustomerResponse(BaseModel):
    id: int
    name: str
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    customer_type: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class InvoiceItemCreate(BaseModel):
    productId: int
    quantity: int

class InvoiceCreate(BaseModel):
    lines: List[InvoiceItemCreate]
    customer_id: Optional[int] = None  # For regular customers
    client_name: str  # For walk-in customers or fallback
    client_phone: Optional[str] = None
    # Payment tracking fields
    total_amount: Optional[float] = None
    amount_paid: Optional[float] = 0.0
    outstanding_balance: Optional[float] = None
    payment_status: Optional[str] = "unpaid"

class SalesTrackerEntry(BaseModel):
    date: datetime
    product_name: str
    category: str
    quantity: int
    revenue: float 

class InvoiceItemResponse(BaseModel):
    id: int
    item_id: int
    quantity: int
    price: float
    item: ItemResponse

    class Config:
        from_attributes = True

class InvoiceResponse(BaseModel):
    id: int
    created_at: datetime
    client_name: str
    client_phone: Optional[str] = None
    # Payment tracking fields
    total_amount: Optional[float] = None
    amount_paid: Optional[float] = None
    outstanding_balance: Optional[float] = None
    payment_status: Optional[str] = None
    items: list[InvoiceItemResponse]

    class Config:
        from_attributes = True

# Payment update schema
class PaymentUpdate(BaseModel):
    amount_paid: float

# Customer payment schema - for paying across multiple invoices
class CustomerPayment(BaseModel):
    customer_id: int
    payment_amount: float

# Invoice customer assignment
class InvoiceCustomerAssignment(BaseModel):
    customer_id: int