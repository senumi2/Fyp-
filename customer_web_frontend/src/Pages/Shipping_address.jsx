import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import "./Shipping_address.css";

function Shipping_address() {
  const navigate = useNavigate();

  return (

    <div className="shippingAddress-layout">
          <Sidebar />
    
      <div className="contact_information-box">
        <h2>Contact Information</h2>

        <form className="information-form">
          <input type="text" placeholder="Full Name" />
          <input type="number" placeholder="Contact Number" />
        </form>

        <h2>Address</h2>

        <form className="information-form">
          <input type="text" placeholder="Home Address" />
          <input type="text" placeholder="Province" />
          <input type="text" placeholder="District" />
          <input type="number" placeholder="Postal Code" />


          <button className="submit-btn">Submit</button>
        </form>

        
      </div>
      </div>
    
  );
}

export default Shipping_address;
