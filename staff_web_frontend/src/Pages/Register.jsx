import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Icons import කරන්න
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '', email: '', contact: '', jobRole: '', password: '', confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false); // Password පෙන්වීමට state එක
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(formData.password !== formData.confirmPassword) {
        return alert("Passwords do not match");
    }
    
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      
      // ✅ Register සාර්ථක නම් Alert එක පෙන්වන්න
      alert("Registration submitted! Please wait for Admin approval before logging in.ion Successful!");

      // ✅ Auto-login: Backend එකෙන් එවන Token එක localStorage එකට දාන්න
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        
        // කෙලින්ම Dashboard එකට යවන්න (Login එකට නොයා)
        navigate('/dashboard'); 
      }
    } catch (err) {
      alert(err.response?.data?.msg || "Registration Failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>
        <p>Saltern Management System</p>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input type="text" name="fullName" placeholder="Full Name" onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email Address" onChange={handleChange} required />
          </div>
          
          <div className="input-group">
            <input type="text" name="contact" placeholder="Contact Number" onChange={handleChange} required />
            <select name="jobRole" onChange={handleChange} required defaultValue="">
              <option value="" disabled>Select Job Role</option>
              <option value="Admin">Admin</option>
              <option value="Ponds Management">Ponds Management</option>
              <option value="Inventory Management">Inventory Management</option>
              <option value="Harvest Management">Harvest Management</option>
              <option value="Equipment Usage">Equipment Usage</option>
              <option value="Expenses & Finance">Expenses & Finance</option>
            </select>
          </div>
          
          {/* Password field with Eye Icon */}
          <div className="password-wrapper">
            <input 
              type={showPassword ? "text" : "password"} 
              name="password" 
              placeholder="Password" 
              onChange={handleChange} 
              required 
            />
            <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="password-wrapper">
          <input 
              type={showPassword ? "text" : "password"} 
              name="confirmPassword" 
              placeholder="Confirm Password" 
              onChange={handleChange} 
              required 
            />
            <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          
          
          <button type="submit" className="auth-btn">Register Now</button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <span className="auth-link" onClick={() => navigate('/login')}>Login Here</span></p>
        </div>
      </div>
    </div>
  );
};

export default Register;