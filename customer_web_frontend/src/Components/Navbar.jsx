import React, { useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* වම් පස ලින්ක්ස් */}
        <div className="nav-left">
          <NavLink className="nav-link" to="/">
            Home
            <span className="drop"></span>
          </NavLink>
          <NavLink className="nav-link" to="/about">
            About Us
            <span className="drop"></span>
          </NavLink>
          <NavLink className="nav-link" to="/contact">
            Contact
            <span className="drop"></span>
          </NavLink>
        </div>

        {/* දකුණු පස බටන්ස් */}
        <div className="nav-right">
          {!user && (
            <Link to="/login" className="login-btn-navi">
              Login
            </Link>
          )}

          {user && (
            <div className="user-controls">
              <Link to="/dashboard" className="profile-btn-navi">
                Dashboard
              </Link>
              <button className="logout-btn-navi" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;