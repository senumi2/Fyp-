import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // useLocation එකතු කළා
import "./OrderTracking.css";
import { FiPackage, FiTruck, FiCheckCircle, FiClock, FiArrowLeft, FiMapPin } from "react-icons/fi";

function OrderTracking() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // URL එකේ තියෙන parameters කියවීමට
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const orderIdFromUrl = queryParams.get("orderId");

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
        
        // --- 🚀 මෙතන තමයි අලුත් logic එක ---
        // URL එකේ orderId එකක් තියෙනවා නම්, fetch වුණු orders අතරින් ඒක හොයාගෙන select කරනවා
        if (orderIdFromUrl) {
          const foundOrder = data.find(o => o._id === orderIdFromUrl);
          if (foundOrder) {
            setSelectedOrder(foundOrder);
          }
        }
        // -----------------------------------
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIndex = (status) => {
    const stepsList = ["Pending", "Processing", "Shipped", "Delivered"];
    const idx = stepsList.indexOf(status);
    return idx === -1 ? 0 : idx;
  };

  if (!selectedOrder) {
    return (
      <div className="tracking-wrapper">
        <div className="order-list-container">
          <div className="list-header">
            <button className="back-dash-btn" onClick={() => navigate("/dashboard")}>
              <FiArrowLeft /> Dashboard
            </button>
            <h2>My  Orders</h2>
            <p>Select an order to view real-time tracking.</p>
          </div>

          {loading ? (
            <div className="loader-container"><div className="loader"></div></div>
          ) : orders.length === 0 ? (
            <div className="no-orders">You haven't placed any orders yet.</div>
          ) : (
            <div className="orders-stack">
              {orders.map((order) => (
                <div key={order._id} className="order-summary-card" onClick={() => setSelectedOrder(order)}>
                  <div className="summary-left">
                    <h4>{order.items}</h4>
                    <span className="order-id-label">ID: #{order._id.slice(-6)}</span>
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

  const steps = [
    { label: "Pending", icon: <FiClock /> },
    { label: "Processing", icon: <FiPackage /> },
    { label: "Shipped", icon: <FiTruck /> },
    { label: "Delivered", icon: <FiCheckCircle /> },
  ];

  const currentIdx = getStatusIndex(selectedOrder.status);

  return (
    <div className="tracking-wrapper">
      <div className="tracking-detail-card">
        <button className="back-link" onClick={() => {
            // Back click කරද්දී URL එකේ තියෙන orderId එක අයින් කරන එක හොඳයි
            setSelectedOrder(null);
            navigate("/OrderTracking", { replace: true });
        }}>
          <FiArrowLeft /> Back to List
        </button>

        <div className="track-main-header">
          <h3>Order Tracking <span className="order-id-badge">#{selectedOrder._id.slice(-6)}</span></h3>
          <p>{selectedOrder.items} | {selectedOrder.quantity}kg</p>
        </div>

        <div className="stepper-container">
          {steps.map((step, index) => (
            <div key={index} className={`step-item ${index <= currentIdx ? "active" : ""}`}>
              <div className="step-circle">
                {step.icon}
              </div>
              <span className="step-label">{step.label}</span>
              
              {index < steps.length - 1 && (
                <div className={`step-line ${index < currentIdx ? "filled" : ""}`}></div>
              )}
            </div>
          ))}
        </div>

        <div className="logistics-info-grid">
          <div className="logistics-box">
            <div className="info-item">
              <label>Truck Number</label>
              <strong>{selectedOrder.truckNumber || "N/A"}</strong>
            </div>
            <div className="info-item">
              <label>Driver</label>
              <strong>{selectedOrder.driverName || "Assigning..."}</strong>
            </div>
            <div className="info-item">
              <label>Estimated Delivery</label>
              <strong>{selectedOrder.estimatedDelivery || "TBD"}</strong>
            </div>
          </div>
          
          <div className="destination-box">
            <h4><FiMapPin /> Delivery Destination</h4>
            {selectedOrder.shippingAddress ? (
              <div className="address-details">
                <p><strong>{selectedOrder.shippingAddress.addressLine1}</strong></p>
                <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.province}</p>
                <p style={{ marginTop: "5px", fontSize: "0.75rem", color: "#666" }}>
                  Contact: {selectedOrder.shippingAddress.phone}
                </p>
              </div>
            ) : (
              <p>Address details not available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderTracking;