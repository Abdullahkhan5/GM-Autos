import React, { useEffect, useState } from 'react';
import { fetchItems, addItem, updateItem, submitInvoice, fetchSalesTracker, fetchInvoicesByDate, fetchCustomers, addCustomer, updateCustomer, deleteCustomer, fetchCustomerOutstandingBalance, updateInvoicePayment } from './api';
import { Search, Plus, Edit3, Trash2, Package, Wrench, Droplet, Car, User, Phone, Mail, MapPin } from 'lucide-react';
import './App.css';
import Dashboard from './dashboard.jsx';

// Add delete function to your api.js file
async function deleteItem(id) {
  const res = await fetch(`http://127.0.0.1:8000/items/${id}`, {
    method: 'DELETE',
  });
  return res.json();
}

function ItemForm({ onSubmit, onCancel, initial, submitLabel }) {
  const [name, setName] = useState(initial?.name || '');
  const [price, setPrice] = useState(initial?.price || '');
  const [purchasePrice, setPurchasePrice] = useState(initial?.purchase_price || '');
  const [productCode, setProductCode] = useState(initial?.product_code || '');
  const [category, setCategory] = useState(initial?.category || '');
  const [quantity, setQuantity] = useState(initial?.quantity || 0);
  const [image, setImage] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('purchase_price', purchasePrice);
    formData.append('product_code', productCode);
    formData.append('category', category);
    formData.append('quantity', quantity);
    if (image) formData.append('image', image);
    onSubmit(formData);
  }

  return (
    <div className="modern-inventory-form-overlay">
      <div className="modern-inventory-form-container">
        <form className="modern-inventory-form" onSubmit={handleSubmit}>
          <h2 className="modern-inventory-form-title">
            {initial ? 'Edit Item' : 'Add New Item'}
          </h2>
          
          <div className="modern-inventory-form-group">
            <label className="modern-inventory-form-label">Item Name *</label>
            <input 
              className="modern-inventory-form-input"
              value={name} 
              onChange={e => setName(e.target.value)} 
              required 
              placeholder="Enter item name" 
            />
          </div>

          <div className="modern-inventory-form-row">
            <div className="modern-inventory-form-group">
              <label className="modern-inventory-form-label">Purchase Price (Rs) *</label>
              <input 
                className="modern-inventory-form-input"
                type="number" 
                value={purchasePrice} 
                onChange={e => setPurchasePrice(e.target.value)} 
                required 
                min="0"
                step="0.01"
                placeholder="Enter cost price" 
              />
            </div>
            <div className="modern-inventory-form-group">
              <label className="modern-inventory-form-label">Sales Price (Rs) *</label>
              <input 
                className="modern-inventory-form-input"
                type="number" 
                value={price} 
                onChange={e => setPrice(e.target.value)} 
                required 
                min="0"
                step="0.01"
                placeholder="Enter sales price" 
              />
            </div>
          </div>

          <div className="modern-inventory-form-row">
            <div className="modern-inventory-form-group">
              <label className="modern-inventory-form-label">Quantity *</label>
              <input 
                className="modern-inventory-form-input"
                type="number" 
                value={quantity} 
                min={0}
                onChange={e => setQuantity(Number(e.target.value))} 
                required 
                placeholder="Enter quantity" 
              />
            </div>
            <div className="modern-inventory-form-group">
              <label className="modern-inventory-form-label">Product Code *</label>
              <input 
                className="modern-inventory-form-input"
                value={productCode} 
                onChange={e => setProductCode(e.target.value)} 
                required 
                placeholder="Enter unique product code" 
              />
            </div>
          </div>

          <div className="modern-inventory-form-group">
            <label className="modern-inventory-form-label">Category *</label>
            <select 
              className="modern-inventory-form-select"
              value={category} 
              onChange={e => setCategory(e.target.value)} 
              required
            >
              <option value="">Select Category</option>
              <option value="Spare Parts">Spare Parts</option>
              <option value="Lubricants">Lubricants</option>
              <option value="Car Accessories">Car Accessories</option>
            </select>
          </div>

          <div className="modern-inventory-form-group">
            <label className="modern-inventory-form-label">Image</label>
            <input 
              className="modern-inventory-form-input"
              type="file" 
              accept="image/*" 
              onChange={e => setImage(e.target.files[0])} 
            />
          </div>

          <div className="modern-inventory-form-actions">
            <button type="button" className="modern-inventory-form-btn secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="modern-inventory-form-btn primary">
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CustomerForm({ onSubmit, onCancel, initial, submitLabel }) {
  const [name, setName] = useState(initial?.name || '');
  const [phone, setPhone] = useState(initial?.phone || '');
  const [email, setEmail] = useState(initial?.email || '');
  const [address, setAddress] = useState(initial?.address || '');

  function handleSubmit(e) {
    e.preventDefault();
    const customerData = {
      name,
      phone: phone || null,
      email: email || null,
      address: address || null,
      customer_type: 'regular'
    };
    onSubmit(customerData);
  }

  return (
    <div className="modern-inventory-form-overlay">
      <div className="modern-inventory-form-container">
        <form className="modern-inventory-form" onSubmit={handleSubmit}>
          <h2 className="modern-inventory-form-title">
            {initial ? 'Edit Customer' : 'Add New Customer'}
          </h2>
          
          <div className="modern-inventory-form-group">
            <label className="modern-inventory-form-label">Customer Name *</label>
            <input 
              className="modern-inventory-form-input"
              value={name} 
              onChange={e => setName(e.target.value)} 
              required 
              placeholder="Enter customer name" 
            />
          </div>

          <div className="modern-inventory-form-group">
            <label className="modern-inventory-form-label">Phone Number</label>
            <input 
              className="modern-inventory-form-input"
              value={phone} 
              onChange={e => setPhone(e.target.value)} 
              placeholder="Enter phone number" 
            />
          </div>

          <div className="modern-inventory-form-group">
            <label className="modern-inventory-form-label">Email Address</label>
            <input 
              className="modern-inventory-form-input"
              type="email"
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="Enter email address" 
            />
          </div>

          <div className="modern-inventory-form-group">
            <label className="modern-inventory-form-label">Address</label>
            <textarea 
              className="modern-inventory-form-input"
              value={address} 
              onChange={e => setAddress(e.target.value)} 
              placeholder="Enter customer address"
              rows={3}
            />
          </div>

          <div className="modern-inventory-form-actions">
            <button type="button" className="modern-inventory-form-btn secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="modern-inventory-form-btn primary">
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CustomerManagement({ loading }) {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editCustomer, setEditCustomer] = useState(null);
  const [loadingCustomers, setLoadingCustomers] = useState(false);

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    try {
      setLoadingCustomers(true);
      const data = await fetchCustomers();
      setCustomers(data);
    } catch (error) {
      console.error('Failed to load customers:', error);
      alert('Failed to load customers');
    } finally {
      setLoadingCustomers(false);
    }
  }

  async function handleAdd(customerData) {
    try {
      const newCustomer = await addCustomer(customerData);
      setCustomers(customers => [...customers, newCustomer]);
      setShowAdd(false);
    } catch (error) {
      console.error('Failed to add customer:', error);
      alert('Failed to add customer');
    }
  }

  async function handleEdit(id, customerData) {
    try {
      const updated = await updateCustomer(id, customerData);
      setCustomers(customers => customers.map(c => (c.id === id ? updated : c)));
      setEditCustomer(null);
    } catch (error) {
      console.error('Failed to update customer:', error);
      alert('Failed to update customer');
    }
  }

  async function handleDelete(customerId) {
    if (window.confirm('Are you sure you want to delete this customer? This will also affect their associated invoices.')) {
      try {
        await deleteCustomer(customerId);
        setCustomers(customers => customers.filter(c => c.id !== customerId));
      } catch (error) {
        console.error('Failed to delete customer:', error);
        alert('Failed to delete customer');
      }
    }
  }

  // Filter customers based on search
  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.phone && customer.phone.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loadingCustomers) {
    return (
      <div className="modern-inventory-loading">
        <div className="modern-inventory-spinner"></div>
        <p>Loading customers...</p>
      </div>
    );
  }

  return (
    <div className="modern-inventory-container">
      {/* Page Title and Add Button */}
      <div className="modern-inventory-page-header">
        <div>
          <h2 className="modern-inventory-page-title">Customer Management</h2>
          <p className="modern-inventory-page-description">Manage your regular customers</p>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="modern-inventory-add-btn"
        >
          <Plus size={20} />
          Add New Customer
        </button>
      </div>

      {/* Search Bar */}
      <div className="modern-inventory-search-container">
        <Search className="modern-inventory-search-icon" />
        <input
          type="text"
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="modern-inventory-search-input"
        />
      </div>

      {/* Customer Forms */}
      {(showAdd || editCustomer) && (
        <CustomerForm 
          onSubmit={editCustomer ? (customerData) => handleEdit(editCustomer.id, customerData) : handleAdd}
          onCancel={() => {
            setShowAdd(false);
            setEditCustomer(null);
          }}
          initial={editCustomer}
          submitLabel={editCustomer ? "Update Customer" : "Add Customer"}
        />
      )}

      {/* Customers Grid */}
      <div className="modern-inventory-grid">
        {filteredCustomers.map((customer) => (
          <div key={customer.id} className="modern-inventory-card">
            {/* Customer Header */}
            <div className="modern-inventory-card-header">
              <div className="modern-inventory-card-info">
                <User className="modern-inventory-card-icon" />
                <div>
                  <h3 className="modern-inventory-card-title">{customer.name}</h3>
                  <p className="modern-inventory-card-category">Regular Customer</p>
                </div>
              </div>
            </div>

            {/* Customer Details */}
            <div className="modern-inventory-card-details">
              {customer.phone && (
                <div className="modern-inventory-detail-row">
                  <span className="modern-inventory-detail-label">
                    <Phone size={14} style={{ marginRight: '4px' }} />
                    Phone
                  </span>
                  <span className="modern-inventory-detail-value">{customer.phone}</span>
                </div>
              )}
              {customer.email && (
                <div className="modern-inventory-detail-row">
                  <span className="modern-inventory-detail-label">
                    <Mail size={14} style={{ marginRight: '4px' }} />
                    Email
                  </span>
                  <span className="modern-inventory-detail-value">{customer.email}</span>
                </div>
              )}
              {customer.address && (
                <div className="modern-inventory-detail-row">
                  <span className="modern-inventory-detail-label">
                    <MapPin size={14} style={{ marginRight: '4px' }} />
                    Address
                  </span>
                  <span className="modern-inventory-detail-value">{customer.address}</span>
                </div>
              )}
              <div className="modern-inventory-detail-row">
                <span className="modern-inventory-detail-label">Joined</span>
                <span className="modern-inventory-detail-value">
                  {new Date(customer.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="modern-inventory-actions">
              <button 
                className="modern-inventory-action-btn edit"
                onClick={() => setEditCustomer(customer)}
              >
                <Edit3 size={16} />
                Edit
              </button>
              <button 
                className="modern-inventory-action-btn delete"
                onClick={() => handleDelete(customer.id)}
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCustomers.length === 0 && !loadingCustomers && (
        <div className="modern-inventory-empty">
          <User className="modern-inventory-empty-icon" size={64} />
          <h3 className="modern-inventory-empty-title">No customers found</h3>
          <p className="modern-inventory-empty-description">
            {searchTerm 
              ? 'Try adjusting your search criteria'
              : 'Get started by adding your first customer'
            }
          </p>
          {!searchTerm && (
            <button 
              onClick={() => setShowAdd(true)}
              className="modern-inventory-add-btn"
              style={{ marginTop: '1rem' }}
            >
              Add Your First Customer
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function ModernInventoryList({ items, onAddItem, onEditItem, onDeleteItem, loading }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  const categories = [
    { name: 'All Categories', icon: Package },
    { name: 'Spare Parts', icon: Wrench },
    { name: 'Lubricants', icon: Droplet },
    { name: 'Car Accessories', icon: Car }
  ];

  // Filter items based on search and category
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.product_code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'modern-inventory-stock-out' };
    if (stock <= 5) return { label: 'Low Stock', color: 'modern-inventory-stock-low' };
    return { label: 'In Stock', color: 'modern-inventory-stock-in' };
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Spare Parts': return <Wrench className="modern-inventory-card-icon" />;
      case 'Lubricants': return <Droplet className="modern-inventory-card-icon" />;
      case 'Car Accessories': return <Car className="modern-inventory-card-icon" />;
      default: return <Package className="modern-inventory-card-icon" />;
    }
  };

  if (loading) {
    return (
      <div className="modern-inventory-loading">
        <div className="modern-inventory-spinner"></div>
        <p>Loading inventory...</p>
      </div>
    );
  }

  return (
    <div className="modern-inventory-container">
      {/* Page Title */}
      <div className="modern-inventory-page-header">
        <div>
          <h2 className="modern-inventory-page-title">Inventory Management</h2>
          <p className="modern-inventory-page-description">Track and manage your auto parts stock</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="modern-inventory-search-container">
        <Search className="modern-inventory-search-icon" />
        <input
          type="text"
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="modern-inventory-search-input"
        />
      </div>

      {/* Category Filters */}
      <div className="modern-inventory-filters">
        {categories.map((category) => {
          const Icon = category.icon;
          const isActive = selectedCategory === category.name;
          return (
            <button
              key={category.name}
              onClick={() => setSelectedCategory(category.name)}
              className={`modern-inventory-filter-btn ${isActive ? 'active' : ''}`}
            >
              <Icon size={16} />
              {category.name}
            </button>
          );
        })}
      </div>

      {/* Items Grid */}
      <div className="modern-inventory-grid">
        {filteredItems.map((item) => {
          const stockStatus = getStockStatus(item.quantity);
          return (
            <div key={item.id} className="modern-inventory-card">
              {/* Item Header */}
              <div className="modern-inventory-card-header">
                <div className="modern-inventory-card-info">
                  {getCategoryIcon(item.category)}
                  <div>
                    <h3 className="modern-inventory-card-title">{item.name}</h3>
                    <p className="modern-inventory-card-category">{item.category}</p>
                  </div>
                </div>
                <span className={`modern-inventory-stock-badge ${stockStatus.color}`}>
                  {stockStatus.label}
                </span>
              </div>

              {/* Item Details */}
              <div className="modern-inventory-card-details">
                <div className="modern-inventory-detail-row">
                  <span className="modern-inventory-detail-label">Stock</span>
                  <span className="modern-inventory-detail-value">{item.quantity} units</span>
                </div>
                <div className="modern-inventory-detail-row">
                  <span className="modern-inventory-detail-label">Price</span>
                  <span className="modern-inventory-detail-value sales-price">Rs. {item.price.toLocaleString()}</span>
                </div>
                <div className="modern-inventory-detail-row">
                  <span className="modern-inventory-detail-label">Product Code</span>
                  <span className="modern-inventory-detail-value">{item.product_code}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && !loading && (
        <div className="modern-inventory-empty">
          <Package className="modern-inventory-empty-icon" size={64} />
          <h3 className="modern-inventory-empty-title">No items found</h3>
          <p className="modern-inventory-empty-description">
            {searchTerm || selectedCategory !== 'All Categories' 
              ? 'Try adjusting your search or filter criteria'
              : 'Get started by adding your first inventory item'
            }
          </p>
          {(!searchTerm && selectedCategory === 'All Categories') && (
            <button 
              onClick={onAddItem}
              className="modern-inventory-add-btn"
              style={{ marginTop: '1rem' }}
            >
              Add Your First Item
            </button>
          )}
        </div>
      )}
    </div>
  );
}
function SalesInvoiceForm({ items = [], onBack, onInvoiceCreated }) {
  const [lines, setLines] = useState([]);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [customerType, setCustomerType] = useState('walk-in'); // 'walk-in' or 'regular'
  const [amountPaid, setAmountPaid] = useState('');
  const [outstandingBalance, setOutstandingBalance] = useState(0);
  const [loadingOutstanding, setLoadingOutstanding] = useState(false);

  // Filter out items with zero quantity
  const availableItems = items.filter(item => item.quantity > 0);

  useEffect(() => {
    if (availableItems.length > 0 && lines.length === 0) {
      setLines([{ productId: availableItems[0].id.toString(), quantity: 1 }]);
    }
  }, [availableItems]);

  useEffect(() => {
    // Load customers on component mount
    loadCustomers();
  }, []);

  async function loadCustomers() {
    try {
      const data = await fetchCustomers();
      setCustomers(data);
    } catch (error) {
      console.error('Failed to load customers:', error);
    }
  }

  // Handle customer type change
  function handleCustomerTypeChange(type) {
    setCustomerType(type);
    if (type === 'walk-in') {
      setSelectedCustomerId('');
      setClientName('');
      setClientPhone('');
      setOutstandingBalance(0);
    } else {
      // If switching to regular, clear walk-in fields
      setClientName('');
      setClientPhone('');
      setOutstandingBalance(0);
    }
  }

  // Handle regular customer selection
  async function handleCustomerSelection(customerId) {
    setSelectedCustomerId(customerId);
    const customer = customers.find(c => c.id.toString() === customerId);
    if (customer) {
      setClientName(customer.name);
      setClientPhone(customer.phone || '');
      
      // Fetch outstanding balance for this customer
      try {
        setLoadingOutstanding(true);
        const balanceData = await fetchCustomerOutstandingBalance(customerId);
        setOutstandingBalance(balanceData.outstanding_balance || 0);
      } catch (error) {
        console.error('Failed to fetch outstanding balance:', error);
        setOutstandingBalance(0);
      } finally {
        setLoadingOutstanding(false);
      }
    }
  }

  // Calculate total amount
  const calculateTotal = () => {
    return lines.reduce((total, line) => {
      const product = availableItems.find(item => item.id.toString() === line.productId);
      if (product) {
        return total + (product.price * line.quantity);
      }
      return total;
    }, 0);
  };

  function handleLineChange(idx, field, value) {
    setLines(lines => lines.map((line, i) => {
      if (i !== idx) return line;
      
      if (field === 'productId') {
        return { ...line, productId: value, quantity: 1 };
      }
      
      if (field === 'quantity') {
        const numValue = parseInt(value) || 1;
        const product = availableItems.find(item => item.id.toString() === line.productId);
        const maxQty = product ? product.quantity : 1;
        return { ...line, quantity: Math.min(Math.max(1, numValue), maxQty) };
      }
      
      return { ...line, [field]: value };
    }));
  }

  function addLine() {
    const defaultProductId = availableItems.length > 0 ? availableItems[0].id.toString() : '';
    setLines(lines => [...lines, { productId: defaultProductId, quantity: 1 }]);
  }

  function removeLine(idx) {
    if (lines.length > 1) {
      setLines(lines => lines.filter((_, i) => i !== idx));
    }
  }

  async function handleSubmit() {
    // Validation for customer information
    if (customerType === 'regular') {
      if (!selectedCustomerId) {
        alert('Please select a customer.');
        return;
      }
    } else {
      if (!clientName.trim()) {
        alert('Please enter the customer name.');
        return;
      }
    }
    
    // Validation logic
    const validationResults = lines.map((line) => {
      const hasProduct = !!line.productId && line.productId !== '';
      const product = availableItems.find(item => item.id.toString() === line.productId);
      const qty = line.quantity;
      
      return (
        hasProduct &&
        product &&
        qty > 0 &&
        qty <= product.quantity
      );
    });

    const isAllValid = validationResults.every(result => result === true);
    
    if (!isAllValid) {
      const invalidLines = validationResults
        .map((valid, idx) => valid ? null : idx + 1)
        .filter(Boolean);
      alert(`Please check line(s) ${invalidLines.join(', ')} for valid products and quantities.`);
      return;
    }

    const totalAmount = calculateTotal();
    const paidAmount = amountPaid === '' ? 0 : parseFloat(amountPaid) || 0;
    
    const invoiceData = {
      lines: lines.map(line => ({
        productId: parseInt(line.productId),
        quantity: parseInt(line.quantity)
      })),
      customer_id: customerType === 'regular' && selectedCustomerId ? parseInt(selectedCustomerId) : null,
      client_name: clientName.trim(),
      client_phone: clientPhone.trim() || null,
      total_amount: totalAmount,
      amount_paid: paidAmount,
      outstanding_balance: totalAmount - paidAmount,
      payment_status: paidAmount >= totalAmount ? 'paid' : (paidAmount > 0 ? 'partial' : 'unpaid')
    };
    
    try {
      await submitInvoice(invoiceData);
      alert('Invoice submitted successfully!');
      if (onInvoiceCreated) onInvoiceCreated();
    } catch (err) {
      alert(err.message || 'Failed to submit invoice.');
    }
  }

  if (availableItems.length === 0) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#f8fafc',
        padding: '2rem 1rem'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '3rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}>📦</div>
            <h3 style={{ margin: '0 0 1rem 0', color: '#374151' }}>No Items Available</h3>
            <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
              All products are currently out of stock. Please restock inventory before creating invoices.
            </p>
            <button 
              onClick={onBack}
              style={{
                background: '#f3f4f6',
                color: '#374151',
                border: '1px solid #e5e7eb',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Back to Inventory
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#f8fafc',
      padding: '2rem 1rem'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.75rem',
          marginBottom: '2rem'
        }}>
          <div style={{ 
            background: '#3b82f6', 
            color: 'white', 
            padding: '0.75rem',
            borderRadius: '8px',
            fontSize: '1.25rem'
          }}>
            📋
          </div>
          <h1 style={{ 
            margin: 0, 
            fontSize: '1.875rem', 
            fontWeight: '600',
            color: '#111827'
          }}>
            Create Sales Invoice
          </h1>
        </div>

        <div>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            marginBottom: '1.5rem'
          }}>
            {/* Client Information */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ 
                margin: '0 0 0.5rem 0', 
                fontSize: '1.125rem', 
                fontWeight: '600',
                color: '#111827'
              }}>
                Customer Information
              </h3>
              
              {/* Customer Type Selection */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Customer Type <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="customerType"
                      value="walk-in"
                      checked={customerType === 'walk-in'}
                      onChange={e => handleCustomerTypeChange(e.target.value)}
                      style={{ margin: 0 }}
                    />
                    <span>Walk-in Customer</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="customerType"
                      value="regular"
                      checked={customerType === 'regular'}
                      onChange={e => handleCustomerTypeChange(e.target.value)}
                      style={{ margin: 0 }}
                    />
                    <span>Regular Customer</span>
                  </label>
                </div>
              </div>

              {/* Regular Customer Selection */}
              {customerType === 'regular' && (
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151'
                  }}>
                    Select Customer <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <select
                    value={selectedCustomerId}
                    onChange={e => handleCustomerSelection(e.target.value)}
                    required={customerType === 'regular'}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      background: 'white',
                      boxSizing: 'border-box',
                      outline: 'none'
                    }}
                  >
                    <option value="">Select a customer</option>
                    {customers.map(customer => (
                      <option key={customer.id} value={customer.id.toString()}>
                        {customer.name} {customer.phone ? `(${customer.phone})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Walk-in Customer Fields */}
              {customerType === 'walk-in' && (
                <div style={{ 
                  display: window.innerWidth > 768 ? 'grid' : 'block',
                  gridTemplateColumns: window.innerWidth > 768 ? '1fr 1fr' : '1fr',
                  gap: '1rem',
                  marginTop: '1rem'
                }}>
                  <div style={{ marginBottom: window.innerWidth <= 768 ? '1rem' : '0' }}>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#374151'
                    }}>
                      Customer Name <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input 
                      type="text"
                      value={clientName} 
                      onChange={e => setClientName(e.target.value)} 
                      placeholder="Enter customer name"
                      required
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        boxSizing: 'border-box',
                        outline: 'none'
                      }}
                      onFocus={e => e.target.style.borderColor = '#3b82f6'}
                      onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                    />
                  </div>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#374151'
                    }}>
                      Phone Number
                    </label>
                    <input 
                      type="text"
                      value={clientPhone} 
                      onChange={e => setClientPhone(e.target.value)} 
                      placeholder="Enter phone number"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        boxSizing: 'border-box',
                        outline: 'none'
                      }}
                      onFocus={e => e.target.style.borderColor = '#3b82f6'}
                      onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                    />
                  </div>
                </div>
              )}

              {/* Display selected customer info for regular customers */}
              {customerType === 'regular' && selectedCustomerId && (
                <div style={{
                  background: '#f0f9ff',
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '1px solid #e0f2fe',
                  marginTop: '1rem'
                }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#0c4a6e' }}>Selected Customer:</h4>
                  <p style={{ margin: '0 0 0.25rem 0', fontWeight: '500' }}>{clientName}</p>
                  {clientPhone && <p style={{ margin: '0 0 0.5rem 0', color: '#64748b' }}>{clientPhone}</p>}
                </div>
              )}
            </div>

            {/* Invoice Items */}
            <div>
              <h3 style={{ 
                margin: '0 0 0.5rem 0', 
                fontSize: '1.125rem', 
                fontWeight: '600',
                color: '#111827'
              }}>
                Invoice Items
              </h3>
              <p style={{ 
                margin: '0 0 1.5rem 0', 
                color: '#6b7280',
                fontSize: '0.875rem'
              }}>
                Add products and quantities for this invoice
              </p>

              {lines.map((line, idx) => {
                const product = availableItems.find(item => item.id.toString() === line.productId);
                const lineTotal = product ? product.price * line.quantity : 0;
                
                return (
                  <div key={idx} style={{
                    background: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '1.5rem',
                    marginBottom: '1rem'
                  }}>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: window.innerWidth > 768 ? '2fr 140px 140px 120px' : '1fr',
                      gap: '1rem',
                      alignItems: 'end'
                    }}>
                      {/* Product */}
                      <div>
                        <label style={{ 
                          display: 'block', 
                          marginBottom: '0.5rem',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          color: '#374151'
                        }}>
                          Product
                        </label>
                        <select
                          value={line.productId}
                          onChange={e => handleLineChange(idx, 'productId', e.target.value)}
                          required
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            background: 'white',
                            boxSizing: 'border-box',
                            outline: 'none',
                            height: '3rem'
                          }}
                        >
                          <option value="">Select a product</option>
                          {availableItems.map(item => (
                            <option key={item.id} value={item.id.toString()}>
                              {item.name} (Stock: {item.quantity})
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      {/* Quantity */}
                      <div>
                        <label style={{ 
                          display: 'block', 
                          marginBottom: '0.5rem',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          color: '#374151'
                        }}>
                          Quantity
                        </label>
                        <div style={{ position: 'relative' }}>
                          <input
                            type="number"
                            min={1}
                            max={product ? product.quantity : 1}
                            value={line.quantity}
                            onChange={e => handleLineChange(idx, 'quantity', e.target.value)}
                            required
                            style={{
                              width: '100%',
                              padding: '0.75rem',
                              paddingRight: '3.5rem',
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px',
                              fontSize: '1rem',
                              boxSizing: 'border-box',
                              outline: 'none',
                              height: '3rem'
                            }}
                          />
                          <div style={{
                            position: 'absolute',
                            right: '0.75rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            fontSize: '0.875rem',
                            color: '#6b7280',
                            pointerEvents: 'none',
                            fontWeight: '500'
                          }}>
                            /{product ? product.quantity : 0}
                          </div>
                        </div>
                      </div>
                      
                      {/* Price */}
                      <div>
                        <label style={{ 
                          display: 'block', 
                          marginBottom: '0.5rem',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          color: '#374151'
                        }}>
                          Price
                        </label>
                        <div style={{
                          padding: '0.75rem',
                          background: '#f3f4f6',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '1rem',
                          color: '#3b82f6',
                          fontWeight: '600',
                          height: '3rem',
                          display: 'flex',
                          alignItems: 'center',
                          boxSizing: 'border-box'
                        }}>
                          Rs. {lineTotal.toFixed(2)}
                        </div>
                      </div>
                      
                      {/* Remove Button */}
                      <div>
                        <label style={{ 
                          display: 'block', 
                          marginBottom: '0.5rem',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          color: 'transparent'
                        }}>
                          Action
                        </label>
                        <button 
                          type="button" 
                          onClick={() => removeLine(idx)} 
                          disabled={lines.length === 1}
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            background: lines.length === 1 ? '#f3f4f6' : '#fef2f2',
                            color: lines.length === 1 ? '#9ca3af' : '#ef4444',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            cursor: lines.length === 1 ? 'not-allowed' : 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            height: '3rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                          }}
                        >
                          🗑️ Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {/* Add Item Button */}
              <div style={{ textAlign: 'center', margin: '1.5rem 0' }}>
                <button 
                  type="button" 
                  onClick={addLine}
                  style={{
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    margin: '0 auto'
                  }}
                >
                  ➕ Add Item
                </button>
              </div>
            </div>
          </div>

          {/* Total Amount */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '1.5rem 2rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            marginBottom: '1.5rem'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <span style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#111827'
              }}>
                Total Amount:
              </span>
              <span style={{
                fontSize: '1.875rem',
                fontWeight: 'bold',
                color: '#3b82f6'
              }}>
                Rs. {calculateTotal().toFixed(2)}
              </span>
            </div>

            {/* Customer Outstanding Balance */}
            {customerType === 'regular' && selectedCustomerId && (
              <div style={{
                borderTop: '1px solid #f3f4f6',
                paddingTop: '1rem',
                marginTop: '1rem'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#dc2626'
                  }}>
                    Customer Outstanding Balance:
                  </span>
                  {loadingOutstanding ? (
                    <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>Loading...</span>
                  ) : (
                    <span style={{
                      fontWeight: '700',
                      color: outstandingBalance > 0 ? '#dc2626' : '#059669',
                      fontSize: '1.25rem'
                    }}>
                      Rs. {outstandingBalance.toLocaleString()}
                    </span>
                  )}
                </div>
                {outstandingBalance > 0 && (
                  <p style={{
                    margin: '0.5rem 0 0 0',
                    fontSize: '0.875rem',
                    color: '#dc2626',
                    fontStyle: 'italic'
                  }}>
                    This includes previous unpaid invoices
                  </p>
                )}
              </div>
            )}
            
            {/* Payment Amount */}
            <div style={{
              borderTop: '1px solid #f3f4f6',
              paddingTop: '1.5rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                flexWrap: 'wrap'
              }}>
                <label style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#111827',
                  minWidth: '150px'
                }}>
                  Amount Paid:
                </label>
                <input
                  type="number"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(e.target.value)}
                  placeholder="Enter amount paid"
                  min="0"
                  max={calculateTotal()}
                  step="0.01"
                  style={{
                    padding: '0.75rem 1rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    width: '200px',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
                <span style={{
                  fontSize: '1rem',
                  color: '#6b7280'
                }}>
                  Rs.
                </span>
              </div>
              
              {/* Payment Status */}
              {amountPaid && (
                <div style={{ marginTop: '1rem' }}>
                  {(() => {
                    const total = calculateTotal();
                    const paid = parseFloat(amountPaid) || 0;
                    if (paid >= total) {
                      return (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          color: '#10b981',
                          fontSize: '0.875rem',
                          fontWeight: '500'
                        }}>
                          <span style={{ fontSize: '1rem' }}>✓</span>
                          Fully Paid
                        </div>
                      );
                    } else if (paid > 0) {
                      return (
                        <div>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            color: '#f59e0b',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            marginBottom: '0.25rem'
                          }}>
                            <span style={{ fontSize: '1rem' }}>⚠</span>
                            Partial Payment
                          </div>
                          <div style={{
                            fontSize: '0.875rem',
                            color: '#dc2626',
                            fontWeight: '500'
                          }}>
                            Outstanding: Rs. {(total - paid).toFixed(2)}
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          color: '#dc2626',
                          fontSize: '0.875rem',
                          fontWeight: '500'
                        }}>
                          <span style={{ fontSize: '1rem' }}>⚠</span>
                          Unpaid
                        </div>
                      );
                    }
                  })()}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
            gap: '1rem'
          }}>
            <button 
              type="button" 
              onClick={onBack}
              style={{
                flex: '1',
                background: '#f3f4f6',
                color: '#374151',
                border: '1px solid #e5e7eb',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500'
              }}
            >
              Back to Inventory
            </button>
            <button 
              type="button"
              onClick={handleSubmit}
              style={{
                flex: '1',
                background: '#10b981',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500'
              }}
            >
              Submit Invoice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
function SalesTrackerTab({ onViewDetails }) {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [month, setMonth] = useState('all');

  useEffect(() => {
    fetchSalesTracker()
      .then(setSales)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const grouped = {};
  sales.forEach(entry => {
    const date = new Date(entry.date).toISOString().slice(0, 10);
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(entry);
  });

  const months = Array.from(new Set(sales.map(entry => new Date(entry.date).toISOString().slice(0, 7))));

  const filteredDates = Object.keys(grouped).filter(date => {
    const monthMatch = month === 'all' || date.slice(0, 7) === month;
    return monthMatch;
  });

  const totalItems = sales.reduce((sum, e) => sum + e.quantity, 0);
  const totalRevenue = sales.reduce((sum, e) => sum + e.revenue, 0);
  const activeDays = new Set(sales.map(e => new Date(e.date).toISOString().slice(0, 10))).size;
  const itemsPerDay = activeDays ? (totalItems / activeDays).toFixed(1) : 0;

  if (loading) return <div className="card">Loading sales tracker...</div>;
  if (error) return <div className="card">Error: {error}</div>;
  if (sales.length === 0) return <div className="card empty-state"><i className="fas fa-box-open"></i><br/>No sales yet.</div>;

  return (
    <div className="modern-inventory-container">
      {/* Page Title */}
      <div className="modern-inventory-page-header">
        <div>
          <h2 className="modern-inventory-page-title">Sales Tracker</h2>
          <p className="modern-inventory-page-description">Monitor daily sales performance and revenue</p>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="sales-tracker-controls">
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
          maxWidth: '400px'
        }}>
          <div className="modern-inventory-form-group">
            <label className="modern-inventory-form-label">
              Select Month & Year
            </label>
            <select 
              value={month} 
              onChange={e => setMonth(e.target.value)}
              className="modern-inventory-form-select"
            >
              <option value="all">All Months</option>
              {months.map(m => (
                <option key={m} value={m}>
                  {new Date(m + '-01').toLocaleString('default', { month: 'long', year: 'numeric' })}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="sales-tracker-summary-grid">
          <div className="sales-tracker-summary-card">
            <div className="sales-tracker-summary-number">
              {totalItems}
            </div>
            <div className="sales-tracker-summary-label">Total Items Sold</div>
          </div>
          <div className="sales-tracker-summary-card">
            <div className="sales-tracker-summary-number">
              Rs {totalRevenue.toLocaleString()}
            </div>
            <div className="sales-tracker-summary-label">Total Revenue</div>
          </div>
          <div className="sales-tracker-summary-card">
            <div className="sales-tracker-summary-number">
              {activeDays}
            </div>
            <div className="sales-tracker-summary-label">Active Days</div>
          </div>
          <div className="sales-tracker-summary-card">
            <div className="sales-tracker-summary-number">
              {itemsPerDay}
            </div>
            <div className="sales-tracker-summary-label">Items per Day</div>
          </div>
        </div>
      </div>
      {/* Sales Data Table */}
      <div className="sales-tracker-table-container">
        {filteredDates.length === 0 ? (
          <div style={{
            padding: '4rem 2rem',
            textAlign: 'center',
            color: '#6b7280'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#374151' }}>No sales data found</h3>
            <p style={{ margin: 0 }}>No sales found for the selected filters.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="sales-tracker-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Items Sold by Category</th>
                  <th>Total Items</th>
                  <th>Daily Revenue</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDates.map(date => {
                  const daySales = grouped[date];
                  const day = new Date(date);
                  const dayName = day.toLocaleString('default', { weekday: 'long' });
                  const catCounts = { 'Spare Parts': 0, 'Lubricants': 0, 'Car Accessories': 0 };
                  let dayRevenue = 0;
                  daySales.forEach(e => {
                    catCounts[e.category] = (catCounts[e.category] || 0) + e.quantity;
                    dayRevenue += e.revenue;
                  });
                  const total = daySales.reduce((sum, e) => sum + e.quantity, 0);
                  return (
                    <tr key={date}>
                      <td>
                        <div className="sales-tracker-date-cell">
                          {day.toLocaleDateString()}
                        </div>
                        <div className="sales-tracker-day-name">
                          {dayName}
                        </div>
                      </td>
                      <td>
                        <div className="category-breakdown-consistent">
                          <div className="category-item-consistent category-spare-parts">
                            <span>Spare Parts:</span>
                            <span className="category-item-value">{catCounts['Spare Parts']} items</span>
                          </div>
                          <div className="category-item-consistent category-lubricants">
                            <span>Lubricants:</span>
                            <span className="category-item-value">{catCounts['Lubricants']} items</span>
                          </div>
                          <div className="category-item-consistent category-accessories">
                            <span>Car Accessories:</span>
                            <span className="category-item-value">{catCounts['Car Accessories']} items</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="sales-tracker-total-cell">{total}</span>
                      </td>
                      <td>
                        <span className="sales-tracker-revenue-cell">
                          Rs {dayRevenue.toLocaleString()}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button 
                          onClick={() => onViewDetails(date)}
                          className="view-details-btn"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function ChangePassword({ onSuccess, onCancel }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    
    const storedPassword = localStorage.getItem('sitePassword');
    
    if (currentPassword !== storedPassword) {
      setError('Current password is incorrect.');
      return;
    }
    
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
    
    // Update password in localStorage
    localStorage.setItem('sitePassword', newPassword);
    onSuccess();
  }

  return (
    <div className="modern-inventory-form-overlay">
      <div className="modern-inventory-form-container">
        <form className="modern-inventory-form" onSubmit={handleSubmit}>
          <h2 className="modern-inventory-form-title">
            🔑 Change Site Password
          </h2>

          <div className="modern-inventory-form-group">
            <label className="modern-inventory-form-label">Current Password *</label>
            <input 
              className="modern-inventory-form-input"
              type="password"
              value={currentPassword} 
              onChange={e => setCurrentPassword(e.target.value)} 
              required 
              placeholder="Enter current password"
              autoFocus
            />
          </div>

          <div className="modern-inventory-form-group">
            <label className="modern-inventory-form-label">New Password *</label>
            <input 
              className="modern-inventory-form-input"
              type="password"
              value={newPassword} 
              onChange={e => setNewPassword(e.target.value)} 
              required 
              placeholder="Enter new password (min 6 characters)"
            />
          </div>

          <div className="modern-inventory-form-group">
            <label className="modern-inventory-form-label">Confirm New Password *</label>
            <input 
              className="modern-inventory-form-input"
              type="password"
              value={confirmPassword} 
              onChange={e => setConfirmPassword(e.target.value)} 
              required 
              placeholder="Confirm new password"
            />
          </div>

          {error && (
            <p style={{ 
              color: '#ef4444', 
              fontSize: '0.875rem', 
              marginTop: '0.5rem',
              textAlign: 'center'
            }}>
              {error}
            </p>
          )}

          <div className="modern-inventory-form-actions">
            <button type="button" className="modern-inventory-form-btn secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="modern-inventory-form-btn primary">
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


function AdminPortal({ items, onAddItem, onEditItem, onDeleteItem, loading, onViewDetails, onInvoiceCreated, onBack }) {
  const [adminView, setAdminView] = useState('overview');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  if (loading) {
    return (
      <div className="modern-inventory-loading">
        <div className="modern-inventory-spinner"></div>
        <p>Loading admin portal...</p>
      </div>
    );
  }

  const adminMenuItems = [
    { id: 'overview', label: 'Admin Overview', icon: '🏠' },
    { id: 'inventory', label: 'Purchase Management', icon: '💰' },
    { id: 'customers', label: 'Customer Management', icon: '👥' },
    { id: 'invoices', label: 'Create Sales Invoice', icon: '🧾' },
    { id: 'sales', label: 'Sales Tracker', icon: '📈' },
  ];

  const handleBackToSales = () => {
    setSelectedDate(null);
    setAdminView('sales');
  };

  const handleViewDetailsFromSales = (date) => {
    setSelectedDate(date);
    setAdminView('invoice-details');
  };

  const renderContent = () => {
    switch (adminView) {
      case 'overview':
        return <AdminOverview onNavigate={setAdminView} />;
      case 'inventory':
        return <PurchaseManagement items={items} onAddItem={onAddItem} onEditItem={onEditItem} onDeleteItem={onDeleteItem} />;
      case 'customers':
        return <CustomerManagement loading={loading} />;
      case 'invoices':
        return <SalesInvoiceForm items={items} onBack={() => setAdminView('overview')} onInvoiceCreated={onInvoiceCreated} />;
      case 'sales':
        return <SalesTrackerTab onViewDetails={handleViewDetailsFromSales} />;
      case 'invoice-details':
        return <InvoiceDetailsTab selectedDate={selectedDate} onBack={handleBackToSales} />;
      default:
        return <AdminOverview onNavigate={setAdminView} />;
    }
  };

  return (
    <div className="modern-inventory-container">
      {/* Admin Portal Header */}
      <div className="modern-inventory-page-header">
        <div>
          <h2 className="modern-inventory-page-title">Admin Portal</h2>
          <p className="modern-inventory-page-description">Administrative tools and management</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button 
            onClick={() => setShowChangePassword(true)}
            className="modern-inventory-add-btn"
            style={{ background: '#f59e0b', borderColor: '#f59e0b' }}
          >
            🔑 Change Site Password
          </button>
        </div>
      </div>

      {/* Admin Navigation - Always visible */}
      <div className="modern-inventory-filters" style={{ marginBottom: '2rem' }}>
        {adminMenuItems.map((item) => {
          const isActive = adminView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setAdminView(item.id);
                // Clear selected date when navigating away from invoice details
                if (item.id !== 'invoice-details') {
                  setSelectedDate(null);
                }
              }}
              className={`modern-inventory-filter-btn ${isActive ? 'active' : ''}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem'
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Breadcrumb for specific views */}
      {adminView === 'invoice-details' && selectedDate && (
        <div style={{ 
          marginBottom: '1rem', 
          padding: '0.75rem 1rem', 
          background: '#f8fafc', 
          borderRadius: '8px',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b' }}>
            <span>📈 Sales Tracker</span>
            <span>→</span>
            <span style={{ color: '#1f2937', fontWeight: '500' }}>Invoice Details - {selectedDate}</span>
          </div>
        </div>
      )}

      {/* Render Content */}
      {renderContent()}

      {/* Change Password Modal */}
      {showChangePassword && (
        <ChangePassword
          onSuccess={() => {
            setShowChangePassword(false);
            alert('Password updated successfully!');
          }}
          onCancel={() => setShowChangePassword(false)}
        />
      )}
    </div>
  );
}

function AdminOverview({ onNavigate }) {
  const adminCards = [
    { 
      id: 'inventory', 
      title: 'Purchase Management', 
      description: 'Manage item costs, pricing, and profit analysis',
      icon: '💰',
      color: '#3b82f6'
    },
    { 
      id: 'customers', 
      title: 'Customer Management', 
      description: 'Manage regular customers and their information',
      icon: '👥',
      color: '#059669'
    },
    { 
      id: 'invoices', 
      title: 'Create Sales Invoice', 
      description: 'Generate new sales invoices for customers',
      icon: '🧾',
      color: '#7c3aed'
    },
    { 
      id: 'sales', 
      title: 'Sales Tracker', 
      description: 'View daily sales reports and revenue analytics',
      icon: '📈',
      color: '#dc2626'
    }
  ];

  return (
    <div>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '2rem',
        marginBottom: '2rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        textAlign: 'center'
      }}>
        <h3 style={{ margin: '0 0 1rem 0', color: '#111827', fontSize: '1.5rem' }}>Welcome to Admin Portal</h3>
        <p style={{ margin: 0, color: '#6b7280' }}>
          Select a tool below to manage your business operations
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem'
      }}>
        {adminCards.map((card) => (
          <div
            key={card.id}
            onClick={() => onNavigate(card.id)}
            style={{
              background: 'white',
              borderRadius: '12px',
              padding: '2rem',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textAlign: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
            }}
          >
            <div style={{
              fontSize: '3rem',
              marginBottom: '1rem'
            }}>
              {card.icon}
            </div>
            <h3 style={{
              margin: '0 0 0.5rem 0',
              color: card.color,
              fontSize: '1.25rem',
              fontWeight: '600'
            }}>
              {card.title}
            </h3>
            <p style={{
              margin: 0,
              color: '#6b7280',
              fontSize: '0.875rem'
            }}>
              {card.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PurchaseManagement({ items, onAddItem, onEditItem, onDeleteItem }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [showProfitAnalysis, setShowProfitAnalysis] = useState(false);

  const categories = [
    { name: 'All Categories', icon: Package },
    { name: 'Spare Parts', icon: Wrench },
    { name: 'Lubricants', icon: Droplet },
    { name: 'Car Accessories', icon: Car }
  ];

  // Filter items based on search and category
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.product_code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'modern-inventory-stock-out' };
    if (stock <= 5) return { label: 'Low Stock', color: 'modern-inventory-stock-low' };
    return { label: 'In Stock', color: 'modern-inventory-stock-in' };
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Spare Parts': return <Wrench className="modern-inventory-card-icon" />;
      case 'Lubricants': return <Droplet className="modern-inventory-card-icon" />;
      case 'Car Accessories': return <Car className="modern-inventory-card-icon" />;
      default: return <Package className="modern-inventory-card-icon" />;
    }
  };

  // Calculate profit analysis
  const profitAnalysis = items.reduce((acc, item) => {
    if (item.purchase_price) {
      const profit = item.price - item.purchase_price;
      const profitMargin = (profit / item.purchase_price) * 100;
      acc.totalCost += item.purchase_price * item.quantity;
      acc.totalValue += item.price * item.quantity;
      acc.totalProfit += profit * item.quantity;
      acc.averageMargin += profitMargin;
    }
    return acc;
  }, { totalCost: 0, totalValue: 0, totalProfit: 0, averageMargin: 0 });

  profitAnalysis.averageMargin = items.filter(item => item.purchase_price).length > 0 
    ? profitAnalysis.averageMargin / items.filter(item => item.purchase_price).length 
    : 0;

  return (
    <div>
      {/* Add Item Button */}
      <div style={{ marginBottom: '2rem', textAlign: 'right' }}>
        <button 
          onClick={onAddItem}
          className="modern-inventory-add-btn"
        >
          <Plus size={20} />
          Add New Item
        </button>
      </div>

      {/* Profit Analysis Toggle */}
      <div style={{ marginBottom: '1.5rem' }}>
        <button 
          onClick={() => setShowProfitAnalysis(!showProfitAnalysis)}
          className="modern-inventory-filter-btn"
          style={{ 
            background: showProfitAnalysis ? '#3b82f6' : '#f3f4f6',
            color: showProfitAnalysis ? 'white' : '#374151'
          }}
        >
          {showProfitAnalysis ? 'Hide' : 'Show'} Profit Analysis
        </button>
      </div>

      {/* Profit Analysis Summary */}
      {showProfitAnalysis && (
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', color: '#111827' }}>Profit Analysis Summary</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            <div style={{ textAlign: 'center', padding: '1rem', background: '#f0f9ff', borderRadius: '8px' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0369a1' }}>
                Rs. {profitAnalysis.totalCost.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Total Cost</div>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', background: '#f0fdf4', borderRadius: '8px' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#16a34a' }}>
                Rs. {profitAnalysis.totalValue.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Total Value</div>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', background: '#fef3c7', borderRadius: '8px' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#d97706' }}>
                Rs. {profitAnalysis.totalProfit.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Total Profit</div>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', background: '#fce7f3', borderRadius: '8px' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#be185d' }}>
                {profitAnalysis.averageMargin.toFixed(1)}%
              </div>
              <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Avg. Margin</div>
            </div>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="modern-inventory-search-container">
        <Search className="modern-inventory-search-icon" />
        <input
          type="text"
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="modern-inventory-search-input"
        />
      </div>

      {/* Category Filters */}
      <div className="modern-inventory-filters">
        {categories.map((category) => {
          const Icon = category.icon;
          const isActive = selectedCategory === category.name;
          return (
            <button
              key={category.name}
              onClick={() => setSelectedCategory(category.name)}
              className={`modern-inventory-filter-btn ${isActive ? 'active' : ''}`}
            >
              <Icon size={16} />
              {category.name}
            </button>
          );
        })}
      </div>

      {/* Items Grid */}
      <div className="modern-inventory-grid">
        {filteredItems.map((item) => {
          const stockStatus = getStockStatus(item.quantity);
          const profit = item.purchase_price ? item.price - item.purchase_price : 0;
          const profitMargin = item.purchase_price ? ((profit / item.purchase_price) * 100) : 0;
          
          return (
            <div key={item.id} className="modern-inventory-card">
              {/* Item Header */}
              <div className="modern-inventory-card-header">
                <div className="modern-inventory-card-info">
                  {getCategoryIcon(item.category)}
                  <div>
                    <h3 className="modern-inventory-card-title">{item.name}</h3>
                    <p className="modern-inventory-card-category">{item.category}</p>
                  </div>
                </div>
                <span className={`modern-inventory-stock-badge ${stockStatus.color}`}>
                  {stockStatus.label}
                </span>
              </div>

              {/* Item Details */}
              <div className="modern-inventory-card-details">
                <div className="modern-inventory-detail-row">
                  <span className="modern-inventory-detail-label">Stock</span>
                  <span className="modern-inventory-detail-value">{item.quantity} units</span>
                </div>
                <div className="modern-inventory-detail-row">
                  <span className="modern-inventory-detail-label">Purchase Price</span>
                  <span className="modern-inventory-detail-value cost-price">Rs. {item.purchase_price?.toLocaleString() || 'N/A'}</span>
                </div>
                <div className="modern-inventory-detail-row">
                  <span className="modern-inventory-detail-label">Sales Price</span>
                  <span className="modern-inventory-detail-value sales-price">Rs. {item.price.toLocaleString()}</span>
                </div>
                <div className="modern-inventory-detail-row">
                  <span className="modern-inventory-detail-label">Profit</span>
                  <span className="modern-inventory-detail-value profit-margin" style={{
                    color: profit >= 0 ? '#16a34a' : '#dc2626',
                    fontWeight: '600'
                  }}>
                    {item.purchase_price ? `Rs. ${profit.toLocaleString()}` : 'N/A'}
                  </span>
                </div>
                <div className="modern-inventory-detail-row">
                  <span className="modern-inventory-detail-label">Margin</span>
                  <span className="modern-inventory-detail-value" style={{
                    color: profitMargin >= 0 ? '#16a34a' : '#dc2626',
                    fontWeight: '600'
                  }}>
                    {item.purchase_price ? `${profitMargin.toFixed(1)}%` : 'N/A'}
                  </span>
                </div>
                <div className="modern-inventory-detail-row">
                  <span className="modern-inventory-detail-label">Product Code</span>
                  <span className="modern-inventory-detail-value">{item.product_code}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="modern-inventory-actions">
                <button 
                  className="modern-inventory-action-btn edit"
                  onClick={() => onEditItem(item)}
                >
                  <Edit3 size={16} />
                  Edit
                </button>
                <button 
                  className="modern-inventory-action-btn delete"
                  onClick={() => onDeleteItem(item.id)}
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="modern-inventory-empty">
          <Package className="modern-inventory-empty-icon" size={64} />
          <h3 className="modern-inventory-empty-title">No items found</h3>
          <p className="modern-inventory-empty-description">
            {searchTerm || selectedCategory !== 'All Categories' 
              ? 'Try adjusting your search or filter criteria'
              : 'Get started by adding your first inventory item'
            }
          </p>
          {(!searchTerm && selectedCategory === 'All Categories') && (
            <button 
              onClick={onAddItem}
              className="modern-inventory-add-btn"
              style={{ marginTop: '1rem' }}
            >
              Add Your First Item
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function PaymentUpdateButton({ invoiceId, currentPaid, totalAmount, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newPaidAmount, setNewPaidAmount] = useState(currentPaid || 0);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async () => {
    if (newPaidAmount < 0 || newPaidAmount > totalAmount) {
      alert('Payment amount must be between 0 and total amount');
      return;
    }

    setIsUpdating(true);
    try {
      await updateInvoicePayment(invoiceId, parseFloat(newPaidAmount));
      setIsEditing(false);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Failed to update payment:', error);
      alert('Failed to update payment');
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isEditing) {
    return (
      <button
        onClick={() => setIsEditing(true)}
        style={{
          padding: '0.25rem 0.5rem',
          backgroundColor: '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '0.75rem',
          cursor: 'pointer'
        }}
      >
        Update Payment
      </button>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
      <input
        type="number"
        value={newPaidAmount}
        onChange={(e) => setNewPaidAmount(e.target.value)}
        min="0"
        max={totalAmount}
        step="0.01"
        style={{
          width: '80px',
          padding: '0.25rem',
          border: '1px solid #ccc',
          borderRadius: '4px',
          fontSize: '0.75rem'
        }}
      />
      <button
        onClick={handleUpdate}
        disabled={isUpdating}
        style={{
          padding: '0.25rem 0.5rem',
          backgroundColor: '#10b981',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '0.75rem',
          cursor: isUpdating ? 'not-allowed' : 'pointer'
        }}
      >
        {isUpdating ? '...' : '✓'}
      </button>
      <button
        onClick={() => setIsEditing(false)}
        style={{
          padding: '0.25rem 0.5rem',
          backgroundColor: '#dc2626',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '0.75rem',
          cursor: 'pointer'
        }}
      >
        ✕
      </button>
    </div>
  );
}

function InvoiceDetailsTab({ selectedDate, onBack }) {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInvoices = () => {
    if (selectedDate) {
      setLoading(true);
      setError(null);
      fetchInvoicesByDate(selectedDate)
        .then(setInvoices)
        .catch(e => setError(e.message))
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [selectedDate]);

  if (loading) return (
    <div className="modern-inventory-container">
      <div className="modern-inventory-loading">
        <div className="modern-inventory-spinner"></div>
        <p>Loading invoice details...</p>
      </div>
    </div>
  );
  if (error) return (
    <div className="modern-inventory-container">
      <div className="modern-inventory-empty">
        <h3 className="modern-inventory-empty-title">Error</h3>
        <p className="modern-inventory-empty-description">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="modern-inventory-container">
      <div className="invoice-details-container">
        <div className="invoice-details-header">
          <h2 className="invoice-details-title">
            Invoice Details for {new Date(selectedDate).toLocaleDateString()}
          </h2>
          <button className="invoice-details-back-btn" onClick={onBack}>
            ← Back to Sales Tracker
          </button>
        </div>
        
        {invoices.length === 0 ? (
          <div className="invoice-details-empty">
            <div className="invoice-details-empty-icon">📄</div>
            <h3 className="invoice-details-empty-title">No Invoices Found</h3>
            <p className="invoice-details-empty-description">No invoices were created on this date.</p>
          </div>
        ) : (
          <div className="invoice-details-grid">
            {invoices.map(inv => (
              <div className="invoice-details-card" key={inv.id}>
                <div className="invoice-details-card-header">
                  <h3 className="invoice-details-card-title">Invoice #{inv.id}</h3>
                  <span className="invoice-details-card-date">
                    {new Date(inv.created_at).toLocaleString()}
                  </span>
                </div>
                
                <div className="invoice-client-info">
                  <h4 className="invoice-client-info-title">Client Information</h4>
                  <div className="invoice-client-grid">
                    <div className="invoice-client-field">
                      <span>Name:</span> <span className="invoice-client-value">{inv.client_name}</span>
                    </div>
                    {inv.client_phone && (
                      <div className="invoice-client-field">
                        <span>Phone:</span> <span className="invoice-client-value">{inv.client_phone}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <table className="invoice-items-table">
                  <thead>
                    <tr>
                      <th>Item Name</th>
                      <th>Category</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inv.items.map(line => (
                      <tr key={line.id}>
                        <td>{line.item.name}</td>
                        <td>{line.item.category}</td>
                        <td>{line.quantity}</td>
                        <td>Rs {line.price}</td>
                        <td>Rs {(line.price * line.quantity).toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={4}><strong>Total Amount</strong></td>
                      <td className="invoice-total-cell"><strong>Rs {(inv.total_amount || inv.items.reduce((sum, line) => sum + (line.price * line.quantity), 0)).toLocaleString(undefined, { maximumFractionDigits: 2 })}</strong></td>
                    </tr>
                    {/* Always show payment information - calculate if not available */}
                    {(() => {
                      const totalAmount = inv.total_amount || inv.items.reduce((sum, line) => sum + (line.price * line.quantity), 0);
                      const amountPaid = inv.amount_paid !== undefined ? inv.amount_paid : 0;
                      const outstandingBalance = inv.outstanding_balance !== undefined ? inv.outstanding_balance : (totalAmount - amountPaid);
                      const paymentStatus = inv.payment_status || (amountPaid >= totalAmount ? 'paid' : (amountPaid > 0 ? 'partial' : 'unpaid'));
                      
                      return (
                        <>
                          <tr>
                            <td colSpan={4}><strong>Amount Paid</strong></td>
                            <td style={{ fontWeight: '600', color: '#059669' }}><strong>Rs {amountPaid.toLocaleString(undefined, { maximumFractionDigits: 2 })}</strong></td>
                          </tr>
                          {outstandingBalance > 0 && (
                            <tr>
                              <td colSpan={4}><strong>Outstanding Balance</strong></td>
                              <td style={{ fontWeight: '600', color: '#dc2626' }}><strong>Rs {outstandingBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })}</strong></td>
                            </tr>
                          )}
                          <tr>
                            <td colSpan={4}><strong>Payment Status</strong></td>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{
                                  padding: '0.25rem 0.75rem',
                                  borderRadius: '9999px',
                                  fontSize: '0.75rem',
                                  fontWeight: '500',
                                  color: 'white',
                                  backgroundColor: 
                                    paymentStatus === 'paid' ? '#10b981' :
                                    paymentStatus === 'partial' ? '#f59e0b' : '#dc2626'
                                }}>
                                  {paymentStatus === 'paid' ? '✓ Paid' :
                                   paymentStatus === 'partial' ? '⚠ Partial' : '⚠ Unpaid'}
                                </span>
                              </div>
                            </td>
                          </tr>
                        </>
                      );
                    })()}
                  </tfoot>
                </table>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PasswordSetup({ onSuccess, onCancel }) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    
    // Save password to localStorage
    localStorage.setItem('sitePassword', newPassword);
    onSuccess();
  }

  return (
    <div className="modern-inventory-form-overlay">
      <div className="modern-inventory-form-container">
        <form className="modern-inventory-form" onSubmit={handleSubmit}>
          <h2 className="modern-inventory-form-title">
            🔐 Set Site Password
          </h2>
          
          <p style={{ 
            textAlign: 'center', 
            color: '#6b7280', 
            marginBottom: '1.5rem',
            fontSize: '0.9rem'
          }}>
            No site password has been set. Please create a secure password to access the application.
          </p>

          <div className="modern-inventory-form-group">
            <label className="modern-inventory-form-label">New Password *</label>
            <input 
              className="modern-inventory-form-input"
              type="password"
              value={newPassword} 
              onChange={e => setNewPassword(e.target.value)} 
              required 
              placeholder="Enter new password (min 6 characters)"
              autoFocus
            />
          </div>

          <div className="modern-inventory-form-group">
            <label className="modern-inventory-form-label">Confirm Password *</label>
            <input 
              className="modern-inventory-form-input"
              type="password"
              value={confirmPassword} 
              onChange={e => setConfirmPassword(e.target.value)} 
              required 
              placeholder="Confirm your password"
            />
          </div>

          {error && (
            <p style={{ 
              color: '#ef4444', 
              fontSize: '0.875rem', 
              marginTop: '0.5rem',
              textAlign: 'center'
            }}>
              {error}
            </p>
          )}

          <div className="modern-inventory-form-actions">
            <button type="button" className="modern-inventory-form-btn secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="modern-inventory-form-btn primary">
              Set Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function PasswordProtection({ onSuccess, onCancel }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showSetup, setShowSetup] = useState(false);

  // Get password from localStorage - no default password for security
  const getSitePassword = () => {
    return localStorage.getItem('sitePassword');
  };

  function handleSubmit(e) {
    e.preventDefault();
    const storedPassword = getSitePassword();
    
    if (!storedPassword) {
      setShowSetup(true);
      return;
    }
    
    if (password === storedPassword) {
      // Set authentication session (expires in 2 hours)
      const expiryTime = new Date().getTime() + (2 * 60 * 60 * 1000);
      // Session management is handled by parent component
      onSuccess();
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  }

  if (showSetup) {
    return (
      <PasswordSetup
        onSuccess={() => {
          setShowSetup(false);
          onSuccess();
        }}
        onCancel={onCancel}
      />
    );
  }

  return (
    <div className="modern-inventory-form-overlay">
      <div className="modern-inventory-form-container">
        <form className="modern-inventory-form" onSubmit={handleSubmit}>
          <h2 className="modern-inventory-form-title">
            🔒 Admin Access Required
          </h2>
          
          <p style={{ 
            textAlign: 'center', 
            color: '#6b7280', 
            marginBottom: '1.5rem',
            fontSize: '0.9rem'
          }}>
            Purchase Management contains sensitive pricing information.
            Please enter the site password to continue.
          </p>

          <div className="modern-inventory-form-group">
            <label className="modern-inventory-form-label">Site Password</label>
            <input 
              className="modern-inventory-form-input"
              type="password"
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              placeholder="Enter site password"
              autoFocus
            />
            {error && (
              <p style={{ 
                color: '#ef4444', 
                fontSize: '0.875rem', 
                marginTop: '0.5rem',
                textAlign: 'center'
              }}>
                {error}
              </p>
            )}
          </div>

          <div className="modern-inventory-form-actions" style={{ flexDirection: 'column' }}>
            <button type="submit" className="modern-inventory-form-btn primary">
              Access Purchase Management
            </button>
            <button type="button" className="modern-inventory-form-btn secondary" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [view, setView] = useState('dashboard');
  const [selectedDate, setSelectedDate] = useState(null);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check if user is already authenticated (session management)
    const authExpiry = localStorage.getItem('authExpiry');
    const currentTime = new Date().getTime();
    return authExpiry && currentTime < parseInt(authExpiry);
  });

  useEffect(() => {
    // Show password prompt if not authenticated on load
    if (!isAuthenticated) {
      setShowPasswordPrompt(true);
    }
    loadItems();
  }, []);

  // Check authentication expiry periodically
  useEffect(() => {
    const checkAuthExpiry = () => {
      const authExpiry = localStorage.getItem('authExpiry');
      const currentTime = new Date().getTime();
      
      if (authExpiry && currentTime >= parseInt(authExpiry)) {
        // Session expired, log out user
        localStorage.removeItem('authExpiry');
        setIsAuthenticated(false);
        setShowPasswordPrompt(true);
      }
    };

    // Check immediately and then every 30 seconds
    checkAuthExpiry();
    const interval = setInterval(checkAuthExpiry, 30000);

    return () => clearInterval(interval);
  }, []);

  async function loadItems() {
    try {
      setLoading(true);
      const data = await fetchItems();
      setItems(data);
    } catch (error) {
      console.error('Failed to load items:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(formData) {
    try {
      const newItem = await addItem(formData);
      setItems(items => [...items, newItem]);
      setShowAdd(false);
      setView('list');
    } catch (error) {
      console.error('Failed to add item:', error);
      alert('Failed to add item');
    }
  }

  async function handleEdit(id, formData) {
    try {
      const updated = await updateItem(id, formData);
      setItems(items => items.map(it => (it.id === id ? updated : it)));
      setEditItem(null);
      setView('list');
    } catch (error) {
      console.error('Failed to update item:', error);
      alert('Failed to update item');
    }
  }

  async function handleDelete(itemId) {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteItem(itemId);
        await loadItems();
      } catch (error) {
        console.error('Failed to delete item:', error);
        alert('Failed to delete item');
      }
    }
  }

  function handleInvoiceCreated() {
    loadItems();
    setView('dashboard');
  }

  function handleViewDetails(date) {
    setSelectedDate(date);
    setView('invoice-details');
  }

  function handleBackToSales() {
    setSelectedDate(null);
    setView('sales');
  }

  function handlePasswordSuccess() {
    setShowPasswordPrompt(false);
    setIsAuthenticated(true);
    // Set 2-hour expiry (2 hours * 60 minutes * 60 seconds * 1000 milliseconds)
    const twoHours = 2 * 60 * 60 * 1000;
    const expiryTime = new Date().getTime() + twoHours;
    localStorage.setItem('authExpiry', expiryTime.toString());
  }

  function handlePasswordCancel() {
    // User cancelled login, stay on password prompt
    setShowPasswordPrompt(true);
  }

  function handleLogout() {
    // Clear authentication session
    localStorage.removeItem('authExpiry');
    setIsAuthenticated(false);
    setShowPasswordPrompt(true);
  }

  function handleNavigation(section) {
    setShowAdd(false);
    setEditItem(null);
    setSelectedDate(null);
    
    switch(section) {
      case 'dashboard':
        setView('dashboard');
        break;
      case 'inventory':
        setView('list');
        break;
      case 'add-item':
        setView('list');
        setShowAdd(true);
        break;
      case 'purchase-management':
        setView('purchase-management');
        break;
      case 'settings':
        console.log('Settings clicked');
        break;
      case 'logout':
        handleLogout();
        break;
      default:
        setView('dashboard');
    }
  }

  // Show password protection if not authenticated or explicitly prompted
  if (!isAuthenticated || showPasswordPrompt) {
    return (
      <div className="App">
        <PasswordProtection 
          onSuccess={handlePasswordSuccess}
          onCancel={handlePasswordCancel}
        />
      </div>
    );
  }

  return (
    <div className="App">
      {/* Render Dashboard view */}
      {view === 'dashboard' && (
        <Dashboard onNavigate={handleNavigation} />
      )}

      {/* Render other views */}
      {view !== 'dashboard' && (
        <>
          <header className="main-header">
            <div className="header-content">
              <h1>Auto Parts Inventory</h1>
              <p className="subtitle">Inventory Management System</p>
            </div>
          </header>

          <main className="main-content">
            <div className="toolbar">
              <button 
                className="btn secondary-btn"
                onClick={() => setView('dashboard')}
              >
                ← Back to Dashboard
              </button>
              <button 
                className="btn secondary-btn"
                onClick={() => {
                  setView('list');
                  setShowAdd(false);
                  setEditItem(null);
                }}
              >
                📦 Inventory
              </button>
              <button 
                className="btn secondary-btn"
                onClick={() => setView('purchase-management')}
              >
                💰 Admin Portal
              </button>
            </div>


            {/* Show Form Overlay */}
            {(showAdd || editItem) && (
              <ItemForm 
                onSubmit={editItem ? (formData) => handleEdit(editItem.id, formData) : handleAdd}
                onCancel={() => {
                  setShowAdd(false);
                  setEditItem(null);
                }}
                initial={editItem}
                submitLabel={editItem ? "Update Item" : "Add Item"}
              />
            )}

            {view === 'list' && (
              <ModernInventoryList
                items={items}
                loading={loading}
                onAddItem={() => setShowAdd(true)}
                onEditItem={(item) => setEditItem(item)}
                onDeleteItem={handleDelete}
              />
            )}

            {view === 'purchase-management' && (
              <AdminPortal 
                items={items} 
                onAddItem={() => setShowAdd(true)}
                onEditItem={(item) => setEditItem(item)}
                onDeleteItem={handleDelete}
                loading={loading}
                onViewDetails={handleViewDetails}
                onInvoiceCreated={handleInvoiceCreated}
                onBack={() => setView('dashboard')}
              />
            )}
          </main>
        </>
      )}

    </div>
  );
}

export default App;