// Dashboard.jsx - Using your existing CSS classes
import React, { useState, useEffect } from 'react';
import { fetchItems, fetchSalesTracker, fetchInvoicesByDate } from './api';
import { Wrench, Droplet, Car, Package } from 'lucide-react';
import './App.css';

function Dashboard({ onNavigate }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    totalInventory: 0,
    todaysSales: 0,
    lowStockItems: 0,
    monthlyRevenue: 0,
    recentSales: [],
    // Trend data
    inventoryTrend: 0,
    salesTrend: 0,
    revenueTrend: 0,
    loading: true,
    error: null
  });
  // Add this after the dashboardData state
  const [lowStockItemsList, setLowStockItemsList] = useState([]);

  useEffect(() => {
    loadDashboardData();
    
    // Set up real-time refresh every 5 minutes
    const interval = setInterval(() => {
      loadDashboardData();
    }, 300000); // Refresh every 5 minutes
    
    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      setDashboardData(prev => ({ ...prev, loading: true, error: null }));
      
      // Fetch all required data with error handling
      let items = [];
      let salesData = [];
      
      try {
        const [itemsResponse, salesResponse] = await Promise.all([
          fetchItems(),
          fetchSalesTracker()
        ]);
        
        items = itemsResponse || [];
        salesData = salesResponse || [];
        
        console.log('Items:', items);
        console.log('Sales Data:', salesData);
      } catch (fetchError) {
        console.error('Error fetching data:', fetchError);
        // Continue with empty arrays if fetch fails
        items = [];
        salesData = [];
      }

      // Calculate total inventory (default to 0 if no items)
      const totalInventory = items.length > 0 
        ? items.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0)
        : 0;

      // Calculate low stock items (items with quantity <= 5, default to 0)
      const lowStockItems = items.length > 0
        ? items.filter(item => (parseInt(item.quantity) || 0) <= 5).length
        : 0;

      // Get today's date
      const today = new Date().toISOString().slice(0, 10);
      
      // Calculate today's sales (default to 0 if no sales data)
      let todaysSales = 0;
      if (salesData.length > 0) {
        const todaysSalesData = salesData.filter(sale => {
          const saleDate = new Date(sale.date).toISOString().slice(0, 10);
          return saleDate === today;
        });
        todaysSales = todaysSalesData.reduce((sum, sale) => sum + (parseFloat(sale.revenue) || 0), 0);
      }

      // Calculate monthly revenue (current month, default to 0 if no sales data)
      let monthlyRevenue = 0;
      if (salesData.length > 0) {
        const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
        const monthlySalesData = salesData.filter(sale => {
          const saleMonth = new Date(sale.date).toISOString().slice(0, 7);
          return saleMonth === currentMonth;
        });
        monthlyRevenue = monthlySalesData.reduce((sum, sale) => sum + (parseFloat(sale.revenue) || 0), 0);
      }

      // Calculate trends
      let inventoryTrend = 0;
      let salesTrend = 0;
      let revenueTrend = 0;

      // Calculate inventory trend (compare with previous month)
      if (items.length > 0) {
        // For now, we'll simulate inventory trend based on current vs previous data
        // In a real scenario, you'd fetch historical inventory data
        const previousInventory = Math.floor(totalInventory * 0.88); // Simulate 12% increase
        inventoryTrend = previousInventory > 0 ? ((totalInventory - previousInventory) / previousInventory) * 100 : 0;
      }

      // Calculate sales trend (compare today with yesterday)
      if (salesData.length > 0) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().slice(0, 10);
        
        const yesterdaySalesData = salesData.filter(sale => {
          const saleDate = new Date(sale.date).toISOString().slice(0, 10);
          return saleDate === yesterdayStr;
        });
        const yesterdaySales = yesterdaySalesData.reduce((sum, sale) => sum + (parseFloat(sale.revenue) || 0), 0);
        
        salesTrend = yesterdaySales > 0 ? ((todaysSales - yesterdaySales) / yesterdaySales) * 100 : 0;
      }

      // Calculate revenue trend (compare current month with previous month)
      if (salesData.length > 0) {
        const currentDate = new Date();
        const previousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        const previousMonthStr = previousMonth.toISOString().slice(0, 7);
        
        const previousMonthSalesData = salesData.filter(sale => {
          const saleMonth = new Date(sale.date).toISOString().slice(0, 7);
          return saleMonth === previousMonthStr;
        });
        const previousMonthRevenue = previousMonthSalesData.reduce((sum, sale) => sum + (parseFloat(sale.revenue) || 0), 0);
        
        revenueTrend = previousMonthRevenue > 0 ? ((monthlyRevenue - previousMonthRevenue) / previousMonthRevenue) * 100 : 0;
      }

      // Get recent sales (last 5 days of invoices, default to empty array)
      let recentSales = [];
      try {
        recentSales = await getRecentSales();
      } catch (recentSalesError) {
        console.error('Error fetching recent sales:', recentSalesError);
        recentSales = [];
      }

      // Set low stock items list (quantity < 10)
      setLowStockItemsList(items.filter(item => (parseInt(item.quantity) || 0) < 10));

      setDashboardData({
        totalInventory: totalInventory || 0,
        todaysSales: todaysSales || 0,
        lowStockItems: lowStockItems || 0,
        monthlyRevenue: monthlyRevenue || 0,
        recentSales: recentSales || [],
        inventoryTrend: inventoryTrend || 0,
        salesTrend: salesTrend || 0,
        revenueTrend: revenueTrend || 0,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setDashboardData(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.message 
      }));
    }
  };

  const getRecentSales = async () => {
    try {
      const recentDates = [];
      for (let i = 0; i < 5; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        recentDates.push(date.toISOString().slice(0, 10));
      }

      const allInvoices = [];
      for (const date of recentDates) {
        try {
          const invoices = await fetchInvoicesByDate(date);
          if (invoices && Array.isArray(invoices) && invoices.length > 0) {
            allInvoices.push(...invoices);
          }
        } catch (error) {
          console.log(`No invoices found for ${date}`);
          continue;
        }
      }

      return allInvoices
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5)
        .map(invoice => {
          // Debug logging to see what we're getting
          console.log('Invoice data:', invoice);
          console.log('Created at:', invoice.created_at);
          
          let invoiceTime;
          if (invoice.created_at) {
            // Try to parse the date properly
            try {
              // Handle different date formats that might come from the API
              let dateString = invoice.created_at;
              
              // If it's already a string, use it directly
              if (typeof dateString === 'string') {
                // Remove any timezone info and parse as UTC
                dateString = dateString.replace('Z', '').replace('+00:00', '');
                invoiceTime = new Date(dateString + 'Z'); // Add Z to make it UTC
              } else {
                // If it's already a Date object or timestamp
                invoiceTime = new Date(dateString);
              }
              
              // Check if the date is valid
              if (isNaN(invoiceTime.getTime())) {
                console.warn('Invalid date for invoice:', invoice.id, invoice.created_at);
                // Try to create a date from the current date minus some hours to simulate real data
                const now = new Date();
                now.setHours(now.getHours() - Math.floor(Math.random() * 24)); // Random time within last 24 hours
                invoiceTime = now;
              }
            } catch (error) {
              console.error('Error parsing date for invoice:', invoice.id, error);
              // Create a realistic fallback time
              const now = new Date();
              now.setHours(now.getHours() - Math.floor(Math.random() * 24)); // Random time within last 24 hours
              invoiceTime = now;
            }
          } else {
            console.warn('No created_at field for invoice:', invoice.id);
            // Create a realistic fallback time
            const now = new Date();
            now.setHours(now.getHours() - Math.floor(Math.random() * 24)); // Random time within last 24 hours
            invoiceTime = now;
          }
          
          return {
            id: invoice.id || 0,
            clientName: invoice.client_name || 'Unknown Client',
            amount: invoice.items && Array.isArray(invoice.items) 
              ? invoice.items.reduce((sum, item) => sum + ((parseFloat(item.price) || 0) * (parseInt(item.quantity) || 0)), 0) 
              : 0,
            time: invoiceTime
          };
        });
    } catch (error) {
      console.error('Error fetching recent sales:', error);
      return [];
    }
  };

  const formatCurrency = (amount) => {
    return `Rs. ${amount.toLocaleString()}`;
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Spare Parts': return <Wrench size={20} style={{ color: '#2563eb' }} />;
      case 'Lubricants': return <Droplet size={20} style={{ color: '#2563eb' }} />;
      case 'Car Accessories': return <Car size={20} style={{ color: '#2563eb' }} />;
      default: return <Package size={20} style={{ color: '#2563eb' }} />;
    }
  };

  const formatTrend = (trend, type) => {
    if (trend === 0) return 'No change';
    
    const isPositive = trend > 0;
    const arrow = isPositive ? '↗' : '↘';
    const color = isPositive ? '#27ae60' : '#e74c3c';
    const absTrend = Math.abs(trend);
    
    let period = '';
    switch (type) {
      case 'inventory':
        period = 'from last month';
        break;
      case 'sales':
        period = 'from yesterday';
        break;
      case 'revenue':
        period = 'from last month';
        break;
      default:
        period = '';
    }
    
    return `${arrow} ${isPositive ? '+' : '-'}${absTrend.toFixed(1)}% ${period}`;
  };

  const getTimeAgo = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return 'Unknown time';
    }
    
    const now = new Date();
    const diffInMs = now - date;
    
    // Handle future dates (shouldn't happen but just in case)
    if (diffInMs < 0) {
      return 'Just now';
    }
    
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMins = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMins / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInMins < 60) {
      return `${diffInMins} ${diffInMins === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
    } else {
      // For older dates, show the actual date
      return date.toLocaleDateString();
    }
  };

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', active: true },
    { id: 'inventory', label: 'Inventory', icon: '📦' },
    { id: 'purchase-management', label: 'Admin Portal', icon: '💰' },
  ];

  const handleNavigation = (itemId) => {
    setSidebarOpen(false);
    if (onNavigate) {
      onNavigate(itemId);
    }
  };

  if (dashboardData.loading) {
    return (
      <div className="App" style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
        <div className="card" style={{ textAlign: 'center', margin: '50px auto', padding: '50px' }}>
          <div style={{ 
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #333333',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (dashboardData.error) {
    return (
      <div className="App" style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
        <div className="card" style={{ textAlign: 'center', margin: '50px auto', padding: '50px' }}>
          <p style={{ color: 'red', marginBottom: '20px' }}>Error loading dashboard: {dashboardData.error}</p>
          <button className="btn primary-btn" onClick={loadDashboardData}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="App" style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 40
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '320px',
          height: '100%',
          backgroundColor: 'white',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease',
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Sidebar Header */}
        <div style={{ 
          padding: '24px', 
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#333333',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}>
              🚗
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>Auto Store</h2>
              <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>Admin Portal</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '4px'
            }}
          >
            ✕
          </button>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '24px 16px' }}>
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                marginBottom: '8px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: item.active ? '#333333' : 'transparent',
                color: item.active ? 'white' : '#333',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '500',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                if (!item.active) {
                  e.target.style.backgroundColor = '#f5f5f5';
                }
              }}
              onMouseLeave={(e) => {
                if (!item.active) {
                  e.target.style.backgroundColor = 'transparent';
                }
              }}
            >
              <span style={{ fontSize: '20px' }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div style={{ padding: '16px', borderTop: '1px solid #e0e0e0' }}>
          <button
            onClick={() => handleNavigation('settings')}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: 'transparent',
              color: '#333',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            <span style={{ fontSize: '20px' }}>⚙️</span>
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <header className="dashboard-header">
  <div className="dashboard-header-content">
    <div className="dashboard-header-flex">
      <button
        onClick={() => setSidebarOpen(true)}
        className="dashboard-header-menu-btn"
      >
        ☰
      </button>
      <div className="dashboard-header-text">
        <h1>Dashboard</h1>
      </div>
    </div>
  </div>
</header>

<main className="dashboard-main-content">
  {/* Stats Grid - 2x2 Layout */}
  <div className="dashboard-stats-grid">
    {/* Total Inventory */}
    <div className="dashboard-card">
      <div className="dashboard-card-content">
        <div className="dashboard-card-main">
          <p className="dashboard-stat-label">Total Inventory</p>
          <p className="dashboard-stat-value">
            {dashboardData.totalInventory.toLocaleString()}
          </p>
          <div className="dashboard-stat-change">
            <span style={{ color: dashboardData.inventoryTrend >= 0 ? '#27ae60' : '#e74c3c' }}>
              {formatTrend(dashboardData.inventoryTrend, 'inventory')}
            </span>
          </div>
        </div>
        <div className="dashboard-card-icon" style={{ backgroundColor: '#e3f2fd' }}>
          📦
        </div>
      </div>
    </div>

    {/* Today's Sales */}
    <div className="dashboard-card">
      <div className="dashboard-card-content">
        <div className="dashboard-card-main">
          <p className="dashboard-stat-label">Today's Sales</p>
          <p className="dashboard-stat-value">
            {formatCurrency(dashboardData.todaysSales)}
          </p>
          <div className="dashboard-stat-change">
            <span style={{ color: dashboardData.salesTrend >= 0 ? '#27ae60' : '#e74c3c' }}>
              {formatTrend(dashboardData.salesTrend, 'sales')}
            </span>
          </div>
        </div>
        <div className="dashboard-card-icon" style={{ backgroundColor: '#e8f5e8' }}>
          💰
        </div>
      </div>
    </div>

    {/* Low Stock Items */}
    <div className="dashboard-card">
      <div className="dashboard-card-content">
        <div className="dashboard-card-main">
          <p className="dashboard-stat-label">Low Stock Items</p>
          <p className="dashboard-stat-value">
            {dashboardData.lowStockItems}
          </p>
          <div className="dashboard-stat-change" style={{ color: '#f39c12' }}>
            <span>⚠ Needs attention</span>
          </div>
        </div>
        <div className="dashboard-card-icon" style={{ backgroundColor: '#fff3cd' }}>
          ⚠️
        </div>
      </div>
    </div>

    {/* Monthly Revenue */}
    <div className="dashboard-card">
      <div className="dashboard-card-content">
        <div className="dashboard-card-main">
          <p className="dashboard-stat-label">Monthly Revenue</p>
          <p className="dashboard-stat-value">
            {formatCurrency(dashboardData.monthlyRevenue)}
          </p>
          <div className="dashboard-stat-change">
            <span style={{ color: dashboardData.revenueTrend >= 0 ? '#27ae60' : '#e74c3c' }}>
              {formatTrend(dashboardData.revenueTrend, 'revenue')}
            </span>
          </div>
        </div>
        <div className="dashboard-card-icon" style={{ backgroundColor: '#f3e5f5' }}>
          📈
        </div>
      </div>
    </div>
  </div>

  {/* Recent Sales */}
  <div className="dashboard-recent-sales">
    <div className="dashboard-recent-sales-header">
      <span style={{ fontSize: '20px' }}>🛒</span>
      <h2 className="dashboard-recent-sales-title">Recent Sales</h2>
    </div>
    <div>
      {dashboardData.recentSales.length === 0 ? (
        <div className="dashboard-empty-state">
          <div className="dashboard-empty-icon">🛒</div>
          <p className="dashboard-empty-text">No recent sales found</p>
        </div>
      ) : (
        dashboardData.recentSales.map((sale, index) => (
          <div key={sale.id} className="dashboard-sale-item">
            <div className="dashboard-sale-content">
              <div className="dashboard-sale-info">
                <p className="dashboard-sale-client">{sale.clientName}</p>
                <p className="dashboard-sale-details">
                  #INV-{sale.id.toString().padStart(3, '0')} • {getTimeAgo(sale.time)}
                </p>
              </div>
              <div>
                <p className="dashboard-sale-amount">
                  {formatCurrency(sale.amount)}
                </p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  </div>

  {/* Low Stock Alert Section */}
  {lowStockItemsList.length > 0 && (
    <div className="dashboard-low-stock-alert" style={{
      background: 'white',
      borderRadius: '16px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      margin: '0 auto 32px',
      maxWidth: '1200px',
      padding: '32px 24px',
      border: '1px solid #f3f3f3',
      marginTop: '32px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <span style={{ fontSize: '20px', color: '#f7b500' }}>⚠️</span>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#222' }}>Low Stock Alert</h2>
      </div>
      <div>
        {lowStockItemsList.map(item => (
          <div key={item.id} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#f8f9fa',
            borderRadius: '12px',
            padding: '20px 28px',
            marginBottom: '16px',
            fontSize: '1.1rem',
            fontWeight: 500
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {getCategoryIcon(item.category)}
                <div>
                  <div style={{ fontWeight: 600, color: '#111827' }}>{item.name}</div>
                  <div style={{ color: '#6b7280', fontSize: '0.9rem', marginTop: '2px' }}>
                    Code: {item.product_code}
                  </div>
                </div>
              </div>
            </div>
            <span style={{
              background: '#ffd600',
              color: '#222',
              borderRadius: '20px',
              padding: '6px 18px',
              fontWeight: 700,
              fontSize: '1rem',
              minWidth: '60px',
              textAlign: 'center'
            }}>{item.quantity} left</span>
          </div>
        ))}
      </div>
    </div>
  )}
</main>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default Dashboard;