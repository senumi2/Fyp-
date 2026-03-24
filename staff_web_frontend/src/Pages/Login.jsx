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
      
      // 1. Token එක සහ Role එක localStorage එකේ Save කිරීම
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.user.role); 

      alert("Login Successful! Welcome " + (res.data.user.fullName || ""));

      // 2. Role එක අනුව අදාළ Dashboard එකට යොමු කිරීම (Redirect)
      const userRole = res.data.user.role;

      if (userRole === 'admin') {
        navigate('/adminDashboard');
      } else if (userRole === 'driver') {
        navigate('/driverDashboard');
      } else {
        // සාමාන්‍ය පාරිභෝගිකයෙකු නම් Profile එකට හෝ Home එකට
        navigate('/profile'); 
      }

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
          <input 
            type="email" 
            placeholder="Email Address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <button type="submit" className="auth-btn">Login</button>
        </form>
        <p style={{marginTop: '15px', fontSize: '12px', color: '#fff'}}>
          Don't have an account? <span onClick={() => navigate('/register')} style={{cursor:'pointer', color:'#fdbb2d', fontWeight: 'bold'}}>Register Here</span>
        </p>
      </div>
    </div>
  );
};

export default Login;