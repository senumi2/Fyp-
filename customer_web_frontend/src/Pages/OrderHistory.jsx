import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Tracking පිටුවට යෑම සඳහා
import "./OrderHistory.css";

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login to view your order history.");
      setLoading(false);
      return;
    }

    // මෙතනදී අපි පාවිච්චි කරන්නේ ඔයාගේ පවතින "/my-orders" API එකමයි
    fetch("http://localhost:5000/api/orders/my-orders", {
      headers: { 
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (res.status === 401) throw new Error("Session expired. Please login again.");
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          setOrders([]);
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // 🚚 Tracking එකට Link කිරීමේ function එක
  const trackOrder = (orderId) => {
    // මෙය ඔයාගේ App.js එකේ Tracking route එකට ගැලපෙන ලෙස "/order-tracking" ලෙස යොදන්න
    navigate(`/OrderTracking?orderId=${orderId}`);
  };

 
const viewInvoice = (id) => {
    if (!id) return; 
    window.open(`/invoice/${id}`, "_blank");
  };
  if (loading) return <div className="status-msg">Fetching your orders...</div>;
  if (error) return <div className="status-msg error-msg">{error}</div>;

  return (
    <div className="order-history-wrapper">
      <div className="order-history-card">
        <h2 className="order-title">My Order History</h2>
        <p className="subtitle">Manage your orders and track their delivery status.</p>
        
        <div className="order-table-container">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total Price</th>
                <th>Delivery Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map(order => (
                  <tr key={order._id}>
                    <td className="id-cell">#{order._id ? order._id.slice(-6).toUpperCase() : "N/A"}</td>
                    <td>{order.date ? new Date(order.date).toLocaleDateString() : "N/A"}</td>
                    <td className="items-cell">{order.items || "Check Details"}</td>
                    <td className="price-cell">
                      Rs. {order.amount ? order.amount.toLocaleString() : "0.00"}
                    </td>
                    <td>
                      <span className={`order-status-tag ${(order.status || "pending").toLowerCase()}`}>
                        {order.status || "Pending"}
                      </span>
                    </td>
                    <td className="action-cell">
                      <button className="track-btn" onClick={() => trackOrder(order._id)}>
                        Track
                      </button>
                      <button className="inv-btn" onClick={() => viewInvoice(order._id)}>
                        Invoice
                     </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-data">You haven't placed any orders yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default OrderHistory;