import React, { useEffect, useState } from "react";
import { FaTruck, FaMapMarkerAlt, FaCheckCircle, FaPhoneAlt, FaBox } from "react-icons/fa";
import "./DriverDashboard.css";

function DriverDashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/orders/driver-tasks", {
        headers: { 
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json"
        }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setTasks(data);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setLoading(false);
    }
  };

  const handleDeliver = async (orderId) => {
    if (!window.confirm("Confirm that this order has been delivered?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/orders/mark-delivered/${orderId}`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        alert("Order status updated to Delivered! ✅");
        fetchTasks(); // List එක refresh කරන්න
      }
    } catch (err) {
      alert("Update failed. Please try again.");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  if (loading) return <div className="driver-loader">Loading Delivery Tasks...</div>;

  return (
    <div className="driver-dashboard-wrapper">
      <header className="driver-header">
        <div className="header-content">
          <h1><FaTruck /> Driver Panel</h1>
          <p>Manage your daily deliveries here.</p>
        </div>
      </header>

      <div className="tasks-container">
        <h3>Pending Deliveries ({tasks.length})</h3>
        
        {tasks.length > 0 ? (
          tasks.map((order) => (
            <div key={order._id} className="task-card-glass">
              <div className="card-top">
                <span className="order-id-tag">#{order._id.slice(-6).toUpperCase()}</span>
                <span className={`status-badge ${order.status.toLowerCase()}`}>{order.status}</span>
              </div>

              <div className="card-body">
                <div className="info-row">
                  <FaBox className="icon" />
                  <div>
                    <p className="label">Items</p>
                    <p className="value">{order.items} ({order.quantity} units)</p>
                  </div>
                </div>

                <div className="info-row">
                  <FaMapMarkerAlt className="icon location-icon" />
                  <div>
                    <p className="label">Delivery Address</p>
                    <p className="value">
                      {order.shippingAddress?.warehouseName || "Unknown Warehouse"}<br/>
                      {order.shippingAddress?.address}, {order.shippingAddress?.district}
                    </p>
                  </div>
                </div>

                <div className="info-row">
                  <FaPhoneAlt className="icon" />
                  <div>
                    <p className="label">Contact Number</p>
                    <p className="value">{order.shippingAddress?.contactNumber || "N/A"}</p>
                  </div>
                </div>
              </div>

              <button className="deliver-btn" onClick={() => handleDeliver(order._id)}>
                <FaCheckCircle /> Mark as Delivered
              </button>
            </div>
          ))
        ) : (
          <div className="no-tasks-msg">
            <FaCheckCircle className="big-icon" />
            <p>No pending deliveries assigned to you!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default DriverDashboard;