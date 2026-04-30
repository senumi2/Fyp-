import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaTrash, FaMapMarkerAlt, FaCheckCircle } from "react-icons/fa"; 
import { AuthContext } from "../context/AuthContext"; 
import credit_card from "../images/credit_card.png"; 
import axios from "axios";
import "./Payment.css";

function Payment() {
  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [warehouses, setWarehouses] = useState([]); 
  const [selectedAddress, setSelectedAddress] = useState(null); 
  const { user } = useContext(AuthContext); 
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nameOnCard: "",
    cardNumber: "",
    expiry: "",
    cvv: ""
  });

  useEffect(() => {
    const fetchCart = async () => {
      if (user) {
        try {
          const res = await axios.get(`http://localhost:5000/api/cart/${user._id || user.id}`);
          if (res.data && res.data.items) {
            const formattedItems = res.data.items.map(item => ({
              ...item,
              id: item.productId 
            }));
            setCartItems(formattedItems);
            return;
          }
        } catch (err) {
          console.error("Database cart fetch error:", err);
        }
      }
      const items = JSON.parse(localStorage.getItem("cart")) || [];
      setCartItems(items);
    };

    fetchCart();
    fetchUserAddresses();
  }, [user]);

  const fetchUserAddresses = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/api/shipping-address", {
        headers: { "Authorization": `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setWarehouses(data);
        if (data.length > 0) setSelectedAddress(data[0]._id);
      }
    } catch (err) {
      console.error("Error fetching addresses", err);
    }
  };

  const removeItem = async (id) => {
    try {
      // 1. User ලොග් වී ඇත්නම් Database එකෙන් ඉවත් කරන්න
      if (user) {
        const userId = user._id || user.id;
        // Backend එකේ අපි හැදූ නව URL එක: /api/cart/remove/USER_ID/PRODUCT_ID
        const response = await axios.delete(`http://localhost:5000/api/cart/remove/${userId}/${id}`);
        
        if (response.status === 200) {
          // Database එකෙන් සාර්ථකව මැකුණොත් පමණක් UI එක Update කරන්න
          const updatedCart = cartItems.filter((item) => item.id !== id);
          setCartItems(updatedCart);
          // Local storage එකත් sync කරන්න
          localStorage.setItem("cart", JSON.stringify(updatedCart));
        }
      } else {
        // 2. ලොග් වී නැතිනම් Local Storage එකෙන් පමණක් ඉවත් කරන්න
        const updatedCart = cartItems.filter((item) => item.id !== id);
        setCartItems(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
      }
  
      // Badge එක update කිරීමට event එක trigger කිරීම
      window.dispatchEvent(new Event("cartUpdated"));
  
    } catch (err) {
      console.error("Error removing item:", err);
      alert("Could not remove item.try again.");
    }
  };

  const updateQty = (id, newQty) => {
    if (newQty < 1) return;
    const updatedCart = cartItems.map((item) =>
      item.id === id ? { ...item, qty: newQty } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  const clearCartAfterOrder = async () => {
    localStorage.removeItem("cart");
    if (user) {
      try {
        await axios.delete(`http://localhost:5000/api/cart/clear/${user._id || user.id}`);
      } catch (err) {
        console.error("Error clearing DB cart:", err);
      }
    }
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const startPayHerePayment = async (orderId, token) => {
    try {
      const hashRes = await fetch("http://localhost:5000/api/payhere/generate-hash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: orderId,
          amount: totalAmount,
          currency: "LKR"
        })
      });
      const { hash } = await hashRes.json();
      const selectedLoc = warehouses.find(w => w._id === selectedAddress);

      const payment = {
        sandbox: true, 
        merchant_id: "YOUR_MERCHANT_ID", 
        return_url: `http://localhost:3000/invoice/${orderId}`,
        cancel_url: "http://localhost:3000/payment",
        notify_url: "http://localhost:5000/api/payhere/notify",
        order_id: orderId,
        items: cartItems.map(i => i.name).join(", "),
        amount: totalAmount,
        currency: "LKR",
        first_name: formData.nameOnCard || "Customer",
        last_name: "",
        email: user?.email || "customer@example.com",
        phone: "0771234567",
        address: selectedLoc?.address || "No Address",
        city: selectedLoc?.warehouseName || "Colombo",
        country: "Sri Lanka",
        hash: hash
      };

      window.payhere.startPayment(payment);

      window.payhere.onCompleted = async function onCompleted() {
        alert("Payment Successful!");
        await clearCartAfterOrder();
        navigate(`/invoice/${orderId}`);
      };

      window.payhere.onDismissed = function onDismissed() {
        console.log("Payment dismissed");
      };

      window.payhere.onError = function onError(error) {
        alert("PayHere Error: " + error);
      };

    } catch (err) {
      console.error("PayHere setup error", err);
    }
  };

  const handlePayNow = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return alert("Please login first!");
    if (cartItems.length === 0) return alert("Your cart is empty!");
    if (!selectedAddress) return alert("Please select a shipping location!");

    const orderData = {
      items: cartItems.map((i) => `${i.name} (x${i.qty})`).join(", "),
      quantity: cartItems.reduce((acc, i) => acc + i.qty, 0),
      amount: totalAmount,
      paymentMethod: paymentMethod === "card" ? "Card" : "Cash On Delivery",
      status: paymentMethod === "card" ? "Paid" : "Pending",
      shippingAddress: selectedAddress 
    };

    try {
      const res = await fetch("http://localhost:5000/api/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (res.ok) {
        const result = await res.json();
        if (paymentMethod === "card") {
          startPayHerePayment(result._id, token);
        } else {
          alert("Order Placed Successfully!");
          await clearCartAfterOrder();
          navigate(`/invoice/${result._id}`);
        }
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (err) {
      alert("Error placing order");
    }
  };

  return (
    <div className="payment-page-container">
      <div className="item-details-section">
        <h2 className="section-title">Item Details</h2>
        <div className="cart-items-list">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div key={item.id} className="item-card">
                <div className="item-img-group">
                  <button className="delete-icon-btn" onClick={() => removeItem(item.id)}>
                    <FaTrash />
                  </button>
                  <img src={`http://localhost:5000${item.image}`} alt={item.name} />
                </div>
                <div className="item-controls">
                  <div className="qty-box">
                    <p>Quantity</p>
                    <div className="qty-selector">
                      <button onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                      <span>{item.qty}</span>
                      <button onClick={() => updateQty(item.id, item.qty - 1)}>-</button>
                    </div>
                  </div>
                  <p className="item-price">Rs. {(item.price * item.qty).toFixed(2)}</p>
                </div>
              </div>
            ))
          ) : (
            <p style={{color: '#fff'}}>No items in cart.</p>
          )}
        </div>
        <div className="total-footer-row">
          <h3>Total Amount</h3>
          <h3 className="total-highlight">= Rs. {totalAmount.toFixed(2)}</h3>
        </div>
      </div>

      <div className="payment-details-section">
        <h2 className="payment-header-title">Payment Details</h2>
        <div className="payment-body">
          <div className="location-selection-area">
            <div className="location-header">
              <h3 style={{color: '#fff', fontSize: '1rem'}}>Shipping Location</h3>
              <Link to="/shipping_address" className="edit-loc-btn" >+ Add New</Link>
            </div>
            <div className="location-grid" style={{marginBottom: '20px'}}>
              {warehouses.map((loc) => (
                <div 
                  key={loc._id} 
                  className={`location-card-mini ${selectedAddress === loc._id ? "selected" : ""}`}
                  onClick={() => setSelectedAddress(loc._id)}
                  style={{ background: selectedAddress === loc._id ? '#333' : '#1a1a1a', border: selectedAddress === loc._id ? '1px solid #fff' : '1px solid #333', cursor: 'pointer', padding: '10px', borderRadius: '8px' }}
                >
                  <div className="loc-card-header">
                    <FaMapMarkerAlt className="loc-pin" style={{color: '#fff'}} />
                    {selectedAddress === loc._id && <FaCheckCircle className="check-active" style={{color: '#fff', float: 'right'}} />}
                  </div>
                  <strong style={{color: '#fff', display: 'block', marginTop: '5px'}}>{loc.warehouseName}</strong>
                  <p style={{color: '#bbb', fontSize: '0.8rem'}}>{loc.address}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="method-grid">
            <label className="method-box-custom">
              <input type="radio" name="payMethod" checked={paymentMethod === "card"} onChange={() => setPaymentMethod("card")} />
              <img src={credit_card} alt="Cards" className="card-img-selector" />
            </label>
            <label className="method-box-custom">
              <input type="radio" name="payMethod" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} />
              <span className="cod-text">Cash On Delivery</span>
            </label>
          </div>

          <form className="payment-form" onSubmit={handlePayNow}>
            <div className="form-field">
              <label>Name on card</label>
              <input type="text" placeholder="ABC Perera" value={formData.nameOnCard} onChange={(e) => setFormData({...formData, nameOnCard: e.target.value})}
                required={paymentMethod === "card"} disabled={paymentMethod === "cod"} />
            </div>
            <div className="form-field">
              <label>Card Number</label>
              <input type="text" placeholder="XXXX XXXX XXXX XXXX" value={formData.cardNumber} onChange={(e) => setFormData({...formData, cardNumber: e.target.value})}
                disabled={paymentMethod === "cod"} />
            </div>
            <div className="form-split">
              <div className="form-field">
                <label>Expiry date</label>
                <input type="text" placeholder="MM / YY" value={formData.expiry} onChange={(e) => setFormData({...formData, expiry: e.target.value})}
                  disabled={paymentMethod === "cod"} />
              </div>
              <div className="form-field">
                <label>CVV</label>
                <input type="text" placeholder="X X X" value={formData.cvv} onChange={(e) => setFormData({...formData, cvv: e.target.value})}
                  disabled={paymentMethod === "cod"} />
              </div>
            </div>
            <button type="submit" className="final-pay-btn">
               {paymentMethod === "card" ? "PAY NOW" : "PLACE ORDER"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Payment;