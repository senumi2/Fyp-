import React, { useContext } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom"; 
import { AuthContext } from "../context/AuthContext";
import { FaUserCircle } from "react-icons/fa";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation(); 
  const { user, logout } = useContext(AuthContext);

  
  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        
        {/* left side links */}
        <div className="nav-left">
          <NavLink className="nav-link" to="/">
            Home
            <div className="drop"></div>
          </NavLink>
          
          <NavLink className="nav-link" to="/about">
            About Us
            <div className="drop"></div>
          </NavLink>

          {user && (
            <NavLink className="nav-link" to="/staff">
              Staff Login
              <div className="drop"></div>
            </NavLink>
          )}
        </div>

        {/* right side links and  User Profile */}
        <div className="nav-right">
          {!user && (
            <Link to="/login" className="login-btn-navi">
              Login
            </Link>
          )}

          {user && (
            <div className="user-controls">
              {/* User Icon  */}
              <div className="user-profile-nav" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginRight: '5px' }}>
                <FaUserCircle style={{ fontSize: '22px', color: '#0096D6' }} />
                <span className="nav-user-name" style={{ color: '#F1FAEE', fontWeight: '500', fontSize: '14px' }}>
                  {user.fullName || "User"}
                </span>
              </div>

              <Link to="/profile" className="profile-btn-navi">
                Profile
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