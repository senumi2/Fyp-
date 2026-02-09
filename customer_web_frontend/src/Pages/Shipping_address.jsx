import React, { useEffect, useState } from "react";
import Sidebar from "../Components/Sidebar";
import "./Shipping_address.css";

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
      });
  }, []);

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
    <div className="shippingAddress-layout">
      <Sidebar />

      <div className="contact_information-box">
        <h2>Contact Information</h2>

        <form className="information-form" onSubmit={handleSubmit}>
          <input
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Full Name"
          />
          <input
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            placeholder="Contact Number"
          />

          <h2>Address</h2>

          <input
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Home Address"
          />
          <input
            name="province"
            value={formData.province}
            onChange={handleChange}
            placeholder="Province"
          />
          <input
            name="district"
            value={formData.district}
            onChange={handleChange}
            placeholder="District"
          />
          <input
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            placeholder="Postal Code"
          />

          <button className="submit-btn">
            Save Address
          </button>
        </form>
      </div>
    </div>
  );
}

export default Shipping_address;
