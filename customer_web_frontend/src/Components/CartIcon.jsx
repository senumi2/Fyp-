import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext"; // AuthContext එක import කරන්න
import "./CartIcon.css";

function CartIcon() {
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation(); // දැනට ඉන්න පිටුව හඳුනා ගැනීමට
  const { user } = useContext(AuthContext); // User ලොග් වෙලාද බලන්න

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartCount(cart.length);
  };

  useEffect(() => {
    updateCartCount();

    window.addEventListener("storage", updateCartCount);
    window.addEventListener("cartUpdated", updateCartCount);

    return () => {
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  // 1. User ලොග් වෙලා නැතිනම් පෙන්වන්න එපා
  if (!user) return null;

  // 2. Login හෝ Register පිටුවල ඉන්නවා නම් පෙන්වන්න එපා
  const hiddenPaths = ["/login", "/register"];
  if (hiddenPaths.includes(location.pathname)) return null;

  return (
    <div className="floating-cart-container" onClick={() => navigate("/payment")}>
      <div className="cart-circle">
        <FaShoppingCart className="main-cart-svg" />
        {cartCount > 0 && <span className="cart-floating-badge">{cartCount}</span>}
      </div>
    </div>
  );
}

export default CartIcon;