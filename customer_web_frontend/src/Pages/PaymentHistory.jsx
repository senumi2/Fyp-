import React, { useEffect, useState } from "react";
import "./PaymentHistory.css";

function PaymentHistory() {
  // මුලින්ම හිස් Array එකක් ලෙස තබා ගන්න
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Token එක නැතිනම් Fetch කරන්න කලින්ම error එකක් පෙන්වන්න පුළුවන්
    if (!token) {
      setError("Please login to view your payment history.");
      setLoading(false);
      return;
    }

    fetch("http://localhost:5000/api/orders/my-orders", {
      headers: { 
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (res.status === 401) {
          throw new Error("Unauthorized: Please login again.");
        }
        return res.json();
      })
      .then(data => {
        // Backend එකෙන් එන්නේ Array එකක්ද කියලා පරීක්ෂා කිරීම (CRITICAL)
        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          setOrders([]); // Array එකක් නෙවෙයි නම් හිස් කරන්න
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

 
const viewInvoice = (id) => {
  window.open(`/invoice/${id}`, "_blank");
};

  if (loading) return <div className="status-msg">Loading history...</div>;
  if (error) return <div className="status-msg error-msg">{error}</div>;

  return (
    <div className="payment-history-wrapper">
      <div className="payment-history-card">
        <h2 className="title">My Payment History</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Items</th>
                <th>Method</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map(order => (
                  <tr key={order._id}>
                    <td>#{order._id ? order._id.slice(-6) : "N/A"}</td>
                    <td>{order.date ? new Date(order.date).toLocaleDateString() : "N/A"}</td>
                    <td>{order.items || "No items"}</td>
                    <td>{order.paymentMethod || "N/A"}</td>
                    <td className="amount-col">
                      Rs. {order.amount ? order.amount.toFixed(2) : "0.00"}
                    </td>
                    <td>
                      <span className={`status-tag ${(order.status || "pending").toLowerCase()}`}>
                        {order.status || "Pending"}
                      </span>
                    </td>
                    <td>
                    <button className="view-btn" onClick={() => viewInvoice(order._id)}>
                        View Invoice
                    </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-data">No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PaymentHistory;