import React, { useState } from "react";
import "./Contact_us.css";

function Contact_us() {
 
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const loggedInEmail = storedUser ? storedUser.email : "";

  const [form, setForm] = useState({
    name: "",
    subject: "",
    message: ""
  });

  const handleChange = (e) => {
    
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    if (!form.name.trim() || !form.subject.trim() || !form.message.trim()) {
      alert("Please fill in all the required fields.");
      return; 
    }

    if (!loggedInEmail) {
      alert("User email not found. Please log in first.");
      return;
    }

   
    const formData = {
      name: form.name.trim(),
      userEmail: loggedInEmail, 
      subject: form.subject.trim(),
      message: form.message.trim()
    };

    try {
      const res = await fetch("http://localhost:5000/api/email/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        alert("Your message has been sent to Salte Hambantota!");
       
        setForm({ name: "", subject: "", message: "" });
      } else {
        alert(data.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Server error. Please check your connection.");
    }
  };

  return (
    <section className="Contact_Us" id="contact_us">
      <div className="contact-page">
        <div className="contact-container">
          
          {/* Left Side Info */}
          <div className="contact-container-left">
            <div className="contact-header">Get In Touch With Us Now</div>
            <div className="contact-grid">
              <div className="contact-box light">
                <div className="icon">📞</div>
                <h4>Phone Number</h4>
                <p>+94 256 2395</p>
              </div>
              <div className="contact-box">
                <div className="icon">✉️</div>
                <h4>E-mail</h4>
                <p className="link">info@senumi.lk</p>
              </div>
              <div className="contact-box">
                <div className="icon">📍</div>
                <h4>Location</h4>
                <p>Mahalewaya, Hambanthota, Sri Lanka.</p>
              </div>
              <div className="contact-box light">
                <div className="icon">🕒</div>
                <h4>Working Hours</h4>
                <p>Mon - Fri: 8.30 a.m. - 4.30 p.m.</p>
              </div>
            </div>
          </div>

          {/* Right Side Form */}
          <div className="contact-form">
            <h2>Contact Us</h2>
            <form onSubmit={handleSubmit} noValidate>
              <label>Your Name</label>
              <input 
                name="name" 
                value={form.name} 
                onChange={handleChange} 
                placeholder="Enter your name"
                required 
              />

              <label>Your Email (Logged In)</label>
              <input 
                type="text" 
                value={loggedInEmail || "Log in to see email"} 
                disabled 
                style={{ backgroundColor: "#e9ecef", cursor: "not-allowed", color: "#6c757d" }}
              />

              <label>Subject</label>
              <input 
                name="subject" 
                value={form.subject} 
                onChange={handleChange} 
                placeholder="How can we help?"
                required 
              />

              <label>Message</label>
              <textarea 
                name="message" 
                value={form.message} 
                onChange={handleChange} 
                placeholder="Write your message here..."
                required 
              />

              <button type="submit">Send Message</button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Contact_us;