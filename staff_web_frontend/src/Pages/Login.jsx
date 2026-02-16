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
      login(data); // 🔥 THIS updates navbar immediately
      navigate("/");
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h2>Member Login</h2>

        <input type="email" placeholder="Email"
          className="login-input"
          onChange={e => setEmail(e.target.value)}
        />

        <input type="password" placeholder="Password"
          className="login-input"
          onChange={e => setPassword(e.target.value)}
        />

        <button className="login-btn" onClick={handleLogin}>
          Sign In
        </button>

        <p>
          Don't have account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
