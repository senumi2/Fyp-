import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaDroplet, FaSun, FaArrowLeft } from 'react-icons/fa6';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      const token = res.data.token;
      const userData = res.data.user;

      if (token && userData) {
        login({ token, user: userData });
        const userRole = userData.jobRole ? userData.jobRole.toLowerCase().trim() : "";
        alert("Login Successful! Welcome " + (userData.fullName || ""));

        if (userRole === 'admin') navigate('/adminDashboard');
        else if (userRole === 'driver') navigate('/driverDashboard');
        else navigate('/staff'); 
      }
    } catch (err) {
      alert(err.response?.data?.msg || "Login Failed.");
    }
  };

  return (
    <div className="auth-container">
      {/* පසුබිමේ විසිරී ඇති වතුර බිංදු රාශියක් */}
      <div className="water-drop-bg drop-v1"></div>
      <div className="water-drop-bg drop-v2"></div>
      <div className="water-drop-bg drop-v3"></div>
      <div className="water-drop-bg drop-v4"></div>
      <div className="water-drop-bg drop-v5"></div>
      <div className="water-drop-bg drop-v6"></div>
      <div className="water-drop-bg drop-v7"></div>
      <div className="water-drop-bg drop-v8"></div>
      <div className="water-drop-bg drop-v9"></div>
      <div className="water-drop-bg drop-v10"></div>
      <div className="water-drop-bg drop-v11"></div>
      <div className="water-drop-bg drop-v12"></div>

      <div className="auth-card">
        <div className="title-section">
          <div className="back-to-home" onClick={() => navigate('/')} title="Back to Home">
            <FaArrowLeft />
          </div>
          <h2>Welcome Back</h2>
        </div>

        <div className="theme-icon-box">
          <FaDroplet className="icon-water" />
          <FaSun className="icon-sun" />
        </div>
        
        <p>Access your Saltern Management Portal</p>
        
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="input-group">
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="auth-btn"> Login</button>
        </form>
        
        <p className="register-footer">
          Don't have an account? 
          <span onClick={() => navigate('/register')} className="register-link">Register </span>
        </p>
      </div>
    </div>
  );
};

export default Login;