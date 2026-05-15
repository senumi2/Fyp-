import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell,
    PieChart, Pie
} from 'recharts';
import './AdminExpensesFinance.css';
import { useAuth } from '../context/AuthContext'; // AuthContext එකෙන් logout ලබා ගැනීමට

const AdminExpensesFinance = () => {
  const [activeTab, setActiveTab] = useState('profit');
  const [searchTerm, setSearchTerm] = useState("");
  const { logout } = useAuth(); // Unauthorized වූ විට logout කිරීමට
  
  // Data States
  const [wages, setWages] = useState([]);
  const [transports, setTransports] = useState([]);
  const [maintenances, setMaintenances] = useState([]);
  const [operationals, setOperationals] = useState([]);
  const [finData, setFinData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedYear, setSelectedYear] = useState("2026");
  const [selectedMonth, setSelectedMonth] = useState("");

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  // Helper to get token from sessionStorage (as per your AuthContext)
  const getAuthToken = () => sessionStorage.getItem("token");

  const fetchAllData = async () => {
    const token = getAuthToken();
    if (!token) return;

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const [resW, resT, resM, resO] = await Promise.all([
        axios.get("http://localhost:5000/api/finance/wages", config),
        axios.get("http://localhost:5000/api/finance/transport", config),
        axios.get("http://localhost:5000/api/finance/maintenanceRepairLogs", config),
        axios.get("http://localhost:5000/api/operational-expenses/operational", config)
      ]);

      setWages(resW.data || []);
      setTransports(resT.data || []);
      setMaintenances(resM.data || []);
      setOperationals(resO.data || []);
    } catch (err) {
      console.error("Error fetching admin finance data", err);
      if (err.response?.status === 401) logout();
    }
  };

  const fetchFinancialStats = async () => {
    const token = getAuthToken();
    if (!token) return;

    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/analytics/financial-stats?year=${selectedYear}&month=${selectedMonth}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFinData(res.data);
    } catch (err) {
      console.error("Error fetching financial stats:", err);
      if (err.response?.status === 401) {
        logout(); // 401 ආ විට කෙලින්ම login පිටුවට යොමු කරයි
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    if (activeTab === 'profit') {
      fetchFinancialStats();
    }
  }, [activeTab, selectedYear, selectedMonth]);

  // Safe Calculations for Summary
  const calculateSummaries = () => {
    const defaultData = { income: 0, w: 0, t: 0, m: 0, o: 0, totalExp: 0, net: 0, pieData: [] };
    if (!finData) return defaultData;
    
    // API එකෙන් එන totalAmount එක භාවිතයට ගැනීම (Backend එකේ එලෙස පවතී)
    const sum = (arr) => arr?.reduce((acc, curr) => acc + (parseFloat(curr.totalAmount || curr.total || curr.amount || 0)), 0) || 0;
    
    const income = sum(finData.incomeStats);
    const w = sum(finData.wageStats);
    const t = sum(finData.transportStats);
    const m = sum(finData.maintenanceStats);
    const o = sum(finData.operationalStats);
    const totalExp = w + t + m + o;
    
    return { 
        income, w, t, m, o, totalExp, net: income - totalExp,
        pieData: [
            { name: 'Wages', value: w },
            { name: 'Transport', value: t },
            { name: 'Maintenance', value: m },
            { name: 'Operational', value: o }
        ].filter(item => item.value > 0) 
    };
  };

  const summary = calculateSummaries();

  return (
    <div className="admin-finance-wrapper">
      <div className="admin-finance-sidebar-icons">
        <h1>💲</h1>
        <button onClick={() => setActiveTab('profit')} className={activeTab === 'profit' ? 'icon-btn active' : 'icon-btn'} title="Financial Summary">📊</button>
        <button onClick={() => setActiveTab('wages')} className={activeTab === 'wages' ? 'icon-btn active' : 'icon-btn'} title="Wages View">👷‍♂️</button>
        <button onClick={() => setActiveTab('transport')} className={activeTab === 'transport' ? 'icon-btn active' : 'icon-btn'} title="Transport View">🚛</button>
        <button onClick={() => setActiveTab('maintenance')} className={activeTab === 'maintenance' ? 'icon-btn active' : 'icon-btn'} title="Maintenance View">🛠️</button>
        <button onClick={() => setActiveTab('operational')} className={activeTab === 'operational' ? 'icon-btn active' : 'icon-btn'} title="Operational Costs">🏢</button>
      </div>

      <div className="admin-finance-content">
        {/* PROFIT & LOSS VIEW */}
        {activeTab === 'profit' && (
          <div className="tab-pane">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 className="view-header">Profit & Loss Financial Report</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <select className="search-bar" style={{ marginBottom: 0, width: '120px' }} value={selectedYear} onChange={(e)=>setSelectedYear(e.target.value)}>
                        <option value="2025">2025</option>
                        <option value="2026">2026</option>
                    </select>
                    <select className="search-bar" style={{ marginBottom: 0, width: '150px' }} value={selectedMonth} onChange={(e)=>setSelectedMonth(e.target.value)}>
                        <option value="">Full Year</option>
                        {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((m, i) => (
                            <option key={i} value={i+1}>{m}</option>
                        ))}
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="loading-spinner">Loading financial data...</div>
            ) : (
                <>
                <div className="summary-cards">
                    <div className="card" style={{ borderLeft: '5px solid #10b981' }}>
                        <h3>Total Income</h3>
                        <p>Rs. {summary.income.toLocaleString()}</p>
                    </div>
                    <div className="card" style={{ borderLeft: '5px solid #ef4444' }}>
                        <h3>Total Expenses</h3>
                        <p>Rs. {summary.totalExp.toLocaleString()}</p>
                    </div>
                    <div className="card" style={{ borderLeft: `5px solid ${summary.net >= 0 ? '#3b82f6' : '#ef4444'}` }}>
                        <h3>Net {summary.net >= 0 ? 'Profit' : 'Loss'}</h3>
                        <p style={{ color: summary.net >= 0 ? '#10b981' : '#ef4444' }}>Rs. {summary.net.toLocaleString()}</p>
                    </div>
                </div>

                <div className="admin-charts-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '30px' }}>
                    <div className="card" style={{ minHeight: '450px', display: 'block' }}>
                        <h4>Expense Distribution</h4>
                        <div style={{ width: '100%', height: '350px', position: 'relative' }}>
                            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                <PieChart>
                                    <Pie 
                                        data={summary.pieData.length > 0 ? summary.pieData : [{name: 'No Data', value: 0.1}]} 
                                        dataKey="value" 
                                        nameKey="name" 
                                        cx="50%" 
                                        cy="50%" 
                                        outerRadius={100} 
                                        label
                                    >
                                        {summary.pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                        {summary.pieData.length === 0 && <Cell fill="#ccc" />}
                                    </Pie>
                                    <Tooltip formatter={(val) => `Rs. ${val.toLocaleString()}`} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="card" style={{ minHeight: '450px', display: 'block' }}>
                        <h4>Revenue vs Expense</h4>
                        <div style={{ width: '100%', height: '350px', position: 'relative' }}>
                            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                <BarChart data={[{ name: 'Financials', Income: summary.income, Expense: summary.totalExp }]}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip formatter={(val) => `Rs. ${val.toLocaleString()}`} />
                                    <Legend />
                                    <Bar dataKey="Income" fill="#10b981" radius={[5, 5, 0, 0]} />
                                    <Bar dataKey="Expense" fill="#ef4444" radius={[5, 5, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
                </>
            )}
          </div>
        )}

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
                  <tr><th>Date</th><th>Worker Name</th><th>Role</th><th>Hours</th><th>Rate</th><th>Total</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {wages.filter(w => w.workerName?.toLowerCase().includes(searchTerm.toLowerCase())).map(w => (
                    <tr key={w._id}>
                      <td>{new Date(w.date).toLocaleDateString()}</td>
                      <td>{w.workerName}</td><td>{w.role}</td><td>{w.hoursWorked}</td>
                      <td>{w.wageRate?.toLocaleString()}</td><td className="bold-text">{w.total?.toLocaleString()}</td>
                      <td><span className={`status-badge ${w.status?.toLowerCase()}`}>{w.status}</span></td>
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
                <input type="text" className="search-bar" placeholder="🔍 Search vehicle or route..." value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} />
            </div>
            <div className="table-container">
              <table className="admin-view-table">
                <thead><tr><th>Date</th><th>Vehicle</th><th>Route</th><th>Fuel</th><th>Maint.</th><th>Total</th></tr></thead>
                <tbody>
                  {transports.filter(t => t.vehicle?.toLowerCase().includes(searchTerm.toLowerCase()) || t.route?.toLowerCase().includes(searchTerm.toLowerCase())).map(t => (
                    <tr key={t._id}>
                      <td>{new Date(t.date).toLocaleDateString()}</td><td>{t.vehicle}</td><td>{t.route}</td>
                      <td>{t.fuelCost?.toLocaleString()}</td><td>{t.maintenance?.toLocaleString()}</td>
                      <td className="bold-text">{t.total?.toLocaleString()}</td>
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
            <h2 className="view-header">Maintenance Logs</h2>
            <div className="search-box">
                <input type="text" className="search-bar" placeholder="🔍 Search equipment..." value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} />
            </div>
            <div className="table-container">
              <table className="admin-view-table">
                <thead><tr><th>Date</th><th>Equipment</th><th>Issue</th><th>Cost</th><th>Status</th></tr></thead>
                <tbody>
                  {maintenances.filter(m => m.equipment?.toLowerCase().includes(searchTerm.toLowerCase())).map(m => (
                    <tr key={m._id}>
                      <td>{new Date(m.date).toLocaleDateString()}</td><td>{m.equipment}</td><td>{m.issue}</td>
                      <td className="bold-text">{Number(m.cost || 0).toLocaleString()}</td>
                      <td><span className={`status-badge ${m.status?.toLowerCase() || m.statuse?.toLowerCase()}`}>{m.status || m.statuse}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* OPERATIONAL VIEW */}
        {activeTab === 'operational' && (
          <div className="tab-pane">
            <h2 className="view-header">Operational Expenses</h2>
            <div className="search-box">
                <input type="text" className="search-bar" placeholder="🔍 Search description..." value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} />
            </div>
            <div className="table-container">
              <table className="admin-view-table">
                <thead><tr><th>Date</th><th>Description</th><th>Category</th><th>Amount</th></tr></thead>
                <tbody>
                  {operationals.filter(o => o.description?.toLowerCase().includes(searchTerm.toLowerCase())).map(o => (
                    <tr key={o._id}>
                      <td>{new Date(o.date).toLocaleDateString()}</td>
                      <td>{o.description}</td>
                      <td>{o.category}</td>
                      <td className="bold-text">Rs. {o.amount?.toLocaleString()}</td>
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

export default AdminExpensesFinance;