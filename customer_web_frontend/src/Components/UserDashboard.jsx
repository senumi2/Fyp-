import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./UserDashboard.css";
import { FiMapPin, FiCreditCard, FiSettings, FiPackage, FiTruck, FiFileText, FiClock } from "react-icons/fi";

function UserDashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState(""); // මුලින් හිස්ව තබන්න
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch("http://localhost:5000/api/auth/profile", {
          headers: { "Authorization": `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.fullName) {
          setUserName(data.fullName.split(" ")[0]); 
        }
      } catch (err) {
        console.error("User name fetch failed");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        
        <div className="dashboard-header-simple">
          {/* Loading වන විට "..." පෙන්වයි, නැත්නම් නම පෙන්වයි */}
          <h2>{loading ? "Loading..." : `Welcome , ${userName || "Valued Customer"}!`}</h2>
          <p>Manage your salt orders and business profile from your secure dashboard.</p>
        </div>

        {/* --- Quick Status Counters (සංශෝධනය කළා) --- */}
        <div className="status-overview">
          <div className="status-item">
            <span className="status-label">Active Orders</span>
            <span className="status-value">02</span>
          </div>
          <div className="status-item">
            <span className="status-label">Last Order Status</span>
            <span className="status-value processing-text">Processing</span>
          </div>
          <div className="status-item">
            <span className="status-label">Membership</span>
            <span className="status-value gold-text">Wholesale</span>
          </div>
        </div>

        <div className="dashboard-grid">
          
          <div className="menu-card track-highlight" onClick={() => navigate("/OrderTracking")}>
            <div className="icon-box gold-bg"><FiTruck /></div>
            <div className="card-content">
              <h3>TRACK SHIPMENT</h3>
              <p>Check the live status of your salt delivery trucks and schedules.</p>
            </div>
            <div className="arrow-btn">❯</div>
          </div>

          <div className="menu-card" onClick={() => navigate("/PaymentHistory")}>
            <div className="icon-box"><FiCreditCard /></div>
            <div className="card-content">
              <h3>PAYMENT HISTORY</h3>
              <p>View past transactions and download official tax invoices.</p>
            </div>
            <div className="arrow-btn">❯</div>
          </div>

          <div className="menu-card" onClick={() => navigate("/shipping_address")}>
            <div className="icon-box"><FiMapPin /></div>
            <div className="card-content">
              <h3>WAREHOUSE LOCATIONS</h3>
              <p>Manage multiple delivery points and warehouse addresses.</p>
            </div>
            <div className="arrow-btn">❯</div>
          </div>

          <div className="menu-card account-card" onClick={() => navigate("/profile")}>
            <div className="icon-box blue-bg"><FiSettings /></div>
            <div className="card-content">
              <h3>ACCOUNT SETTINGS</h3>
              <p>Update your business profile and security settings.</p>
            </div>
            <div className="arrow-btn blue-btn">❯</div>
          </div>

          {/* අලුතින් එක් කළ card එක - Quality Reports (Saltern එකකට වැදගත්) */}
          <div className="menu-card quality-card" onClick={() => navigate("/QualityReports")}>
            <div className="icon-box purple-bg"><FiFileText /></div>
            <div className="card-content">
              <h3>QUALITY REPORTS</h3>
              <p>Download lab test reports and purity certificates for your salt batches.</p>
            </div>
            <div className="arrow-btn purple-btn">❯</div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default UserDashboard;