import React, { useState } from "react";
import {Link} from "react-router-dom";
import "./Contact_us.css";

function Contact_us() {

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const data = await res.json();

    if (res.ok) {
      alert("Message sent successfully!");
      setForm({ name: "", email: "", subject: "", message: "" });
    } else {
      alert(data.message);
    }
  };

    return(
      <section className="Contact_Us" id="contact_us">
        <div className="contact-page">
            <div className="contact-container">


        {/*left side form*/}
        <div className="contact-container-left">
      <div className="contact-header">
        Get In Touch With Us Now
      </div>

      <div className="contact-grid">
        {/* Phone */}
        <div className="contact-box light">
          <div className="icon">📞</div>
          <h4>Phone Number</h4>
          <p>+94 256 2395</p>
        </div>

        {/* Email */}
        <div className="contact-box">
          <div className="icon">✉️</div>
          <h4>E-mail</h4>
          <p className="link">info@lankasalt.lk</p>
        </div>

        {/* Location */}
        <div className="contact-box">
          <div className="icon">📍</div>
          <h4>Location</h4>
          <p>
            Lanka salt limited,<br />
            Mahalewaya,<br />
            Hambanthota,<br />
            Sri Lanka.
          </p>
        </div>

        {/* Working Hours */}
        <div className="contact-box light">
          <div className="icon">🕒</div>
          <h4>Working Hours</h4>
          <p>
            Monday to Friday<br />
            8.30 a.m. - 16.30 p.m.
          </p>
          <p className="closed">
            Saturday to Sunday<br />
            Close
          </p>
        </div>
      </div>
    </div>
  

        {/*Right side form*/}
        <div className="contact-form">
            <h2>Contact Us</h2>
           
            <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input name="name" value={form.name} onChange={handleChange} required />

        <label>E-mail</label>
        <input name="email" value={form.email} onChange={handleChange} required />

        <label>Subject</label>
        <input name="subject" value={form.subject} onChange={handleChange} required />

        <label>Message</label>
        <textarea name="message" value={form.message} onChange={handleChange} required />

        <button type="submit">Submit</button>
      </form>
       
        </div>

        
            </div>
        </div>
        </section>
    )
    
}

export default Contact_us;