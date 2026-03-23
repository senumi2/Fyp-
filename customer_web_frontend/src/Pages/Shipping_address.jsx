import React, { useEffect, useState } from "react";
import salthands from "../images/Salt_in_hands.jpg";
import "./Shipping_address.css";
import { FiMapPin, FiUser, FiNavigation, FiPlus, FiTrash2 } from "react-icons/fi";

function Shipping_address() {
  const token = localStorage.getItem("token");
  const [warehouses, setWarehouses] = useState([]);
  const [formData, setFormData] = useState({
    warehouseName: "", // ගබඩාව හඳුනා ගැනීමට නමක් (e.g., Colombo Store)
    fullName: "",
    contactNumber: "",
    address: "",
    province: "",
    district: "",
    postalCode: ""
  });

  // 1. සියලුම ගබඩා විස්තර ලබා ගැනීම
  const fetchAddresses = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/shipping-address", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) setWarehouses(data);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  useEffect(() => { fetchAddresses(); }, [token]);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. අලුත් ගබඩාවක් එකතු කිරීම
  const handleSubmit = async e => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/shipping-address", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    });
    if (res.ok) {
      alert("Warehouse Location Saved ✅");
      setFormData({ warehouseName: "", fullName: "", contactNumber: "", address: "", province: "", district: "", postalCode: "" });
      fetchAddresses(); // ලැයිස්තුව Update කිරීම
    }
  };

  // 3. ගබඩාවක් ඉවත් කිරීම
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this location?")) {
      await fetch(`http://localhost:5000/api/shipping-address/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAddresses();
    }
  };

  return (
    <div className="shipping-page-wrapper" style={{ backgroundImage: `url(${salthands})` }}>
      <div className="shipping-overlay">
        <div className="shipping-card multi-location">
          
          {/* LEFT SIDE: FORM */}
          <div className="form-column">
            <div className="shipping-header">
              <h2>Warehouse Locations</h2>
              <p>Add your delivery points for salt shipments</p>
            </div>

            <form className="shipping-form" onSubmit={handleSubmit}>
              <div className="form-section">
                <label><FiMapPin /> WAREHOUSE IDENTIFIER</label>
                <input name="warehouseName" value={formData.warehouseName} onChange={handleChange} placeholder="e.g. Main Warehouse / Jaffna Store" required />
              </div>

              <div className="form-section">
                <label><FiUser /> RECIPIENT DETAILS</label>
                <input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name" required />
                <input name="contactNumber" value={formData.contactNumber} onChange={handleChange} placeholder="Contact Number" required />
              </div>

              <div className="form-section">
                <label><FiNavigation /> ADDRESS DETAILS</label>
                <input name="address" value={formData.address} onChange={handleChange} placeholder="Street Address" required />
                <div className="input-row-3">
                  <input name="district" value={formData.district} onChange={handleChange} placeholder="District" required />
                  <input name="province" value={formData.province} onChange={handleChange} placeholder="Province" required />
                  <input name="postalCode" value={formData.postalCode} onChange={handleChange} placeholder="Zip" required />
                </div>
              </div>

              <button type="submit" className="shipping-save-btn">
                <FiPlus /> ADD NEW LOCATION
              </button>
            </form>
          </div>

          {/* RIGHT SIDE: SAVED LOCATIONS LIST */}
          <div className="locations-column">
             <h3>Saved Locations</h3>
             <div className="location-list">
                {warehouses.length === 0 ? <p className="empty-msg">No warehouses added yet.</p> : 
                  warehouses.map((loc) => (
                    <div key={loc._id} className="address-item-card">
                      <div className="loc-info">
                        <strong>{loc.warehouseName}</strong>
                        <p>{loc.address}, {loc.district}</p>
                        <small>{loc.contactNumber}</small>
                      </div>
                      <button onClick={() => handleDelete(loc._id)} className="delete-loc-btn">
                        <FiTrash2 />
                      </button>
                    </div>
                  ))
                }
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Shipping_address;