import React, { useContext } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom"; // useLocation එකතු කළා
import { AuthContext } from "../context/AuthContext";
import { FaUserCircle } from "react-icons/fa";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation(); // දැනට සිටින පිටුව හඳුනා ගැනීමට
  const { user, logout } = useContext(AuthContext);

  // Login හෝ Register පිටුවලදී Navbar එක පෙන්වීම වැළැක්වීමට
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
        
        {/* වම් පස ලින්ක්ස් */}
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

        {/* දකුණු පස ලින්ක්ස් සහ User Profile */}
        <div className="nav-right">
          {!user && (
            <Link to="/login" className="login-btn-navi">
              Login
            </Link>
          )}

          {user && (
            <div className="user-controls">
              {/* User Icon සහ නම පෙන්වන කොටස */}
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