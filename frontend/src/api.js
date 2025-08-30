const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export async function fetchItems() {
  const res = await fetch(`${API_URL}/items`);
  return res.json();
}

export async function addItem(formData) {
  const res = await fetch(`${API_URL}/items`, {
    method: 'POST',
    body: formData,
  });
  return res.json();
}

export async function updateItem(id, formData) {
  const res = await fetch(`${API_URL}/items/${id}`, {
    method: 'PUT',
    body: formData,
  });
  return res.json();
}

export async function deleteItem(id) {
  const res = await fetch(`${API_URL}/items/${id}`, {
    method: 'DELETE',
  });
  return res.json();
}

export async function submitInvoice(invoiceData) {
  const res = await fetch(`${API_URL}/invoices`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(invoiceData),
  });
  if (!res.ok) throw new Error((await res.json()).detail || 'Failed to submit invoice');
  return res.json();
}

export async function fetchSalesTracker() {
  const res = await fetch(`${API_URL}/sales-tracker`);
  if (!res.ok) throw new Error('Failed to fetch sales tracker');
  return res.json();
}

export async function fetchInvoicesByDate(date) {
  const res = await fetch(`${API_URL}/invoices/by-date?date=${date}`);
  if (!res.ok) throw new Error('Failed to fetch invoices for date');
  return res.json();
}

// Customer API functions
export async function fetchCustomers() {
  const res = await fetch(`${API_URL}/customers`);
  if (!res.ok) throw new Error('Failed to fetch customers');
  return res.json();
}

export async function addCustomer(customerData) {
  const res = await fetch(`${API_URL}/customers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(customerData),
  });
  if (!res.ok) throw new Error('Failed to add customer');
  return res.json();
}

export async function updateCustomer(id, customerData) {
  const res = await fetch(`${API_URL}/customers/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(customerData),
  });
  if (!res.ok) throw new Error('Failed to update customer');
  return res.json();
}

export async function deleteCustomer(id) {
  const res = await fetch(`${API_URL}/customers/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete customer');
  return res.json();
}

export async function fetchCustomerOutstandingBalance(customerId) {
  const res = await fetch(`${API_URL}/customers/${customerId}/outstanding-balance`);
  if (!res.ok) throw new Error('Failed to fetch customer outstanding balance');
  return res.json();
} 