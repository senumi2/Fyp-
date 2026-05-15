import React, { useState, useContext } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      login(data); 
      navigate("/");
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="login-page">
      <div className="bg-drop drop-1"></div>
      <div className="bg-drop drop-2"></div>

      <div className="login-box">
        <div className="login-header">
          
          <Link to="/" className="back-home-arrow" title="Back to Home">
            &larr;
          </Link>
          <h2>Member Login</h2>
          <div className="underline"></div>
        </div>

        <div className="input-group">
          <input type="email" placeholder="Email Address"
            className="login-input"
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <div className="input-group">
          <input type="password" placeholder="Password"
            className="login-input"
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <button className="login-btn" onClick={handleLogin}>
          Sign In
        </button>

        <div className="links">
          <p>
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;