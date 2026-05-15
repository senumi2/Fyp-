import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import "./CartIcon.css";

function CartIcon() {
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const updateCartCount = async () => {
    let count = 0;
  
    if (user) {
      try {
        const res = await axios.get(`http://localhost:5000/api/cart/${user._id || user.id}`);
        if (res.data && res.data.items) {
          count = res.data.items.length;
        }
      } catch (err) {
        console.error("Cart fetch error:", err);
      }
    } else {
      
      const localCart = JSON.parse(localStorage.getItem("cart")) || [];
      count = localCart.length;
    }
    setCartCount(count);
  };

  useEffect(() => {
    updateCartCount();
   
    window.addEventListener("cartUpdated", updateCartCount);
    window.addEventListener("storage", updateCartCount);

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
      window.removeEventListener("storage", updateCartCount);
    };
  }, [user]);

  if (!user) return null;
  const hiddenPaths = ["/login", "/register"];
  if (hiddenPaths.includes(location.pathname)) return null;

  return (
    <div className="floating-cart-container" onClick={() => navigate("/payment")}>
      <div className="cart-circle">
        <FaShoppingCart className="main-cart-svg" />
       
        {cartCount > 0 && (
          <span className="cart-floating-badge">{cartCount}</span>
        )}
      </div>
    </div>
  );
}

export default CartIcon;