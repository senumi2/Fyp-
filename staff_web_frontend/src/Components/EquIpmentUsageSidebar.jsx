import React from "react";
import "./EquIpmentUsageSidebar.css";

const EquIpmentUsageSidebar = ({ setActivePage }) => {
  return (
    <div className="sidebar">
      <button className="nav-btn" onClick={() => setActivePage("inventory")}>
        Inventory
      </button>
      <button className="nav-btn" onClick={() => setActivePage("issues")}>
        Report Issues
      </button>
      <button className="nav-btn" onClick={() => setActivePage("maintenance")}>
        Maintenance Logs
      </button>
    </div>
  );
};

export default EquIpmentUsageSidebar;