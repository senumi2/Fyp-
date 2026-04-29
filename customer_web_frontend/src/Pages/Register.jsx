import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Register.css";

function Register() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    contact: "",
    password: "",
    confirmPassword: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);

    const { confirmPassword, ...restOfData } = form;
    const registrationData = {
      ...restOfData,
      jobRole: "Customer"
    };

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registrationData)
      });

      const data = await res.json();

      if (res.ok) {
        login(data);
        alert("Registration Successful!");
        navigate("/");
      } else {
        alert(data.message || data.error || "Registration failed.");
      }
    } catch (error) {
      console.error("Registration Error:", error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      {/* පාවෙන ජල බින්දු */}
      <div className="bg-drop drop-1"></div>
      <div className="bg-drop drop-2"></div>

      <div className="register-box">
        <div className="register-header">
          {/* Back to Home Arrow */}
          <Link to="/" className="back-home-arrow" title="Back to Home">
            &larr;
          </Link>
          <h2>Create Account</h2>
          <div className="underline"></div>
        </div>
        
        <p className="subtitle">Join with National Salt Limited</p>

        <form className="register-form" onSubmit={handleSubmit}>
          <input 
            name="fullName" 
            placeholder="Full Name" 
            onChange={handleChange} 
            required 
          />
          <input 
            name="email" 
            type="email" 
            placeholder="Email Address" 
            onChange={handleChange} 
            required 
          />
          <input 
            name="contact" 
            placeholder="Contact Number" 
            onChange={handleChange} 
            required 
          />
          <input 
            name="password" 
            type="password" 
            placeholder="Password" 
            onChange={handleChange} 
            required 
          />
          <input 
            name="confirmPassword" 
            type="password" 
            placeholder="Confirm Password" 
            onChange={handleChange} 
            required 
          />

          <button type="submit" className="register-btn" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="switch-text">
          Already have an account? <Link to="/login" className="login-link">Login Here</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;