from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# SQLALCHEMY_DATABASE_URL = "sqlite:///./workshop.db"

# engine = create_engine(
#     SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
# )
# SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

DATABASE_URL = (
    f"postgresql://{os.getenv('DB_USER')}:{os.getenv('DB_PASS')}"
    f"@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"
)

engine = create_engine(DATABASE_URL, connect_args={"sslmode": "require"})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    Base.metadata.create_all(bind=engine)

def add_sample_items():
    from models import Item
    session = SessionLocal()
    if session.query(Item).count() == 0:
        now = datetime.utcnow()
        sample_data = [
            Item(name="Engine Oil", price=2500.0, purchase_price=1800.0, product_code="EO-001", category="Lubricants", image_filename=None, created_at=now, updated_at=now),
            Item(name="Brake Pads", price=1800.0, purchase_price=1200.0, product_code="BP-002", category="Spare Parts", image_filename=None, created_at=now, updated_at=now),
            Item(name="Car Floor Mats", price=1200.0, purchase_price=800.0, product_code="CFM-003", category="Car Accessories", image_filename=None, created_at=now, updated_at=now),
        ]
        session.add_all(sample_data)
        session.commit()
    session.close() 