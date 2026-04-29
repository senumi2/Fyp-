import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
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
        // ✅ 1. AuthContext එක හරහා දත්ත Save කිරීම
        login({ token, user: userData });

        // ✅ 2. වැදගත්ම වෙනස: userData.role වෙනුවට userData.jobRole පාවිච්චි කරන්න
        const userRole = userData.jobRole ? userData.jobRole.toLowerCase().trim() : "";

        alert("Login Successful! Welcome " + (userData.fullName || ""));

        // ✅ 3. Redirect කිරීම
        if (userRole === 'admin') {
          navigate('/adminDashboard');
        } else if (userRole === 'driver') {
          navigate('/driverDashboard');
        } else {
          // Staff Members සඳහා (Ponds, Inventory etc.)
          navigate('/staff'); 
        }
      }
    } catch (err) {
      console.error("Login Error:", err);
      // මෙතනදී error එකක් පෙන්වන්නේ ඇත්තටම Backend එකෙන් error එකක් ආවොත් විතරයි
      alert(err.response?.data?.msg || "Login Failed. Please check your credentials.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <p>Login to your Saltern Management Account</p>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <input 
              type="email" 
              placeholder="Email Address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="input-group">
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="auth-btn">Login</button>
        </form>
        <p style={{ marginTop: '20px', fontSize: '13px', color: '#fff' }}>
          Don't have an account? 
          <span 
            onClick={() => navigate('/register')} 
            style={{ cursor: 'pointer', color: '#fdbb2d', fontWeight: 'bold', marginLeft: '5px' }}
          >
            Register Here
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;