import React from "react";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="sidebar">
      <button onClick={() => navigate("/profile")}>Profile</button>
      <button onClick={() => navigate("/shipping_address")}>Shipping Address</button>
      <button onClick={() => navigate("/OrderTracking")}>New Order Tracking</button>
      <button onClick={() => navigate("/PaymentHistory")}>Payment History</button>
     </div>
  );
}

export default Sidebar;
