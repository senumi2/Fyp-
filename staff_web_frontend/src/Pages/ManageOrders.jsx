import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { FaTruck, FaUserEdit, FaChevronDown, FaChevronUp, FaTimes, FaBan } from "react-icons/fa";
import "./ManageOrders.css";

function ManageOrders() {
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [formData, setFormData] = useState({ driverId: "", truckNo: "", estDate: "" });

  const fetchData = async () => {
    setLoading(true);
    const activeToken = token || localStorage.getItem("token");
    try {
      const headers = { Authorization: `Bearer ${activeToken}`, "Content-Type": "application/json" };
      
      const orderRes = await fetch("http://localhost:5000/api/orders/all-payments", { headers });
      const orderData = await orderRes.json();
      setOrders(Array.isArray(orderData) ? orderData : []);

      const driverRes = await fetch("http://localhost:5000/api/auth/drivers", { headers });
      if (driverRes.ok) {
        const driverData = await driverRes.json();
        setDrivers(Array.isArray(driverData) ? driverData : []);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setOrders([]);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [token]);

  const handleAssign = async (e) => {
    e.preventDefault();
    const driver = drivers.find(d => d._id === formData.driverId);
    const activeToken = token || localStorage.getItem("token");
    
    const res = await fetch(`http://localhost:5000/api/orders/update-tracking/${selectedOrder._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${activeToken}` },
      body: JSON.stringify({
        status: "Dispatched",
        assignedDriver: formData.driverId,
        driverName: driver ? driver.fullName : "Unknown",
        truckNumber: formData.truckNo,
        estimatedDelivery: formData.estDate
      })
    });

    if (res.ok) {
      alert("Order Dispatched Successfully! 🚛");
      setSelectedOrder(null);
      fetchData();
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      const activeToken = token || localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/orders/update-tracking/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${activeToken}` },
        body: JSON.stringify({ status: "Cancelled" })
      });
      if (res.ok) { fetchData(); }
    }
  };

  if (loading) return <div className="loading">Loading Logistics Data...</div>;

  return (
    <div className="manage-orders-container">
      <header className="manage-header">
        <h1>Logistics & Order Management</h1>
        <p>Monitor shipments and assign delivery personnel</p>
      </header>

      <div className="orders-table-wrapper modern-glass-card">
        <table className="manage-table">
          <thead>
            <tr>
              <th></th>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Logistics</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <React.Fragment key={order._id}>
                <tr className={expandedOrder === order._id ? "row-expanded" : ""}>
                  <td>
                    <button className="btn-expand" onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}>
                      {expandedOrder === order._id ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                  </td>
                  <td className="bold-text">#{order._id.slice(-6).toUpperCase()}</td>
                  <td>{order.userId?.fullName || "Guest User"}</td>
                  <td><span className={`status-pill ${order.status?.toLowerCase()}`}>{order.status}</span></td>
                  <td>
                    {order.assignedDriver ? (
                      <div className="log-mini">👤 {order.driverName} <br/> 🚛 {order.truckNumber}</div>
                    ) : <span className="wait-text">Waiting for Dispatch</span>}
                  </td>
                  <td className="action-cell">
                    <button className="btn-action assign" onClick={() => setSelectedOrder(order)}>
                      <FaUserEdit /> Assign
                    </button>
                    <button className="btn-action cancel" onClick={() => handleCancel(order._id)}>
                      <FaBan />
                    </button>
                  </td>
                </tr>
                {expandedOrder === order._id && (
                  <tr className="detail-row">
                    <td colSpan="6">
                      <div className="order-details-box">
                         <div className="detail-grid">
                            <div><strong>Items:</strong> {order.items} (x{order.quantity})</div>
                            <div><strong>Total:</strong> LKR {order.amount?.toLocaleString()}</div>
                            <div><strong>Address:</strong> {order.shippingAddress?.address}, {order.shippingAddress?.district}</div>
                            <div><strong>Contact:</strong> {order.shippingAddress?.contactNumber}</div>
                         </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <div className="modal-header">
              <h3>Dispatch Order #{selectedOrder._id.slice(-6).toUpperCase()}</h3>
              <FaTimes className="close-icon" onClick={() => setSelectedOrder(null)} />
            </div>
            <form onSubmit={handleAssign}>
              <label>Assign Driver</label>
              <select required onChange={e => setFormData({...formData, driverId: e.target.value})}>
                <option value="">Select a registered driver</option>
                {drivers.map(d => <option key={d._id} value={d._id}>{d.fullName}</option>)}
              </select>
              <label>Truck Number</label>
              <input type="text" placeholder="Ex: WP LH-5544" required onChange={e => setFormData({...formData, truckNo: e.target.value})} />
              <label>Estimated Delivery Date</label>
              <input type="date" required onChange={e => setFormData({...formData, estDate: e.target.value})} />
              <button type="submit" className="confirm-btn">Confirm Dispatch</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageOrders;