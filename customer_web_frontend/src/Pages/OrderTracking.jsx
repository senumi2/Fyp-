import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./OrderTracking.css";
import { FiPackage, FiTruck, FiCheckCircle, FiClock, FiArrowLeft } from "react-icons/fi";

function OrderTracking() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/api/orders/my-orders", {
        headers: { "Authorization": `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setOrders(data);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIndex = (status) => {
    const steps = ["Pending", "Processing", "Shipped", "Delivered"];
    const idx = steps.indexOf(status);
    return idx === -1 ? 0 : idx;
  };

  // --- පෙනුම 1: ඇණවුම් ලැයිස්තුව (List View) ---
  if (!selectedOrder) {
    return (
      <div className="tracking-wrapper">
        <div className="order-list-container">
          <div className="list-header">
            <button className="back-dash-btn" onClick={() => navigate("/UserDashboard")}>
              <FiArrowLeft /> Dashboard
            </button>
            <h2>My Salt Orders</h2>
            <p>Select an order to view tracking details.</p>
          </div>

          {loading ? (
            <div className="loader">Loading your orders...</div>
          ) : orders.length === 0 ? (
            <div className="no-orders">You haven't placed any orders yet.</div>
          ) : (
            <div className="orders-stack">
              {orders.map((order) => (
                <div key={order._id} className="order-summary-card" onClick={() => setSelectedOrder(order)}>
                  <div className="summary-left">
                    <h4>{order.items}</h4>
                    <span>Order ID: #{order._id.slice(-6)}</span>
                    <p>{new Date(order.date).toLocaleDateString()}</p>
                  </div>
                  <div className={`status-pill ${order.status.toLowerCase()}`}>
                    {order.status}
                  </div>
                  <div className="arrow-go">❯</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- පෙනුම 2: ඇණවුම පවතින තැන (Tracking View) ---
  const steps = [
    { label: "Placed", icon: <FiClock /> },
    { label: "Processing", icon: <FiPackage /> },
    { label: "On Way", icon: <FiTruck /> },
    { label: "Delivered", icon: <FiCheckCircle /> },
  ];

  const currentIdx = getStatusIndex(selectedOrder.status);

  return (
    <div className="tracking-wrapper">
      <div className="tracking-detail-card">
        <button className="back-link" onClick={() => setSelectedOrder(null)}>
          <FiArrowLeft /> Back to List
        </button>

        <div className="track-main-header">
          <h3>Tracking Order #{selectedOrder._id.slice(-6)}</h3>
          <p>{selectedOrder.items} | {selectedOrder.quantity}kg</p>
        </div>

        <div className="stepper-horizontal">
          {steps.map((step, index) => (
            <div key={index} className={`step-block ${index <= currentIdx ? "completed" : ""}`}>
              <div className="step-icon-circle">{step.icon}</div>
              <span className="step-text">{step.label}</span>
              {index < steps.length - 1 && <div className="progress-line"></div>}
            </div>
          ))}
        </div>

        <div className="logistics-info">
          <div className="info-group">
            <label>Truck Number</label>
            <strong>{selectedOrder.truckNumber}</strong>
          </div>
          <div className="info-group">
            <label>Driver Name</label>
            <strong>{selectedOrder.driverName}</strong>
          </div>
          <div className="info-group">
            <label>Expected Delivery</label>
            <strong>{selectedOrder.estimatedDelivery}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderTracking;