import React, { useEffect, useState } from "react";
import salthands from "../images/Salt_in_hands.jpg";
import "./Shipping_address.css";
import { FiMapPin, FiUser, FiNavigation } from "react-icons/fi";

function Shipping_address() {
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    fullName: "",
    contactNumber: "",
    address: "",
    province: "",
    district: "",
    postalCode: ""
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/shipping-address", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data) setFormData(data);
      })
      .catch(err => console.error("Error:", err));
  }, [token]);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    await fetch("http://localhost:5000/api/shipping-address", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    });
    alert("Shipping Address Saved ✅");
  };

  return (
    <div className="shipping-page-wrapper" style={{ backgroundImage: `url(${salthands})` }}>
      <div className="shipping-overlay">
        <div className="shipping-card">
          <div className="shipping-header">
            <h2>Shipping Address</h2>
            <p>Provide your delivery information below</p>
          </div>

          <form className="shipping-form" onSubmit={handleSubmit}>
            <div className="form-section">
              <label><FiUser /> RECIPIENT DETAILS</label>
              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Full Name"
                required
              />
              <input
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                placeholder="Contact Number"
                required
              />
            </div>

            <div className="form-section">
              <label><FiNavigation /> DELIVERY LOCATION</label>
              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Home Address / Street"
                required
              />
              <div className="input-row">
                <input
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  placeholder="District"
                  required
                />
                <input
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  placeholder="Province"
                  required
                />
              </div>
              <input
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                placeholder="Postal Code"
                required
              />
            </div>

            <button type="submit" className="shipping-save-btn">
              SAVE SHIPPING DETAILS
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Shipping_address;