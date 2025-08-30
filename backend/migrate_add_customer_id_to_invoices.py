#!/usr/bin/env python3
"""
Migration script to add customer_id column to existing invoices table.
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
        
        # Check if customer_id column already exists in invoices table
        cursor.execute("PRAGMA table_info(invoices)")
        columns = [column[1] for column in cursor.fetchall()]
        
        if 'customer_id' in columns:
            print("customer_id column already exists in invoices table. Skipping migration.")
            return
        
        print("Adding customer_id column to invoices table...")
        
        # Add the customer_id column to invoices table
        cursor.execute("ALTER TABLE invoices ADD COLUMN customer_id INTEGER")
        
        # Commit the changes
        conn.commit()
        
        print("Migration completed successfully!")
        print("customer_id column added to invoices table.")
        
        # Verify the migration
        cursor.execute("PRAGMA table_info(invoices)")
        columns_after = [column[1] for column in cursor.fetchall()]
        print(f"Invoices table columns: {columns_after}")
        
    except sqlite3.Error as e:
        print(f"Database error: {e}")
    except Exception as e:
        print(f"Error during migration: {e}")
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    print("Starting invoices table migration...")
    migrate_database()
    print("Migration process completed.")