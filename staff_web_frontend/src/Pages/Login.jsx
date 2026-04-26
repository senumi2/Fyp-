import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      
      // 1. Token එක Save කිරීම
      localStorage.setItem('token', res.data.token);

      // 2. ගැටලුව විසඳීම: Backend එකෙන් එන්නේ jobRole මිස role නොවේ.
      // එය lowercase කර සේව් කිරීම StaffLogin සමඟ ගැලපීමට අත්‍යවශ්‍යයි.
      if (res.data.user && res.data.user.jobRole) {
        const role = res.data.user.jobRole.toLowerCase();
        localStorage.setItem('role', role); 
      }

      alert("Login Successful! Welcome " + (res.data.user.fullName || ""));

      // 3. Home Page එකට යොමු කිරීම
      navigate('/'); 

    } catch (err) {
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