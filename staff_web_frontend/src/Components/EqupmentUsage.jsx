import React, { useState } from "react";
import EquIpmentUsageSidebar from './EquIpmentUsageSidebar';
import Inventory from '../Pages/Inventory';
import Issues from '../Pages/Issues';
import Maintenance from '../Pages/Maintenance';
import "./EqupmentUsage.css";

const EqupmentUsage = () => {
  const [activePage, setActivePage] = useState("inventory"); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  
  const renderPage = () => {
    switch (activePage) {
      case "inventory": return <Inventory />;
      case "issues": return <Issues />;
      case "maintenance": return <Maintenance />;
      default: return <Inventory />;
    }
  };


  return (
    <div className="test-container">
      
      <div className="menu-toggle-icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        ☰
      </div>

      <div style={{ display: "flex", width: "100%" }}>
        {/* if sidebar is open this will show */}
        {isSidebarOpen && (
          <EquIpmentUsageSidebar setActivePage={setActivePage} />
        )}

        {/* show page content  */}
        <div className="content-area">
          {renderPage()}
        </div>
      </div>
    </div>
  );
};

export default EqupmentUsage;