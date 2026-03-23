import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaCheckCircle, FaPrint, FaArrowLeft, FaTruck, FaFileInvoice } from "react-icons/fa";
import "./Invoice.css";

function Invoice() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Backend එකෙන් populate කරපු දත්ත ලබා ගැනීම
    fetch(`http://localhost:5000/api/orders/invoice/${id}`, {
      headers: { 
        "Authorization": `Bearer ${token}` 
      }
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

  return (
    <div className="invoice-page-container">
      {/* --- Action Buttons (ප්‍රින්ට් කරන කොට මේවා පේන්නේ නැහැ) --- */}
      <div className="no-print invoice-top-bar">
        <button className="back-home-btn" onClick={() => navigate("/")}>
          <FaArrowLeft /> Back to Shop
        </button>
        <button className="print-download-btn" onClick={() => window.print()}>
          <FaPrint />  Download PDF
        </button>
      </div>

      {/* --- Main Invoice Box --- */}
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
          {/* Shipping Address Section (Backend එකෙන් Populate වී එන දත්ත) */}
          <div className="info-block">
            <h4><FaTruck /> SHIPPING TO</h4>
            <div className="address-details">
              <p className="customer-name"><strong>{order.warehouseName || "Customer Name"}</strong></p>
              <p className="full-address">{order.fullAddress || order.shippingAddress}</p>
              <p className="contact-no">Contact: {order.contactNumber || "N/A"}</p>
            </div>
          </div>

          <div className="info-block text-right">
            <h4>PAYMENT DETAILS</h4>
            <p><strong>Method:</strong> {order.paymentMethod}</p>
            <div className={`status-tag ${order.status?.toLowerCase()}`}>
               <FaCheckCircle /> {order.status}
            </div>
          </div>
        </div>

        {/* --- Items Table --- */}
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
              <td className="text-center">{order.quantity}</td>
              <td className="text-right">Rs. {(order.amount / order.quantity).toFixed(2)}</td>
              <td className="text-right">Rs. {order.amount?.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        {/* --- Summary & Footer --- */}
        <div className="invoice-summary-footer">
          <div className="notes-section">
            <p><strong>Notes:</strong></p>
            <p> Thank you for your order!</p>
          </div>
          <div className="calculation-box">
            <div className="calc-row">
              <span>Subtotal</span>
              <span>Rs. {order.amount?.toFixed(2)}</span>
            </div>
            <div className="calc-row">
              <span>Delivery Charges</span>
              <span>FREE</span>
            </div>
            <div className="calc-row grand-total-row">
              <span>TOTAL AMOUNT</span>
              <span>Rs. {order.amount?.toFixed(2)}</span>
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