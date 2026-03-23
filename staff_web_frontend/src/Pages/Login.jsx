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
      localStorage.setItem('token', res.data.token);
      alert("Login Successful!");
      navigate('/dashboard'); // Login වූ පසු යන පිටුව
    } catch (err) {
      alert(err.response?.data?.msg || "Login Failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <p>Login to your Saltern Management Account</p>
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email Address" onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" className="auth-btn">Login</button>
        </form>
        <p style={{marginTop: '15px', fontSize: '12px'}}>
          Don't have an account? <span onClick={() => navigate('/register')} style={{cursor:'pointer', color:'#fdbb2d'}}>Register Here</span>
        </p>
      </div>
    </div>
  );
};

export default Login;