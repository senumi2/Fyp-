import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(items);
  }, []);

  const removeFromCart = (id) => {
    const filtered = cartItems.filter(item => item.id !== id);
    setCartItems(filtered);
    localStorage.setItem("cart", JSON.stringify(filtered));
  };

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  const proceedToCheckout = () => {
    const orderData = {
      items: cartItems.map(i => i.name).join(", "),
      quantity: cartItems.reduce((acc, i) => acc + i.qty, 0),
      amount: totalPrice
    };
    localStorage.setItem("checkoutItem", JSON.stringify(orderData));
    navigate("/shipping_address");
  };

  return (
    <div className="cart-page">
      <h2>Shopping Cart</h2>
      {cartItems.length === 0 ? <p>Your cart is empty</p> : (
        <>
          <div className="cart-list">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <img src={`http://localhost:5000${item.image}`} alt={item.name} width="80" />
                <div>
                  <h4>{item.name}</h4>
                  <p>Rs. {item.price} x {item.qty}</p>
                </div>
                <button onClick={() => removeFromCart(item.id)}>Remove</button>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h3>Total: Rs. {totalPrice.toFixed(2)}</h3>
            <button className="checkout-btn" onClick={proceedToCheckout}>Proceed to Checkout</button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;