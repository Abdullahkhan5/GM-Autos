from fastapi import FastAPI, Depends, HTTPException, File, UploadFile, Form, Body, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
import os
from . import models, schemas, crud, database
from typing import List, Optional
from shutil import copyfileobj

app = FastAPI()

# Allow frontend to access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.on_event("startup")
def on_startup():
    try:
        print("Initializing database...")
        database.init_db()
        print("Database initialized successfully!")
        
        print("Adding sample items...")
        database.add_sample_items()
        print("Sample items added successfully!")
        
        print("Application startup completed!")
    except Exception as e:
        print(f"Error during startup: {e}")
        raise e

UPLOAD_DIR = "images"
os.makedirs(UPLOAD_DIR, exist_ok=True)

app.mount("/images", StaticFiles(directory="images"), name="images")

@app.get("/items", response_model=List[schemas.ItemResponse])
def list_items(db: Session = Depends(get_db)):
    return crud.get_items(db)

@app.post("/items", response_model=schemas.ItemResponse)
def create_item(
    name: str = Form(...),
    price: float = Form(...),
    purchase_price: float = Form(...),
    product_code: str = Form(...),
    category: str = Form(...),
    quantity: int = Form(...),  # Add the missing quantity field
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
):
    image_filename = None
    if image:
        image_filename = image.filename
        with open(os.path.join(UPLOAD_DIR, image_filename), "wb") as buffer:
            copyfileobj(image.file, buffer)
    
    item_in = schemas.ItemCreate(
        name=name, 
        price=price, 
        purchase_price=purchase_price,
        product_code=product_code, 
        category=category,
        quantity=quantity  # Include quantity in the schema
    )
    return crud.create_item(db, item_in, image_filename=image_filename)

@app.put("/items/{item_id}", response_model=schemas.ItemResponse)
def update_item(
    item_id: int,
    name: Optional[str] = File(None),
    price: Optional[float] = File(None),
    purchase_price: Optional[float] = File(None),
    product_code: Optional[str] = File(None),
    category: Optional[str] = File(None),
    quantity: Optional[int] = File(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
):
    image_filename = None
    if image:
        image_filename = image.filename
        with open(os.path.join(UPLOAD_DIR, image_filename), "wb") as buffer:
            copyfileobj(image.file, buffer)
    item_update = schemas.ItemUpdate()
    if name is not None:
        item_update.name = name
    if price is not None:
        item_update.price = price
    if purchase_price is not None:
        item_update.purchase_price = purchase_price
    if product_code is not None:
        item_update.product_code = product_code
    if category is not None:
        item_update.category = category
    if quantity is not None:
        item_update.quantity = quantity
    updated = crud.update_item(db, item_id, item_update, image_filename=image_filename)
    if not updated:
        raise HTTPException(status_code=404, detail="Item not found")
    return updated 

@app.post("/invoices")
def create_invoice(invoice: schemas.InvoiceCreate = Body(...), db: Session = Depends(get_db)):
    try:
        result = crud.create_invoice(db, invoice)
        return {"success": True, "invoice_id": result.id}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) 

@app.get("/invoices/by-date", response_model=List[schemas.InvoiceResponse])
def get_invoices_by_date(date: str = Query(..., description="YYYY-MM-DD"), db: Session = Depends(get_db)):
    from datetime import datetime, timedelta
    try:
        day_start = datetime.strptime(date, "%Y-%m-%d")
        day_end = day_start + timedelta(days=1)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD.")
    invoices = db.query(models.Invoice).filter(models.Invoice.created_at >= day_start, models.Invoice.created_at < day_end).all()
    return invoices

# Customer endpoints
@app.get("/customers", response_model=List[schemas.CustomerResponse])
def list_customers(db: Session = Depends(get_db)):
    return crud.get_customers(db)

@app.post("/customers", response_model=schemas.CustomerResponse)
def create_customer(customer: schemas.CustomerCreate, db: Session = Depends(get_db)):
    return crud.create_customer(db, customer)

@app.get("/customers/{customer_id}", response_model=schemas.CustomerResponse)
def get_customer(customer_id: int, db: Session = Depends(get_db)):
    customer = crud.get_customer(db, customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer

@app.put("/customers/{customer_id}", response_model=schemas.CustomerResponse)
def update_customer(customer_id: int, customer_update: schemas.CustomerUpdate, db: Session = Depends(get_db)):
    updated_customer = crud.update_customer(db, customer_id, customer_update)
    if not updated_customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return updated_customer

@app.delete("/customers/{customer_id}")
def delete_customer(customer_id: int, db: Session = Depends(get_db)):
    success = crud.delete_customer(db, customer_id)
    if not success:
        raise HTTPException(status_code=404, detail="Customer not found")
    return {"message": "Customer deleted successfully"}

@app.get("/customers/{customer_id}/outstanding-balance")
def get_customer_outstanding_balance(customer_id: int, db: Session = Depends(get_db)):
    customer = crud.get_customer(db, customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    outstanding_balance = crud.get_customer_outstanding_balance(db, customer_id)
    return {"customer_id": customer_id, "outstanding_balance": outstanding_balance}

@app.get("/sales-tracker", response_model=List[schemas.SalesTrackerEntry])
def sales_tracker(db: Session = Depends(get_db)):
    results = crud.get_sales_tracker(db)
    # Convert SQLAlchemy Row objects to dicts for Pydantic
    return [
        schemas.SalesTrackerEntry(
            date=row.date,
            product_name=row.product_name,
            category=row.category,
            quantity=row.quantity,
            revenue=row.revenue  # Use the pre-calculated revenue from CRUD
        ) for row in results
    ]