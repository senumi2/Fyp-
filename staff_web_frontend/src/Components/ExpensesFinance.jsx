import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ExpensesFinance.css';

const ExpensesFinance = () => {
  const [activeTab, setActiveTab] = useState('wages');
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // Data Lists
  const [wages, setWages] = useState([]);
  const [transports, setTransports] = useState([]);
  const [maintenances, setMaintenances] = useState([]);

  // Form States
  const [wageForm, setWageForm] = useState({ workerName: '', role: '', hoursWorked: '', wageRate: '', status: 'Pending' });
  const [transForm, setTransForm] = useState({ vehicle: '', route: '', fuelCost: '', maintenance: '' });
  const [maintForm, setMaintForm] = useState({ equipment: '', issue: '', cost: '', statuse: 'Pending' });

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

  const handleFormSubmit = async (e, type) => {
    e.preventDefault();
    const endpoint = type === 'maintenance' ? 'maintenanceRepairLogs' : type;
    let url = `http://localhost:5000/api/finance/${endpoint}`;
    
    let data = {};
    if (type === 'wages') {
      data = { ...wageForm, total: Number(wageForm.hoursWorked) * Number(wageForm.wageRate) };
    } else if (type === 'transport') {
      data = { ...transForm, total: parseFloat(transForm.fuelCost || 0) + parseFloat(transForm.maintenance || 0) };
    } else if (type === 'maintenance') {
      data = maintForm;
    }

    try {
      if (isEditing) {
        await axios.put(`${url}/${currentId}`, data);
      } else {
        await axios.post(url, data);
      }
      resetForms();
      fetchAllData();
    } catch (err) { 
      console.error("Submission error", err);
      alert("Action failed!"); 
    }
  };

  const handleDelete = async (type, id) => {
    if (window.confirm("Are you sure you want to delete this?")) {
      const endpoint = type === 'maintenance' ? 'maintenanceRepairLogs' : type;
      try {
        await axios.delete(`http://localhost:5000/api/finance/${endpoint}/${id}`);
        fetchAllData();
      } catch (err) {
        console.error("Delete error", err);
      }
    }
  };

  const resetForms = () => {
    setIsEditing(false);
    setCurrentId(null);
    setSearchTerm(""); // Tab එක මාරු කරන විට search එක reset කිරීම
    setWageForm({ workerName: '', role: '', hoursWorked: '', wageRate: '', status: 'Pending' });
    setTransForm({ vehicle: '', route: '', fuelCost: '', maintenance: '' });
    setMaintForm({ equipment: '', issue: '', cost: '', statuse: 'Pending' });
  };

  const startEdit = (item, type) => {
    setIsEditing(true);
    setCurrentId(item._id);
    if (type === 'wages') setWageForm(item);
    if (type === 'transport') setTransForm(item);
    if (type === 'maintenance') setMaintForm(item);
  };

  return (
    <div className="finance-wrapper">
      <div className="finance-sidebar">
        <button onClick={() => {setActiveTab('profit'); resetForms();}} className={activeTab === 'profit' ? 'nav-btn active' : 'nav-btn'}>Profit & Lost Report</button>
        <button onClick={() => {setActiveTab('wages'); resetForms();}} className={activeTab === 'wages' ? 'nav-btn active' : 'nav-btn'}>Work Wages Tracking</button>
        <button onClick={() => {setActiveTab('transport'); resetForms();}} className={activeTab === 'transport' ? 'nav-btn active' : 'nav-btn'}>Transport cost Record</button>
        <button onClick={() => {setActiveTab('maintenance'); resetForms();}} className={activeTab === 'maintenance' ? 'nav-btn active' : 'nav-btn'}>Maintenance & Repairs Logs</button>
      </div>

      <div className="finance-content">
        
        {/* WORK WAGES SECTION */}
        {activeTab === 'wages' && (
          <div className="tab-pane">
            <h2>Workers' Wages Tracking</h2>
            <form className="finance-form" onSubmit={(e) => handleFormSubmit(e, 'wages')}>
              <input type="text" placeholder="Worker Name" value={wageForm.workerName} onChange={(e)=>setWageForm({...wageForm, workerName: e.target.value})} required />
              <input type="text" placeholder="Role" value={wageForm.role} onChange={(e)=>setWageForm({...wageForm, role: e.target.value})} required />
              <input type="number" placeholder="Hours" value={wageForm.hoursWorked} onChange={(e)=>setWageForm({...wageForm, hoursWorked: e.target.value})} required />
              <input type="number" placeholder="Rate" value={wageForm.wageRate} onChange={(e)=>setWageForm({...wageForm, wageRate: e.target.value})} required />
              <select value={wageForm.status} onChange={(e)=>setWageForm({...wageForm, status: e.target.value})}>
                <option value="Pending">Pending</option><option value="Paid">Paid</option>
              </select>
              <button type="submit" className="add-btn">{isEditing ? "Update" : "Add"}</button>
            </form>
            <div className="search-container">
            <div className="search-input-wrapper">
              <svg className="search-icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                <path fill="#1e2b26" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
              <input type="text" className="search-bar" placeholder=" Search worker name..." value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} />
            </div>
            </div>
            <div className="table-container">
              <table className="finance-table">
                <thead><tr><th>Date</th><th>Worker</th><th>Role</th><th>Hours</th><th>Rate</th><th>Total</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {wages.filter(w => w.workerName?.toLowerCase().includes(searchTerm.toLowerCase())).map(w => (
                    <tr key={w._id}>
                      <td>{new Date(w.date).toLocaleDateString()}</td>
                      <td>{w.workerName}</td><td>{w.role}</td><td>{w.hoursWorked}</td><td>Rs.{w.wageRate}</td><td>Rs.{w.total}</td>
                      <td><span className={`status ${w.status.toLowerCase()}`}>{w.status}</span></td>
                      <td>
                        <div className="action-buttons">
                          <button className="btn-edit" onClick={() => startEdit(w, 'wages')}>Edit</button>
                          <button className="btn-delete" onClick={() => handleDelete('wages', w._id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TRANSPORT SECTION */}
        {activeTab === 'transport' && (
          <div className="tab-pane">
            <h2>Transport Cost Record</h2>
            <form className="finance-form" onSubmit={(e) => handleFormSubmit(e, 'transport')}>
              <input type="text" placeholder="Vehicle" value={transForm.vehicle} onChange={(e)=>setTransForm({...transForm, vehicle: e.target.value})} required />
              <input type="text" placeholder="Route" value={transForm.route} onChange={(e)=>setTransForm({...transForm, route: e.target.value})} required />
              <input type="number" placeholder="Fuel Cost" value={transForm.fuelCost} onChange={(e)=>setTransForm({...transForm, fuelCost: e.target.value})} required />
              <input type="number" placeholder="Maint. Cost" value={transForm.maintenance} onChange={(e)=>setTransForm({...transForm, maintenance: e.target.value})} required />
              <button type="submit" className="add-btn">{isEditing ? "Update" : "Add"}</button>
            </form>
            <div className="search-container">
            <div className="search-input-wrapper">
              <svg className="search-icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                <path fill="#1e2b26" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
              <input type="text" className="search-bar" placeholder="Search by vehicle..." value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} />
            </div>
            </div>
            <div className="table-container">
              <table className="finance-table">
                <thead><tr><th>Date</th><th>Vehicle</th><th>Route</th><th>Fuel</th><th>Maint.</th><th>Total</th><th>Actions</th></tr></thead>
                <tbody>
                  {transports.filter(t => t.vehicle?.toLowerCase().includes(searchTerm.toLowerCase())).map(t => (
                    <tr key={t._id}>
                      <td>{new Date(t.date).toLocaleDateString()}</td>
                      <td>{t.vehicle}</td><td>{t.route}</td><td>Rs.{t.fuelCost}</td><td>Rs.{t.maintenance}</td><td>Rs.{t.total}</td>
                      <td>
                        <div className="action-buttons">
                          <button className="btn-edit" onClick={() => startEdit(t, 'transport')}>Edit</button>
                          <button className="btn-delete" onClick={() => handleDelete('transport', t._id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MAINTENANCE SECTION */}
        {activeTab === 'maintenance' && (
          <div className="tab-pane">
            <h2>Maintenance & Repair Logs</h2>
            <form className="finance-form" onSubmit={(e) => handleFormSubmit(e, 'maintenance')}>
              <input type="text" placeholder="Equipment" value={maintForm.equipment} onChange={(e)=>setMaintForm({...maintForm, equipment: e.target.value})} required />
              <input type="text" placeholder="Issue" value={maintForm.issue} onChange={(e)=>setMaintForm({...maintForm, issue: e.target.value})} required />
              <input type="number" placeholder="Cost" value={maintForm.cost} onChange={(e)=>setMaintForm({...maintForm, cost: e.target.value})} required />
              <select value={maintForm.statuse} onChange={(e)=>setMaintForm({...maintForm, statuse: e.target.value})}>
                <option value="Pending">Pending</option><option value="Ongoing">Ongoing</option><option value="Fixed">Fixed</option>
              </select>
              <button type="submit" className="add-btn">{isEditing ? "Update" : "Add"}</button>
            </form>
            <div className="search-container">
            <div className="search-input-wrapper">
              <svg className="search-icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                <path fill="#1e2b26" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
              <input type="text" className="search-bar" placeholder=" Search equipment or status..." value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} />
            </div>
            </div>
            <div className="table-container">
              <table className="finance-table">
                <thead><tr><th>Date</th><th>Equipment</th><th>Issue</th><th>Cost</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {maintenances.filter(m => 
                    m.equipment?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                    m.statuse?.toLowerCase().includes(searchTerm.toLowerCase())
                  ).map(m => (
                    <tr key={m._id}>
                      <td>{new Date(m.date).toLocaleDateString()}</td>
                      <td>{m.equipment}</td><td>{m.issue}</td><td>Rs.{m.cost}</td>
                      <td><span className={`status ${m.statuse?.toLowerCase()}`}>{m.statuse}</span></td>
                      <td>
                        <div className="action-buttons">
                          <button className="btn-edit" onClick={() => startEdit(m, 'maintenance')}>Edit</button>
                          <button className="btn-delete" onClick={() => handleDelete('maintenance', m._id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* PROFIT TAB */}
        {activeTab === 'profit' && (
          <div className="tab-pane">
            <h2>Profit & Lost Report</h2>
            <div className="chart-box">Graph Displaying Area...</div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ExpensesFinance;