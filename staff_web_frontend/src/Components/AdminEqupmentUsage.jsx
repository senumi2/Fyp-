import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminEqupmentUsage.css";

const AdminEqupmentUsage = () => {
  const [activePage, setActivePage] = useState("inventory");
  const [searchTerm, setSearchTerm] = useState("");
  
  const [inventory, setInventory] = useState([]);
  const [issues, setIssues] = useState([]);
  const [maintenance, setMaintenance] = useState([]);

  // Fetching all data from existing APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [invRes, issRes, mainRes] = await Promise.all([
          axios.get("http://localhost:5000/api/inventory"),
          axios.get("http://localhost:5000/api/issues"),
          axios.get("http://localhost:5000/api/maintenance")
        ]);
        setInventory(invRes.data);
        setIssues(issRes.data);
        setMaintenance(mainRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  // Filter logic for search bar
  const filteredInventory = inventory.filter(item => 
    item.items?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredIssues = issues.filter(item => 
    item.issue?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMaintenance = maintenance.filter(item => 
    item.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderContent = () => {
    switch (activePage) {
      case "inventory":
        return (
          <div className="admin-page-section">
            <h2 className="section-title">Equipment Inventory</h2>
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Date Added</th>
                  <th>Item Name</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>
                    <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td>{item.items}</td>
                    <td>{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case "issues":
        return (
          <div className="admin-page-section">
            <h2 className="section-title">Reported Issues</h2>
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Date</th>
                  <th>Issue Description</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredIssues.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>
                    <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td>{item.issue}</td>
                    <td><span className={`status-tag ${item.status.toLowerCase().replace(" ", "-")}`}>{item.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case "maintenance":
        return (
          <div className="admin-page-section">
            <h2 className="section-title">Maintenance Logs</h2>
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredMaintenance.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>
                    <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td>{item.description}</td>
                    <td><span className={`status-tag ${item.status.toLowerCase().replace(" ", "-")}`}>{item.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="admin-usage-container">
      {/* Icon Sidebar */}
      <div className="admin-sidebar-icons">
        <div className="sidebar-logo">Admin</div>
        <button 
          className={`sidebar-icon-btn ${activePage === "inventory" ? "active" : ""}`}
          onClick={() => setActivePage("inventory")}
          title="Equipment Inventory"
        >
          📦
        </button>
        <button 
          className={`sidebar-icon-btn ${activePage === "issues" ? "active" : ""}`}
          onClick={() => setActivePage("issues")}
          title="Reported Issues"
        >
          ⚠️
        </button>
        <button 
          className={`sidebar-icon-btn ${activePage === "maintenance" ? "active" : ""}`}
          onClick={() => setActivePage("maintenance")}
          title="Maintenance Logs"
        >
          🛠️
        </button>
      </div>

      {/* Main Content Area */}
      <div className="admin-main-content">
        <div className="admin-top-header">
          <div className="admin-search-wrapper">
            <span>🔍</span>
            <input 
              type="text" 
              placeholder="Search details..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="admin-content-body">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminEqupmentUsage;