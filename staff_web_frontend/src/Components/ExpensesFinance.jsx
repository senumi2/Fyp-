import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
    PieChart, Pie, Cell 
} from 'recharts';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
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

  // Analytics States (For Profit & Loss)
  const [chartData, setChartData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [rawExpenseStats, setRawExpenseStats] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Form States
  const [wageForm, setWageForm] = useState({ workerName: '', role: '', hoursWorked: '', wageRate: '', status: 'Pending' });
  const [transForm, setTransForm] = useState({ vehicle: '', route: '', fuelCost: '', maintenance: '' });
  const [maintForm, setMaintForm] = useState({ equipment: '', issue: '', cost: '', statuse: 'Pending' });

  useEffect(() => {
    fetchAllData();
    fetchAnalytics();
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

  // --- 📊 Analytics Logic (Added) ---
  const fetchAnalytics = async () => {
    setLoadingAnalytics(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const resProd = await axios.get("http://localhost:5000/api/analytics/production-vs-sales", config);
      const resFin = await axios.get("http://localhost:5000/api/analytics/financial-stats", config);

      const formattedProdData = months.map((month, index) => {
        const monthNum = index + 1;
        const sale = resProd.data.salesStats.find(s => s._id === monthNum);
        const harvest = resProd.data.harvestStats.find(h => h._id === monthNum);
        return {
          name: month,
          Sales: sale ? sale.totalQuantity : 0,
          Harvest: harvest ? harvest.totalHarvest : 0
        };
      });

      setChartData(formattedProdData);
      setRawExpenseStats({ ...resFin.data, salesStats: resProd.data.salesStats });
      updatePieChart(resFin.data, "All");
      setLoadingAnalytics(false);
    } catch (err) {
      console.error("Analytics fetch error:", err);
      setLoadingAnalytics(false);
    }
  };

  const updatePieChart = (data, monthLabel) => {
    let wagesTotal = 0, transportTotal = 0, maintenanceTotal = 0;
    if (monthLabel === "All") {
      wagesTotal = data.wageStats.reduce((acc, curr) => acc + (curr.total || 0), 0);
      transportTotal = data.transportStats.reduce((acc, curr) => acc + (curr.total || 0), 0);
      maintenanceTotal = data.maintenanceStats.reduce((acc, curr) => acc + (curr.total || 0), 0);
    } else {
      const monthNum = months.indexOf(monthLabel) + 1;
      wagesTotal = data.wageStats.find(s => s._id === monthNum)?.total || 0;
      transportTotal = data.transportStats.find(s => s._id === monthNum)?.total || 0;
      maintenanceTotal = data.maintenanceStats.find(s => s._id === monthNum)?.total || 0;
    }
    setExpenseData([
      { name: "Wages", value: wagesTotal },
      { name: "Transport", value: transportTotal },
      { name: "Maintenance", value: maintenanceTotal },
    ]);
  };

  const handleMonthChange = (e) => {
    const m = e.target.value;
    setSelectedMonth(m);
    if (rawExpenseStats) updatePieChart(rawExpenseStats, m);
  };

  // --- 📄 PDF Report Logic (Exactly like AdminDashboard) ---
  const handleDownloadReport = () => {
    const doc = new jsPDF();
    const dateStr = new Date().toLocaleDateString();
    const reportTitle = selectedMonth === "All" ? "Annual Financial Report - 2026" : `Monthly Financial Report - ${selectedMonth} 2026`;

    doc.setFontSize(22);
    doc.setTextColor(30, 41, 59);
    doc.text("SENUMI HIMANADHI SALTERNS", 14, 20);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${dateStr}`, 160, 28);
    doc.line(14, 32, 196, 32);

    doc.setFontSize(14);
    doc.setTextColor(51, 65, 85);
    doc.text(reportTitle, 14, 42);

    let tableData = [];
    let grandTotalRev = 0;
    let grandTotalExp = 0;

    const getDataForMonth = (mName) => {
      const mIdx = months.indexOf(mName) + 1;
      const dRow = chartData.find(d => d.name === mName) || { Harvest: 0, Sales: 0 };
      const sData = rawExpenseStats?.salesStats?.find(s => s._id === mIdx) || { totalSales: 0 };
      const w = rawExpenseStats.wageStats.find(s => s._id === mIdx)?.total || 0;
      const t = rawExpenseStats.transportStats.find(s => s._id === mIdx)?.total || 0;
      const m = rawExpenseStats.maintenanceStats.find(s => s._id === mIdx)?.total || 0;
      const totalExp = w + t + m;
      const rev = sData.totalSales;
      return { harvest: dRow.Harvest, salesKg: dRow.Sales, rev, exp: totalExp, profit: rev - totalExp };
    };

    if (selectedMonth === "All") {
      months.forEach(mName => {
        const s = getDataForMonth(mName);
        if (s.harvest > 0 || s.salesKg > 0 || s.exp > 0 || s.rev > 0) {
          tableData.push([mName, s.harvest, s.salesKg, s.rev.toLocaleString(), s.exp.toLocaleString(), s.profit.toLocaleString()]);
          grandTotalRev += s.rev; grandTotalExp += s.exp;
        }
      });
    } else {
      const s = getDataForMonth(selectedMonth);
      tableData.push([selectedMonth, s.harvest, s.salesKg, s.rev.toLocaleString(), s.exp.toLocaleString(), s.profit.toLocaleString()]);
      grandTotalRev = s.rev; grandTotalExp = s.exp;
    }

    doc.autoTable({
      startY: 50,
      head: [['Month', 'Harvest (kg)', 'Sales (kg)', 'Revenue (LKR)', 'Expenses (LKR)', 'Net Profit (LKR)']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [51, 65, 85], halign: 'center' },
      columnStyles: { 3: { halign: 'right' }, 4: { halign: 'right' }, 5: { halign: 'right', fontStyle: 'bold' } }
    });

    const finalY = doc.lastAutoTable.finalY + 15;
    doc.text(`Total Revenue: LKR ${grandTotalRev.toLocaleString()}`, 130, finalY);
    doc.text(`Total Expenses: LKR ${grandTotalExp.toLocaleString()}`, 130, finalY + 10);
    const netProfit = grandTotalRev - grandTotalExp;
    doc.setTextColor(netProfit >= 0 ? [22, 101, 52] : [185, 28, 28]);
    doc.text(`Net Profit: LKR ${netProfit.toLocaleString()}`, 130, finalY + 20);

    doc.save(`${reportTitle}.pdf`);
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
      fetchAnalytics(); // Update report after entry
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
        fetchAnalytics(); // Update report after delete
      } catch (err) {
        console.error("Delete error", err);
      }
    }
  };

  const resetForms = () => {
    setIsEditing(false);
    setCurrentId(null);
    setSearchTerm("");
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
              <input type="text" className="search-bar" placeholder="🔍 Search worker name..." value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} />
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
              <input type="text" className="search-bar" placeholder="🔍 Search by vehicle..." value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} />
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
              <input type="text" className="search-bar" placeholder="🔍 Search equipment or status..." value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} />
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
        
        {/* PROFIT TAB (UPDATED) */}
        {activeTab === 'profit' && (
          <div className="tab-pane">
            <h2>Profit & Lost Real-time Analytics</h2>
            
            {loadingAnalytics ? (
              <p>Loading reports...</p>
            ) : (
              <div className="finance-report-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="report-card" style={{ background: '#fff', padding: '20px', borderRadius: '8px' }}>
                  <h4>Annual Expenses vs Revenue</h4>
                  <div style={{ height: '300px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="Harvest" stroke="#3b82f6" name="Harvest (kg)" />
                        <Line type="monotone" dataKey="Sales" stroke="#10b981" name="Sales (kg)" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="report-card" style={{ background: '#fff', padding: '20px', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4>Expense Distribution</h4>
                    <select value={selectedMonth} onChange={handleMonthChange} style={{ padding: '5px' }}>
                      <option value="All">All Months</option>
                      {months.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div style={{ height: '250px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={expenseData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                          {expenseData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <button 
                    onClick={handleDownloadReport}
                    style={{ width: '100%', padding: '10px', background: '#2d3e37', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }}
                  >
                    📄 Download Financial Report
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default ExpensesFinance;