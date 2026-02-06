import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import "./OrderTracking.css";

function OrderTracking() {
  const navigate = useNavigate();

  return (

    <div className="OrderTracking -layout">
          <Sidebar />
    
      
      </div>
    
  );
}

export default OrderTracking;
