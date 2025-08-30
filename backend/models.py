from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, func
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
from sqlalchemy.orm import relationship

Base = declarative_base()

class Item(Base):
    __tablename__ = "items"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    price = Column(Float, nullable=False)  # Sales price
    purchase_price = Column(Float, nullable=False)  # Cost price
    product_code = Column(String, unique=True, nullable=False)
    category = Column(String, nullable=False)
    image_filename = Column(String, nullable=True)
    quantity = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

class Customer(Base):
    __tablename__ = "customers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    email = Column(String, nullable=True)
    address = Column(String, nullable=True)
    customer_type = Column(String, nullable=False, default="regular")  # "regular" or "walk-in"
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    invoices = relationship("Invoice", back_populates="customer", lazy="select")

class Invoice(Base):
    __tablename__ = "invoices"
    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=True)  # Nullable for walk-in customers
    client_name = Column(String, nullable=False)  # Keep for backward compatibility and walk-in customers
    client_phone = Column(String, nullable=True)  # Keep for backward compatibility and walk-in customers
    # Payment tracking fields
    total_amount = Column(Float, nullable=True)  # Total invoice amount
    amount_paid = Column(Float, nullable=True, default=0.0)  # Amount customer paid
    outstanding_balance = Column(Float, nullable=True)  # Remaining balance
    payment_status = Column(String, nullable=True, default="unpaid")  # paid, partial, unpaid
    customer = relationship("Customer", back_populates="invoices", lazy="joined")
    items = relationship("InvoiceItem", back_populates="invoice", lazy="joined")

class InvoiceItem(Base):
    __tablename__ = "invoice_items"
    id = Column(Integer, primary_key=True, index=True)
    invoice_id = Column(Integer, ForeignKey("invoices.id"), nullable=False)
    item_id = Column(Integer, ForeignKey("items.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    price = Column(Float, nullable=False)  # Price at time of sale
    invoice = relationship("Invoice", back_populates="items")
    item = relationship("Item", lazy="joined") 