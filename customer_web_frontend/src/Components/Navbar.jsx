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
      <div className="nav-left">
        <NavLink className="nav-link" to="/">Home</NavLink>
        <NavLink className="nav-link" to="/about">About Us</NavLink>
        <NavLink className="nav-link" to="/contact">Contact</NavLink>
      </div>

      <div className="nav-right">
        {!user && (
          <Link to="/login" className="login-btn-navi">
            Login
          </Link>
        )}

        {user && (
          <>
            <Link to="/profile" className="profile-btn-navi">
              Profile
            </Link>

            <button className="logout-btn-navi" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
