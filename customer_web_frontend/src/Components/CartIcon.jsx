import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import "./CartIcon.css";

function CartIcon() {
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartCount(cart.length);
  };

  useEffect(() => {
    updateCartCount();

    // වෙනත් පිටුවලින් දත්ත වෙනස් කරන විට හඳුනා ගැනීමට
    window.addEventListener("storage", updateCartCount);
    window.addEventListener("cartUpdated", updateCartCount);

    return () => {
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  // මෙතන තිබුණු return null එක අයින් කළා. 
  // දැන් මේ Component එක හැම වෙලේම Render වෙනවා.
  return (
    <div className="floating-cart-container" onClick={() => navigate("/payment")}>
      <div className="cart-circle">
        <FaShoppingCart className="main-cart-svg" />
        {/* බින්දුවට වඩා වැඩි නම් විතරක් රතු බෝලය (Badge) පෙන්වන්න */}
        {cartCount > 0 && <span className="cart-floating-badge">{cartCount}</span>}
      </div>
    </div>
  );
}

export default CartIcon;