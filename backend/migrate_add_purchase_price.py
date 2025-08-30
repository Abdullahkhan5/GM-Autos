#!/usr/bin/env python3
"""
Migration script to add purchase_price column to existing items.
This script will set purchase_price equal to price for existing items.
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
        
        # Check if purchase_price column already exists
        cursor.execute("PRAGMA table_info(items)")
        columns = [column[1] for column in cursor.fetchall()]
        
        if 'purchase_price' in columns:
            print("purchase_price column already exists. Skipping migration.")
            return
        
        print("Adding purchase_price column to items table...")
        
        # Add the purchase_price column
        cursor.execute("ALTER TABLE items ADD COLUMN purchase_price REAL")
        
        # Update existing items to set purchase_price equal to price
        cursor.execute("UPDATE items SET purchase_price = price WHERE purchase_price IS NULL")
        
        # Commit the changes
        conn.commit()
        
        print("Migration completed successfully!")
        print("All existing items now have purchase_price set to their current price.")
        
        # Verify the migration
        cursor.execute("SELECT COUNT(*) FROM items WHERE purchase_price IS NOT NULL")
        count = cursor.fetchone()[0]
        print(f"Total items with purchase_price: {count}")
        
    except sqlite3.Error as e:
        print(f"Database error: {e}")
    except Exception as e:
        print(f"Error during migration: {e}")
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    print("Starting database migration...")
    migrate_database()
    print("Migration process completed.")
