import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userType, setUserType] = useState(null);

    // Check login status when component loads
    useEffect(() => {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");

        if (token && user) {
            const parsedUser = JSON.parse(user);
            setIsLoggedIn(true);
            setUserType(parsedUser.accountType); 
        } else {
            setIsLoggedIn(false);
            setUserType(null);
        }
    }, []);

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setIsLoggedIn(false);
        setUserType(null);

        alert("Logged out successfully!");

        navigate("/");
        setTimeout(() => {
            window.location.reload();
        }, 300);
    };

    return (
        <nav className="navbar">
            <NavLink className="nav-link" to="/">Home</NavLink>
            <NavLink className="nav-link" to="/about">About Us</NavLink>
            <NavLink className="nav-link" to="/contact">Contact</NavLink>

            {/* Login / Logout Buttons */}
            {!isLoggedIn ? (
                <Link to="/login" className="login-btn-navi">
                    Login
                </Link>
            ) : (
                <button className="logout-btn-navi" onClick={handleLogout}>
                    Logout
                </button>
            )}

            {/*Dashboard visible only for registered customers */}
            {isLoggedIn && userType === "registered_customer" && (
                <div
                    style={{
                        padding: "10px",
                        backgroundColor: "#a20606",
                        color: "#fff",
                        marginLeft: "15px"
                    }}
                >
                    <Link
                        to="/dashboard"
                        className="dashboard"
                        style={{ color: "#fff", textDecoration: "none" }}
                    >
                        Dashboard
                    </Link>
                </div>
            )}
        </nav>
    );
}

export default Navbar;
