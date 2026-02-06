import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import "./PaymentHistory.css"

function PaymentHistory() {
  const navigate = useNavigate();

  return (

    <div className="PaymentHistory-layout">
          <Sidebar />
    
      
      </div>
    
  );
}

export default PaymentHistory;
