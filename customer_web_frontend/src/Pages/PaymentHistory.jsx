import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./PaymentHistory.css"

function PaymentHistory() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:5000/api/orders/my-orders", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setOrders(data));
  }, []);

  const viewInvoice = (id) => {
    window.open(`/invoice/${id}`, "_blank");
  };

  return (

    <div className="PaymentHistory-layout">
          

     <div className="payment-history">
      <h2>Order History</h2>

      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Date</th>
            <th>Items</th>
            <th>Qty</th>
            <th>Payment</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {orders.map(order => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{new Date(order.date).toLocaleDateString()}</td>
              <td>{order.items}</td>
              <td>{order.quantity}</td>
              <td>{order.paymentMethod}</td>
              <td>Rs. {order.amount}</td>
              <td>{order.status}</td>
              <td>
                <button onClick={() => viewInvoice(order._id)}>
                  View Invoice
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>     
    
      
      </div>
    
  );
}

export default PaymentHistory;
