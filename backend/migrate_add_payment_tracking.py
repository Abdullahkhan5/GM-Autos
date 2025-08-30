#!/usr/bin/env python3

import sqlite3
import os

def migrate_add_payment_tracking():
    # Get the database path
    db_path = os.path.join(os.path.dirname(__file__), '..', 'workshop.db')
    
    # Connect to the database
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        print("Adding payment tracking columns to invoices table...")
        
        # Add payment tracking columns to invoices table
        cursor.execute('ALTER TABLE invoices ADD COLUMN total_amount REAL')
        cursor.execute('ALTER TABLE invoices ADD COLUMN amount_paid REAL DEFAULT 0.0')
        cursor.execute('ALTER TABLE invoices ADD COLUMN outstanding_balance REAL')
        cursor.execute('ALTER TABLE invoices ADD COLUMN payment_status TEXT DEFAULT "unpaid"')
        
        print("Payment tracking columns added successfully!")
        
        # Update existing invoices with calculated values
        print("Updating existing invoices with payment data...")
        
        # Get all invoices and calculate their totals
        cursor.execute('''
            SELECT i.id, SUM(ii.price * ii.quantity) as total
            FROM invoices i
            LEFT JOIN invoice_items ii ON i.id = ii.invoice_id
            GROUP BY i.id
        ''')
        
        invoices = cursor.fetchall()
        
        for invoice_id, total_amount in invoices:
            if total_amount is None:
                total_amount = 0.0
            
            # Update invoice with calculated values
            cursor.execute('''
                UPDATE invoices 
                SET total_amount = ?, 
                    amount_paid = 0.0, 
                    outstanding_balance = ?, 
                    payment_status = "unpaid"
                WHERE id = ?
            ''', (total_amount, total_amount, invoice_id))
        
        print(f"Updated {len(invoices)} existing invoices with payment data.")
        
        # Commit the changes
        conn.commit()
        print("Migration completed successfully!")
        
    except sqlite3.Error as e:
        print(f"An error occurred: {e}")
        conn.rollback()
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    migrate_add_payment_tracking()