import React from "react";
import "./Contact_info.css";

function ContactForm() {
  return (
    <div className="contact-container">
      <h2 className="contact-title">Contact Information</h2>

      <div className="form-group">
        <input
          type="text"
          placeholder="Full Name"
          className="input-field"
        />
      </div>

      <div className="form-group">
        <input
          type="text"
          placeholder="Contact Number"
          className="input-field"
        />
      </div>
      

      <h3 className="section-title">Address</h3>

      <div className="form-group">
        <input
          type="text"
          placeholder="Full Name"
          className="input-field"
        />
      </div>

      <div className="form-group">
        <input
          type="text"
          placeholder="Home Address"
          className="input-field"
        />
      </div>

      <div className="form-group">
        <input
          type="text"
          placeholder="Province"
          className="input-field"
        />
      </div>

      <div className="form-group">
        <input
          type="text"
          placeholder="District"
          className="input-field"
        />
      </div>

      <div className="form-group">
        <input
          type="text"
          placeholder="Postal Code"
          className="input-field"
        />
      </div>

      <button className="submit-btn">Submit</button>
    </div>
  );
}

export default ContactForm;
