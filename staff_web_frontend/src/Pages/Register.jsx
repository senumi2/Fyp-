import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa';
import { FaDroplet, FaSun } from 'react-icons/fa6';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '', email: '', contact: '', jobRole: '', password: '', confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const navigate = useNavigate();

  // සියලුම input වල දත්ත නිවැරදිව state එකට ඇතුළු වන සේ සකස් කරන ලදී
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // මෙහිදී name එක 'reg_user_email' වැනි එකක් වුවද නිවැරදි state key එකට data යවයි
    if (name === "reg_user_email") {
      setFormData({ ...formData, email: value });
    } else if (name === "reg_user_password") {
      setFormData({ ...formData, password: value });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(formData.password !== formData.confirmPassword) {
        return alert("Passwords do not match");
    }
    
    try {
      // Backend එකට යන්නේ නිවැරදි email සහ password සහිත formData එකයි
      await axios.post('http://localhost:5000/api/auth/register', formData);
      
      alert("Registration submitted! Please wait for Admin approval before logging in.");
      navigate('/'); 
      
    } catch (err) {
      alert(err.response?.data?.msg || "Registration Failed");
    }
  };

  return (
    <div className="auth-container">
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

      <div className="auth-card register-card">
        <div className="title-section">
          <div className="back-to-home" onClick={() => navigate('/')} title="Back to Home">
            <FaArrowLeft />
          </div>
          <h2>Create Account</h2>
        </div>

        <div className="theme-icon-box">
          <FaDroplet className="icon-water" />
          <FaSun className="icon-sun" />
        </div>
        
        <p className="subtitle">Saltern Management System</p>
        
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="input-row">
            <input 
              type="text" 
              name="fullName" 
              placeholder="Full Name" 
              onChange={handleChange} 
              required 
              autoComplete="off" 
            />
            <input 
              type="email" 
              name="reg_user_email" // Auto-fill වැළැක්වීමට නම වෙනස්
              placeholder="Email Address" 
              onChange={handleChange} 
              required 
              autoComplete="new-email-field" 
            />
          </div>
          
          <div className="input-row">
            <input 
              type="text" 
              name="contact" 
              placeholder="Contact Number" 
              onChange={handleChange} 
              required 
              autoComplete="off" 
            />
            <select name="jobRole" className="auth-select" onChange={handleChange} required defaultValue="">
              <option value="" disabled>Select Job Role</option>
              <option value="Admin">Admin</option>
              <option value="Ponds Management">Ponds Management</option>
              <option value="Inventory Management">Inventory Management</option>
              <option value="Harvest Management">Harvest Management</option>
              <option value="Equipment Usage">Equipment Usage</option>
              <option value="Expenses & Finance">Expenses & Finance</option>
              <option value="Driver">Driver</option>
            </select>
          </div>
          
          <div className="password-wrapper">
            <input 
              type={showPassword ? "text" : "password"} 
              name="reg_user_password" // Auto-fill වැළැක්වීමට නම වෙනස්
              placeholder="Password" 
              onChange={handleChange} 
              required 
              autoComplete="new-password" 
            />
            <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="password-wrapper">
            <input 
              type={showConfirmPassword ? "text" : "password"} 
              name="confirmPassword" 
              placeholder="Confirm Password" 
              onChange={handleChange} 
              required 
              autoComplete="new-password" 
            />
            <span className="eye-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          
          <button type="submit" className="auth-btn">Register Now</button>
        </form>

        <div className="register-footer">
          <p>Already have an account? <span className="register-link" onClick={() => navigate('/login')}>Login Here</span></p>
        </div>
      </div>
    </div>
  );
};

export default Register;