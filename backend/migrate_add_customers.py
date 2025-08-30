#!/usr/bin/env python3
"""
Migration script to add customers table and update invoices table.
This script will create the customers table and add customer_id to invoices.
"""

import sqlite3
import os

def migrate_database():
    db_path = '../workshop.db'
    
    if not os.path.exists(db_path):
        print(f"Database file {db_path} not found!")
        return
    
    try:
        # Connect to the database
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check if customers table already exists
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='customers'")
        if cursor.fetchone():
            print("Customers table already exists. Skipping migration.")
            return
        
        print("Creating customers table...")
        
        # Create the customers table
        cursor.execute("""
            CREATE TABLE customers (
                id INTEGER PRIMARY KEY,
                name VARCHAR NOT NULL,
                phone VARCHAR,
                email VARCHAR,
                address VARCHAR,
                customer_type VARCHAR NOT NULL DEFAULT 'regular',
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Check if customer_id column exists in invoices table
        cursor.execute("PRAGMA table_info(invoices)")
        columns = [column[1] for column in cursor.fetchall()]
        
        if 'customer_id' not in columns:
            print("Adding customer_id column to invoices table...")
            cursor.execute("ALTER TABLE invoices ADD COLUMN customer_id INTEGER")
            
        # Create some sample regular customers
        print("Adding sample customers...")
        sample_customers = [
            ("John Doe", "+92 300 1234567", "john@example.com", "123 Main St, Karachi", "regular"),
            ("Ahmed Khan", "+92 321 9876543", "ahmed@example.com", "456 Oak Ave, Lahore", "regular"),
            ("Sarah Ali", "+92 333 5555555", "sarah@example.com", "789 Pine St, Islamabad", "regular"),
        ]
        
        for name, phone, email, address, customer_type in sample_customers:
            cursor.execute("""
                INSERT INTO customers (name, phone, email, address, customer_type)
                VALUES (?, ?, ?, ?, ?)
            """, (name, phone, email, address, customer_type))
        
        # Commit the changes
        conn.commit()
        
        print("Migration completed successfully!")
        print("Customers table created and sample data added.")
        
        # Verify the migration
        cursor.execute("SELECT COUNT(*) FROM customers")
        count = cursor.fetchone()[0]
        print(f"Total customers: {count}")
        
    except sqlite3.Error as e:
        print(f"Database error: {e}")
    except Exception as e:
        print(f"Error during migration: {e}")
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    print("Starting customer migration...")
    migrate_database()
    print("Migration process completed.")