import React from "react";
import { useNavigate } from "react-router-dom";
import "./UserDashboard.css";
import { FiMapPin, FiCreditCard, FiSettings, FiPackage } from "react-icons/fi";

function UserDashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        
        {/* සරල මාතෘකාවක් පමණක් */}
        <div className="dashboard-header-simple">
          <h2>User Dashboard</h2>
          <p>Manage your account and orders from one place</p>
        </div>

        {/* Menu Grid - Cards හතර පමණයි */}
        <div className="dashboard-grid">
          
          {/* TRACK ORDER CARD */}
          <div className="menu-card track-highlight" onClick={() => navigate("/OrderTracking")}>
            <div className="icon-box gold-bg"><FiPackage /></div>
            <div className="card-content">
              <h3>TRACK ORDER</h3>
              <p>Check the live status of your shipments and delivery time.</p>
            </div>
            <div className="arrow-btn">❯</div>
          </div>

          {/* PAYMENT HISTORY CARD */}
          <div className="menu-card" onClick={() => navigate("/PaymentHistory")}>
            <div className="icon-box"><FiCreditCard /></div>
            <div className="card-content">
              <h3>PAYMENT HISTORY</h3>
              <p>View all your past transactions and download invoices.</p>
            </div>
            <div className="arrow-btn">❯</div>
          </div>

          {/* SAVED ADDRESSES CARD */}
          <div className="menu-card" onClick={() => navigate("/shipping_address")}>
            <div className="icon-box"><FiMapPin /></div>
            <div className="card-content">
              <h3>SAVED ADDRESSES</h3>
              <p>Manage and update your primary shipping locations.</p>
            </div>
            <div className="arrow-btn">❯</div>
          </div>

          {/* ACCOUNT SETTINGS CARD */}
          <div className="menu-card account-card" onClick={() => navigate("/profile")}>
            <div className="icon-box blue-bg"><FiSettings /></div>
            <div className="card-content">
              <h3>ACCOUNT SETTINGS</h3>
              <p>Update your profile details and security settings.</p>
            </div>
            <div className="arrow-btn blue-btn">❯</div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default UserDashboard;