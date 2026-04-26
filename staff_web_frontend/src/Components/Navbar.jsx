import React, { useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaUserCircle } from "react-icons/fa"; // User icon එකක් ලස්සනට පෙන්වන්න
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
        {user && <NavLink className="nav-link" to="/staff">Staff Login</NavLink>}
      </div>

      <div className="nav-right">
        {!user && (
          <Link to="/login" className="login-btn-navi">
            Login
          </Link>
        )}

        {user && (
          <>
            {/* User ගේ නම සහ Icon එක පෙන්වන කොටස */}
            <div className="user-profile-nav" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginRight: '15px' }}>
              <FaUserCircle style={{ fontSize: '20px', color: '#fdbb2d' }} />
              <span className="nav-user-name" style={{ color: '#fff', fontWeight: '500', fontSize: '14px' }}>
                {user.fullName || "User"}
              </span>
            </div>

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