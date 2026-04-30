import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./UserDashboard.css";
import { 
  FiMapPin, FiCreditCard, FiSettings, FiPackage, 
  FiTruck, FiFileText, FiClock, FiTrendingUp, 
  FiBell, FiShoppingCart, FiHelpCircle 
} from "react-icons/fi";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

function UserDashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState(""); 
  const [loading, setLoading] = useState(true);
  
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingPayments: 0,
    activeShipments: 0,
    totalSpent: 0,
    monthlyData: []
  });

  const [notices, setNotices] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const userRes = await fetch("http://localhost:5000/api/auth/profile", {
          headers: { "Authorization": `Bearer ${token}` },
        });
        const userData = await userRes.json();
        if (userData.fullName) {
          setUserName(userData.fullName.split(" ")[0]); 
        }

        const statsRes = await fetch("http://localhost:5000/api/orders/dashboard-stats", {
          headers: { "Authorization": `Bearer ${token}` },
        });
        const statsData = await statsRes.json();

        const formattedChartData = statsData.monthlyStats.map(item => ({
          month: new Date(0, item._id - 1).toLocaleString('en', { month: 'short' }),
          amount: item.totalAmount
        }));

        setStats({
          totalOrders: statsData.totalOrders,
          pendingPayments: statsData.pendingPayments,
          activeShipments: statsData.activeShipments,
          totalSpent: statsData.totalSpent,
          monthlyData: formattedChartData
        });

        const noticesRes = await fetch("http://localhost:5000/api/notices/all");
        const noticesData = await noticesRes.json();
        setNotices(noticesData);

      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        
        {/* Header Section */}
        <div className="dashboard-header-simple">
          <h2>{loading ? "Loading..." : `Welcome, ${userName || "Valued Customer"}!`}</h2>
          <p>Real-time analytics and management for your salt supply chain.</p>
        </div>

        {/* --- Quick Status Counters --- */}
        <div className="status-overview">
          <div className="status-item">
            <span className="status-label">Total Orders</span>
            <span className="status-value">{stats.totalOrders}</span>
          </div>
          <div className="status-item">
            <span className="status-label">Pending Payments</span>
            <span className="status-value processing-text">{stats.pendingPayments}</span>
          </div>
          <div className="status-item">
            <span className="status-label">Active Shipments</span>
            <span className="status-value cyan-text">{stats.activeShipments}</span>
          </div>
          <div className="status-item">
            <span className="status-label">Total Spent</span>
            <span className="status-value">LKR {stats.totalSpent.toLocaleString()}</span>
          </div>
        </div>

        {/* --- Info Row --- */}
        <div className="info-row">
          <div className="notice-board">
            <h4><FiBell className="bell-icon" /> Important Notices</h4>
            <ul>
              {notices.length > 0 ? (
                notices.map((notice) => (
                  <li key={notice._id}>
                    {notice.type === "warning" ? "⚠️" : "✅"} {notice.message}
                  </li>
                ))
              ) : (
                <li>No new announcements from the Saltern today.</li>
              )}
            </ul>
          </div>
          
          <div className="quick-actions">
            <button className="q-btn buy-now" onClick={() => navigate("/products")}>
              <FiShoppingCart /> Shop Now
            </button>
            <button className="q-btn support" onClick={() => window.open('https://wa.me/947XXXXXXXX')}>
              <FiHelpCircle /> Live Support
            </button>
          </div>
        </div>

        {/* --- Monthly Purchase Chart --- */}
        <div className="analytics-card">
          <h3 className="chart-title"><FiTrendingUp /> Monthly Salt Procurement (LKR)</h3>
          <div style={{ width: '100%', height: 250, marginTop: '20px' }}>
            <ResponsiveContainer>
              <BarChart data={stats.monthlyData.length > 0 ? stats.monthlyData : [{month: 'No Data', amount: 0}]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#002A5C', fontSize: 12, fontWeight: 600}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#002A5C', fontSize: 12}} />
                <Tooltip 
                    cursor={{fill: '#F1FAEE'}} 
                    contentStyle={{borderRadius: '10px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)'}}
                />
                <Bar dataKey="amount" fill="#0096D6" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Navigation Grid */}
        <div className="dashboard-grid">
          <div className="menu-card track-highlight" onClick={() => navigate("/OrderTracking")}>
            <div className="icon-box gold-bg"><FiTruck /></div>
            <div className="card-content">
              <h3>TRACK SHIPMENT</h3>
              <p>Check the live status of your salt delivery trucks and schedules.</p>
            </div>
            <div className="arrow-btn yellow-btn">❯</div>
          </div>
 
          <div className="menu-card order-history-card-highlight" onClick={() => navigate("/OrderHistory")}>
            <div className="icon-box green-bg"><FiPackage /></div>
            <div className="card-content">
              <h3>ORDER HISTORY</h3>
              <p>Review your past salt orders, quantities, and real-time delivery status.</p>
            </div>
            <div className="arrow-btn green-btn">❯</div>
          </div>

          <div className="menu-card" onClick={() => navigate("/PaymentHistory")}>
            <div className="icon-box"><FiCreditCard /></div>
            <div className="card-content">
              <h3>PAYMENT HISTORY</h3>
              <p>View past transactions and download official tax invoices.</p>
            </div>
            <div className="arrow-btn ash-btn">❯</div>
          </div>

          <div className="menu-card" onClick={() => navigate("/shipping_address")}>
            <div className="icon-box"><FiMapPin /></div>
            <div className="card-content">
              <h3>WAREHOUSE LOCATIONS</h3>
              <p>Manage multiple delivery points and warehouse addresses.</p>
            </div>
            <div className="arrow-btn ash-btn">❯</div>
          </div>

          <div className="menu-card quality-card" onClick={() => navigate("/QualityReports")}>
            <div className="icon-box purple-bg"><FiFileText /></div>
            <div className="card-content">
              <h3>QUALITY REPORTS</h3>
              <p>Download lab test reports and purity certificates for your salt batches.</p>
            </div>
            <div className="arrow-btn purple-btn">❯</div>
          </div>

          <div className="menu-card account-card" onClick={() => navigate("/profile")}>
            <div className="icon-box blue-bg"><FiSettings /></div>
            <div className="card-content">
              <h3>ACCOUNT SETTINGS</h3>
              <p>Update your business profile and security settings.</p>
            </div>
            <div className="arrow-btn blue-btn">❯</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;