import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ExpensesFinance.css';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

const ExpensesFinance = () => {
  const [activeTab, setActiveTab] = useState('profit');
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState("");

  const [wages, setWages] = useState([]);
  const [transports, setTransports] = useState([]);
  const [maintenances, setMaintenances] = useState([]);
  const [operationals, setOperationals] = useState([]);
  const [finData, setFinData] = useState(null);

  const [wageForm, setWageForm] = useState({ workerName: '', role: '', hoursWorked: '', wageRate: '', status: 'Pending' });
  const [transForm, setTransForm] = useState({ vehicle: '', route: '', fuelCost: '', maintenance: '' });
  const [maintForm, setMaintForm] = useState({ equipment: '', issue: '', cost: '', status: 'Pending' });
  const [opForm, setOpForm] = useState({ description: '', category: 'Raw Materials', amount: '' });

  const getAuthHeaders = () => {
    const token = sessionStorage.getItem("token");
    return { 
      headers: { Authorization: `Bearer ${token ? token.trim() : ""}` } 
    };
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    if (activeTab === 'profit') {
      fetchFinancialStats();
    }
  }, [activeTab, selectedYear, selectedMonth]);

  const fetchFinancialStats = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/analytics/financial-stats?year=${selectedYear}&month=${selectedMonth}`, 
        getAuthHeaders()
      );
      setFinData(res.data);
    } catch (err) {
      console.error("Error fetching financial stats:", err);
    }
  };

  const fetchAllData = async () => {
    try {
      const [resW, resT, resM, resO] = await Promise.all([
        axios.get("http://localhost:5000/api/finance/wages", getAuthHeaders()),
        axios.get("http://localhost:5000/api/finance/transport", getAuthHeaders()),
        axios.get("http://localhost:5000/api/finance/maintenanceRepairLogs", getAuthHeaders()),
        axios.get("http://localhost:5000/api/operational-expenses/operational", getAuthHeaders())
      ]);
      setWages(resW.data);
      setTransports(resT.data);
      setMaintenances(resM.data);
      setOperationals(resO.data);
    } catch (err) { 
      console.error("Fetch error:", err); 
    }
  };

  const handleFormSubmit = async (e, type) => {
    e.preventDefault();
    const urlMap = {
      wages: "http://localhost:5000/api/finance/wages",
      transport: "http://localhost:5000/api/finance/transport",
      maintenance: "http://localhost:5000/api/finance/maintenanceRepairLogs",
      operational: "http://localhost:5000/api/operational-expenses/operational"
    };

    let data = {};
    if (type === 'wages') data = { ...wageForm, total: Number(wageForm.hoursWorked) * Number(wageForm.wageRate) };
    else if (type === 'transport') data = { ...transForm, total: parseFloat(transForm.fuelCost || 0) + parseFloat(transForm.maintenance || 0) };
    else if (type === 'maintenance') data = maintForm;
    else if (type === 'operational') data = opForm;

    try {
      if (isEditing) {
        await axios.put(`${urlMap[type]}/${currentId}`, data, getAuthHeaders());
      } else {
        await axios.post(urlMap[type], data, getAuthHeaders());
      }
      resetForms(); 
      fetchAllData();
    } catch (err) { 
      alert("Action failed! Check authentication."); 
    }
  };

  const handleDelete = async (type, id) => {
    if (window.confirm("Are you sure?")) {
      const urlMap = {
        wages: "http://localhost:5000/api/finance/wages",
        transport: "http://localhost:5000/api/finance/transport",
        maintenance: "http://localhost:5000/api/finance/maintenanceRepairLogs",
        operational: "http://localhost:5000/api/operational-expenses/operational"
      };
      try { 
        await axios.delete(`${urlMap[type]}/${id}`, getAuthHeaders()); 
        fetchAllData(); 
      } catch (err) { console.error(err); }
    }
  };

  const startEdit = (item, type) => {
    setIsEditing(true); 
    setCurrentId(item._id);
    if (type === 'wages') setWageForm(item);
    if (type === 'transport') setTransForm(item);
    if (type === 'maintenance') setMaintForm(item);
    if (type === 'operational') setOpForm(item);
  };

  const resetForms = () => {
    setIsEditing(false); setCurrentId(null); setSearchTerm("");
    setWageForm({ workerName: '', role: '', hoursWorked: '', wageRate: '', status: 'Pending' });
    setTransForm({ vehicle: '', route: '', fuelCost: '', maintenance: '' });
    setMaintForm({ equipment: '', issue: '', cost: '', status: 'Pending' });
    setOpForm({ description: '', category: 'Raw Materials', amount: '' });
  };

  const sumAgg = (data) => {
    if (!data) return 0;
    if (Array.isArray(data)) return data.reduce((acc, curr) => acc + (parseFloat(curr.totalAmount) || 0), 0);
    if (typeof data === 'object' && data.totalAmount) return parseFloat(data.totalAmount) || 0;
    return 0;
  };

  const calculateTotals = () => {
    if (!finData) return { income: 0, wages: 0, transport: 0, maintenance: 0, operational: 0, totalExp: 0, net: 0 };
    const income = sumAgg(finData.incomeStats);
    const wVal = sumAgg(finData.wageStats);
    const tVal = sumAgg(finData.transportStats);
    const mVal = sumAgg(finData.maintenanceStats);
    const oVal = sumAgg(finData.operationalStats);
    const totalExp = wVal + tVal + mVal + oVal;
    return { income, wages: wVal, transport: tVal, maintenance: mVal, operational: oVal, totalExp, net: income - totalExp };
  };

  const totals = calculateTotals();
  const chartData = [
    { name: 'Wages', value: totals.wages },
    { name: 'Transport', value: totals.transport },
    { name: 'Maintenance', value: totals.maintenance },
    { name: 'Operational', value: totals.operational },
  ];
  const barChartData = [{ name: 'Revenue vs Cost', Income: totals.income, Expenses: totals.totalExp }];
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="finance-wrapper">
      <div className="finance-sidebar">
        <div className="sidebar-header"><h3>💰 Finance Hub</h3></div>
        <button onClick={() => {setActiveTab('profit'); resetForms();}} className={activeTab === 'profit' ? 'nav-btn active' : 'nav-btn'}>Profit & Loss Report</button>
        <button onClick={() => {setActiveTab('wages'); resetForms();}} className={activeTab === 'wages' ? 'nav-btn active' : 'nav-btn'}>Work Wages</button>
        <button onClick={() => {setActiveTab('transport'); resetForms();}} className={activeTab === 'transport' ? 'nav-btn active' : 'nav-btn'}>Transport Costs</button>
        <button onClick={() => {setActiveTab('maintenance'); resetForms();}} className={activeTab === 'maintenance' ? 'nav-btn active' : 'nav-btn'}>Maintenance Logs</button>
        <button onClick={() => {setActiveTab('operational'); resetForms();}} className={activeTab === 'operational' ? 'nav-btn active' : 'nav-btn'}>Operational Costs</button>
      </div>

      <div className="finance-content">
        {activeTab === 'profit' && (
          <div className="tab-pane">
            <div className="report-header-flex">
              <h2>Financial Performance Overview</h2>
              <div className="filter-group">
                <select value={selectedYear} onChange={(e)=>setSelectedYear(e.target.value)}>
                  <option value="2025">2025</option><option value="2026">2026</option>
                </select>
                <select value={selectedMonth} onChange={(e)=>setSelectedMonth(e.target.value)}>
                  <option value="">Full Year</option>
                  {[...Array(12)].map((_, i) => (
                    <option key={i+1} value={i+1}>{new Date(0, i).toLocaleString('en', {month: 'long'})}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="summary-cards">
              <div className="card income"><h3>Total Income</h3><p>Rs. {totals.income.toLocaleString()}</p></div>
              <div className="card expense"><h3>Total Expenses</h3><p>Rs. {totals.totalExp.toLocaleString()}</p></div>
              <div className={`card net ${totals.net >= 0 ? 'profit' : 'loss'}`}>
                <h3>Net {totals.net >= 0 ? 'Profit' : 'Loss'}</h3>
                <p>Rs. {totals.net.toLocaleString()}</p>
              </div>
            </div>
            <div className="charts-wrapper">
              <div className="chart-container-box">
                <h3>Expense Distribution (Pie)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                      {chartData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip /><Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="chart-container-box">
                <h3>Revenue vs Total Expenses (Bar)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={barChartData}>
                    <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Legend />
                    <Bar dataKey="Income" fill="#4caf50" /><Bar dataKey="Expenses" fill="#f44336" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* --- Work Wages Tab --- */}
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
              <button type="submit" className="add-btn">{isEditing ? "Update" : "Add Record"}</button>
            </form>
            
            <div className="search-container">
               <input type="text" className="search-input" placeholder="Search by name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>

            <div className="table-container">
              <table className="finance-table">
                <thead><tr><th>Date</th><th>Worker</th><th>Role</th><th>Hours</th><th>Rate</th><th>Total</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {wages.filter(w => w.workerName.toLowerCase().includes(searchTerm.toLowerCase())).map(w => (
                    <tr key={w._id}>
                      <td>{new Date(w.date).toLocaleDateString()}</td>
                      <td>{w.workerName}</td><td>{w.role}</td>
                      <td>{w.hoursWorked} h</td><td>Rs.{w.wageRate}</td><td>Rs.{w.total}</td>
                      <td><span className={`status ${w.status?.toLowerCase()}`}>{w.status}</span></td>
                      <td className="action-buttons">
                        <button className="btn-edit" onClick={() => startEdit(w, 'wages')}>Edit</button>
                        <button className="btn-delete" onClick={() => handleDelete('wages', w._id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- Transport Tab --- */}
        {activeTab === 'transport' && (
          <div className="tab-pane">
            <h2>Transport Costs</h2>
            <form className="finance-form" onSubmit={(e) => handleFormSubmit(e, 'transport')}>
              <input type="text" placeholder="Vehicle" value={transForm.vehicle} onChange={(e)=>setTransForm({...transForm, vehicle: e.target.value})} required />
              <input type="text" placeholder="Route" value={transForm.route} onChange={(e)=>setTransForm({...transForm, route: e.target.value})} required />
              <input type="number" placeholder="Fuel" value={transForm.fuelCost} onChange={(e)=>setTransForm({...transForm, fuelCost: e.target.value})} required />
              <input type="number" placeholder="Maint" value={transForm.maintenance} onChange={(e)=>setTransForm({...transForm, maintenance: e.target.value})} required />
              <button type="submit" className="add-btn">{isEditing ? "Update" : "Add Record"}</button>
            </form>

            <div className="search-container">
               <input type="text" className="search-input" placeholder="Search vehicle or route..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>

            <div className="table-container">
              <table className="finance-table">
                <thead><tr><th>Date</th><th>Vehicle</th><th>Route</th><th>Fuel</th><th>Maint.</th><th>Total</th><th>Actions</th></tr></thead>
                <tbody>
                  {transports.filter(t => t.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) || t.route.toLowerCase().includes(searchTerm.toLowerCase())).map(t => (
                    <tr key={t._id}>
                      <td>{new Date(t.date).toLocaleDateString()}</td><td>{t.vehicle}</td><td>{t.route}</td>
                      <td>Rs.{t.fuelCost}</td><td>Rs.{t.maintenance}</td><td>Rs.{t.total}</td>
                      <td className="action-buttons">
                        <button className="btn-edit" onClick={() => startEdit(t, 'transport')}>Edit</button>
                        <button className="btn-delete" onClick={() => handleDelete('transport', t._id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- Maintenance Tab --- */}
        {activeTab === 'maintenance' && (
          <div className="tab-pane">
            <h2>Maintenance Logs</h2>
            <form className="finance-form" onSubmit={(e) => handleFormSubmit(e, 'maintenance')}>
              <input type="text" placeholder="Equipment" value={maintForm.equipment} onChange={(e)=>setMaintForm({...maintForm, equipment: e.target.value})} required />
              <input type="text" placeholder="Issue" value={maintForm.issue} onChange={(e)=>setMaintForm({...maintForm, issue: e.target.value})} required />
              <input type="number" placeholder="Cost" value={maintForm.cost} onChange={(e)=>setMaintForm({...maintForm, cost: e.target.value})} required />
              <button type="submit" className="add-btn">{isEditing ? "Update" : "Add Record"}</button>
            </form>

            <div className="search-container">
               <input type="text" className="search-input" placeholder="Search equipment..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>

            <div className="table-container">
              <table className="finance-table">
                <thead><tr><th>Date</th><th>Equipment</th><th>Issue</th><th>Cost</th><th>Actions</th></tr></thead>
                <tbody>
                  {maintenances.filter(m => m.equipment.toLowerCase().includes(searchTerm.toLowerCase())).map(m => (
                    <tr key={m._id}>
                      <td>{new Date(m.date).toLocaleDateString()}</td><td>{m.equipment}</td><td>{m.issue}</td><td>Rs.{m.cost}</td>
                      <td className="action-buttons">
                        <button className="btn-edit" onClick={() => startEdit(m, 'maintenance')}>Edit</button>
                        <button className="btn-delete" onClick={() => handleDelete('maintenance', m._id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- Operational Tab --- */}
        {activeTab === 'operational' && (
          <div className="tab-pane">
            <h2>Operational Costs</h2>
            <form className="finance-form" onSubmit={(e) => handleFormSubmit(e, 'operational')}>
              <input type="text" placeholder="Description" value={opForm.description} onChange={(e)=>setOpForm({...opForm, description: e.target.value})} required />
              <select value={opForm.category} onChange={(e)=>setOpForm({...opForm, category: e.target.value})}>
                <option value="Raw Materials">Raw Materials</option><option value="Utilities">Utilities</option>
                <option value="Marketing">Marketing</option><option value="Others">Others</option>
              </select>
              <input type="number" placeholder="Amount" value={opForm.amount} onChange={(e)=>setOpForm({...opForm, amount: e.target.value})} required />
              <button type="submit" className="add-btn">{isEditing ? "Update" : "Add Record"}</button>
            </form>

            <div className="search-container">
               <input type="text" className="search-input" placeholder="Search description..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>

            <div className="table-container">
              <table className="finance-table">
                <thead><tr><th>Date</th><th>Description</th><th>Category</th><th>Amount</th><th>Actions</th></tr></thead>
                <tbody>
                  {operationals.filter(o => o.description.toLowerCase().includes(searchTerm.toLowerCase())).map(o => (
                    <tr key={o._id}>
                      <td>{new Date(o.date).toLocaleDateString()}</td><td>{o.description}</td><td>{o.category}</td><td>Rs.{o.amount}</td>
                      <td className="action-buttons">
                        <button className="btn-edit" onClick={() => startEdit(o, 'operational')}>Edit</button>
                        <button className="btn-delete" onClick={() => handleDelete('operational', o._id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpensesFinance;