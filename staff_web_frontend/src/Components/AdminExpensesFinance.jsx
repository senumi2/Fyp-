import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminExpensesFinance.css';

const AdminExpensesFinance = () => {
  const [activeTab, setActiveTab] = useState('wages');
  const [searchTerm, setSearchTerm] = useState("");

  const [wages, setWages] = useState([]);
  const [transports, setTransports] = useState([]);
  const [maintenances, setMaintenances] = useState([]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const resWages = await axios.get("http://localhost:5000/api/finance/wages");
      const resTrans = await axios.get("http://localhost:5000/api/finance/transport");
      const resMaint = await axios.get("http://localhost:5000/api/finance/maintenanceRepairLogs");
      
      setWages(resWages.data);
      setTransports(resTrans.data);
      setMaintenances(resMaint.data);
    } catch (err) { 
      console.error("Error fetching data", err); 
    }
  };

  return (
    <div className="admin-finance-wrapper">
      {/* Icon Sidebar */}
      <div className="admin-finance-sidebar-icons">
        <button onClick={() => {setActiveTab('profit'); setSearchTerm("");}} className={activeTab === 'profit' ? 'icon-btn active' : 'icon-btn'} title="Profit & Loss Summary">📊</button>
        <button onClick={() => {setActiveTab('wages'); setSearchTerm("");}} className={activeTab === 'wages' ? 'icon-btn active' : 'icon-btn'} title="Work Wages View">👷‍♂️</button>
        <button onClick={() => {setActiveTab('transport'); setSearchTerm("");}} className={activeTab === 'transport' ? 'icon-btn active' : 'icon-btn'} title="Transport Records">🚛</button>
        <button onClick={() => {setActiveTab('maintenance'); setSearchTerm("");}} className={activeTab === 'maintenance' ? 'icon-btn active' : 'icon-btn'} title="Maintenance Logs">🛠️</button>
      </div>

      <div className="admin-finance-content">
        
        {/* WAGES VIEW */}
        {activeTab === 'wages' && (
          <div className="tab-pane">
            <h2 className="view-header">Workers' Wages Records</h2>
            <div className="search-box">
              <input type="text" className="search-bar" placeholder="🔍 Search worker name..." value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} />
            </div>
            <div className="table-container">
              <table className="admin-view-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Worker Name</th>
                    <th>Role / Designation</th>
                    <th>Hours</th>
                    <th>Rate (Rs.)</th>
                    <th>Total (Rs.)</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {wages.filter(w => w.workerName?.toLowerCase().includes(searchTerm.toLowerCase())).map(w => (
                    <tr key={w._id}>
                      <td>{new Date(w.date).toLocaleDateString()}</td>
                      <td>{w.workerName}</td>
                      <td>{w.role}</td>
                      <td>{w.hoursWorked}</td>
                      <td>{w.wageRate.toLocaleString()}</td>
                      <td className="bold-text">{w.total.toLocaleString()}</td>
                      <td><span className={`status-badge ${w.status.toLowerCase()}`}>{w.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TRANSPORT VIEW */}
        {activeTab === 'transport' && (
          <div className="tab-pane">
            <h2 className="view-header">Transport Cost Records</h2>
            <div className="search-box">
              <input type="text" className="search-bar" placeholder="🔍 Search vehicle..." value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} />
            </div>
            <div className="table-container">
              <table className="admin-view-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Vehicle Details</th>
                    <th>Route / Trip</th>
                    <th>Fuel Cost (Rs.)</th>
                    <th>Maint. Cost (Rs.)</th>
                    <th>Grand Total (Rs.)</th>
                  </tr>
                </thead>
                <tbody>
                  {transports.filter(t => t.vehicle?.toLowerCase().includes(searchTerm.toLowerCase())).map(t => (
                    <tr key={t._id}>
                      <td>{new Date(t.date).toLocaleDateString()}</td>
                      <td>{t.vehicle}</td>
                      <td>{t.route}</td>
                      <td>{t.fuelCost.toLocaleString()}</td>
                      <td>{t.maintenance.toLocaleString()}</td>
                      <td className="bold-text">{t.total.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MAINTENANCE VIEW */}
        {activeTab === 'maintenance' && (
          <div className="tab-pane">
            <h2 className="view-header">Maintenance & Repair Logs</h2>
            <div className="search-box">
              <input type="text" className="search-bar" placeholder="🔍 Search equipment..." value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} />
            </div>
            <div className="table-container">
              <table className="admin-view-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Equipment / Tool</th>
                    <th>Issue Description</th>
                    <th>Repair Cost (Rs.)</th>
                    <th>Current Status</th>
                  </tr>
                </thead>
                <tbody>
                  {maintenances.filter(m => m.equipment?.toLowerCase().includes(searchTerm.toLowerCase())).map(m => (
                    <tr key={m._id}>
                      <td>{new Date(m.date).toLocaleDateString()}</td>
                      <td>{m.equipment}</td>
                      <td>{m.issue}</td>
                      <td className="bold-text">{Number(m.cost).toLocaleString()}</td>
                      <td><span className={`status-badge ${m.statuse?.toLowerCase()}`}>{m.statuse}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PROFIT SUMMARY */}
        {activeTab === 'profit' && (
          <div className="tab-pane">
            <h2 className="view-header">Financial Summary Dashboard</h2>
            <div className="summary-cards">
                <div className="card"><h3>Total Wages</h3><p>Rs.{wages.reduce((acc, curr) => acc + curr.total, 0).toLocaleString()}</p></div>
                <div className="card"><h3>Transport Total</h3><p>Rs.{transports.reduce((acc, curr) => acc + curr.total, 0).toLocaleString()}</p></div>
                <div className="card"><h3>Repair Total</h3><p>Rs.{maintenances.reduce((acc, curr) => acc + (Number(curr.cost) || 0), 0).toLocaleString()}</p></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminExpensesFinance;