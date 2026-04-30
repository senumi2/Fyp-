import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaCheckCircle, FaPrint, FaArrowLeft, FaTruck } from "react-icons/fa";
import "./Invoice.css";

function Invoice() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:5000/api/orders/invoice/${id}`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized or Not Found");
        return res.json();
      })
      .then((data) => {
        setOrder(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching invoice:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="loading-screen">Generating Your Invoice...</div>;
  if (!order) return <div className="error-screen">Invoice not found or access denied.</div>;

  // ✅ ලිපිනය පෙන්වන තැන Object එකක් වුණත් String එකක් වුණත් හරියට පෙන්වන ක්‍රමය
  const renderAddress = () => {
    // Backend එකෙන් එන shippingAddress එක Object එකක් නම්:
    const addr = order.shippingAddress;
    if (addr && typeof addr === 'object') {
      return `${addr.address || ''}, ${addr.district || ''}, ${addr.province || ''} ${addr.postalCode || ''}`;
    }
    // එහෙම නැතිනම් පරණ විදිහට ඇඩ්‍රස් එක තිබේ නම්:
    return order.fullAddress || order.address || "Address not available";
  };

  // ✅ පාරිභෝගිකයාගේ නම ලබා ගැනීම
  const getCustomerName = () => {
    if (order.shippingAddress && order.shippingAddress.warehouseName) {
      return order.shippingAddress.warehouseName;
    }
    return order.userId?.fullName || order.fullName || "Customer Name";
  };

  return (
    <div className="invoice-page-container">
      <div className="no-print invoice-top-bar">
        <button className="back-home-btn" onClick={() => navigate("/dashboard")}>
          <FaArrowLeft /> Back 
        </button>
        <button className="print-download-btn" onClick={() => window.print()}>
          <FaPrint /> Download PDF
        </button>
      </div>

      <div className="invoice-card-box" id="print-area">
        <div className="invoice-header-section">
          <div className="company-branding">
            <h1>SALTSHOW<span>ROOM</span></h1>
            <p>Premium Salt products</p>
            <p className="company-contact">Colombo, Sri Lanka | +94 112 000 000</p>
          </div>
          <div className="invoice-title-meta">
            <h2>INVOICE</h2>
            <p><strong>Order ID:</strong> #{order._id.slice(-8).toUpperCase()}</p>
            <p><strong>Date:</strong> {new Date(order.date || order.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <hr className="invoice-hr" />

        <div className="invoice-info-grid">
          <div className="info-block">
            <h4><FaTruck /> SHIPPING TO</h4>
            <div className="address-details">
              <p className="customer-name"><strong>{getCustomerName()}</strong></p>
              
              {/* ✅ වැදගත්ම කොටස: මෙතන දැන් Object Error එන්නේ නැහැ */}
              <p className="full-address">{renderAddress()}</p>

              <p className="contact-no">
                Contact: {order.shippingAddress?.contactNumber || order.contactNumber || "N/A"}
              </p>
            </div>
          </div>

          <div className="info-block text-right">
            <h4>PAYMENT DETAILS</h4>
            <p><strong>Method:</strong> {order.paymentMethod}</p>
            <div className={`status-tag ${(order.status || "pending").toLowerCase()}`}>
               <FaCheckCircle /> {order.status}
            </div>
          </div>
        </div>

        <table className="invoice-items-table">
          <thead>
            <tr>
              <th>Description</th>
              <th className="text-center">Quantity</th>
              <th className="text-right">Unit Price</th>
              <th className="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div className="item-desc">
                  <strong>{order.items}</strong>
                  <p>Batch Processed Premium Product</p>
                </div>
              </td>
              <td className="text-center">{order.quantity || 1}</td>
              <td className="text-right">
                Rs. {order.amount && order.quantity ? (order.amount / order.quantity).toLocaleString(undefined, {minimumFractionDigits: 2}) : "0.00"}
              </td>
              <td className="text-right">Rs. {order.amount ? order.amount.toLocaleString(undefined, {minimumFractionDigits: 2}) : "0.00"}</td>
            </tr>
          </tbody>
        </table>

        <div className="invoice-summary-footer">
          <div className="notes-section">
            <p><strong>Notes:</strong></p>
            <p>Thank you for your order!</p>
          </div>
          <div className="calculation-box">
            <div className="calc-row grand-total-row">
              <span>TOTAL AMOUNT</span>
              <span>Rs. {order.amount ? order.amount.toLocaleString(undefined, {minimumFractionDigits: 2}) : "0.00"}</span>
            </div>
          </div>
        </div>

        <div className="invoice-bottom-strip">
          <p>www.saltmanagement.lk</p>
        </div>
      </div>
    </div>
  );
}

export default Invoice;