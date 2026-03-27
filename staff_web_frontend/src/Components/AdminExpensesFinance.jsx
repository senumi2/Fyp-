import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell 
} from 'recharts';
import './AdminExpensesFinance.css';

const AdminExpensesFinance = ({ chartData, rawExpenseStats }) => {
  const [activeTab, setActiveTab] = useState('wages');
  const [searchTerm, setSearchTerm] = useState("");
  const [wages, setWages] = useState([]);
  const [transports, setTransports] = useState([]);
  const [maintenances, setMaintenances] = useState([]);

  const UNIT_PRICE = 50; 
  const COLORS = ["#3b82f6", "#10b981", "#f59e0b"];

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
    } catch (err) { console.error("Error fetching data", err); }
  };

  // Profit & Loss Logic
  const calculatePL = () => {
    const totalSalesQty = chartData?.reduce((acc, curr) => acc + (curr.Sales || 0), 0) || 0;
    const totalRev = totalSalesQty * UNIT_PRICE;
    const totalW = rawExpenseStats?.wageStats?.reduce((acc, curr) => acc + curr.total, 0) || 0;
    const totalT = rawExpenseStats?.transportStats?.reduce((acc, curr) => acc + curr.total, 0) || 0;
    const totalM = rawExpenseStats?.maintenanceStats?.reduce((acc, curr) => acc + curr.total, 0) || 0;
    const totalExp = totalW + totalT + totalM;
    
    return {
        totalRev, totalExp, profit: totalRev - totalExp,
        barData: [
            { name: 'Wages', amount: totalW },
            { name: 'Transport', amount: totalT },
            { name: 'Maintenance', amount: totalM }
        ]
    };
  };

  const plData = calculatePL();

  return (
    <div className="admin-finance-wrapper">
      <div className="admin-finance-sidebar-icons">
        <button onClick={() => setActiveTab('profit')} className={activeTab === 'profit' ? 'icon-btn active' : 'icon-btn'} title="Profit & Loss Summary">📊</button>
        <button onClick={() => setActiveTab('wages')} className={activeTab === 'wages' ? 'icon-btn active' : 'icon-btn'} title="Work Wages View">👷‍♂️</button>
        <button onClick={() => setActiveTab('transport')} className={activeTab === 'transport' ? 'icon-btn active' : 'icon-btn'} title="Transport Records">🚛</button>
        <button onClick={() => setActiveTab('maintenance')} className={activeTab === 'maintenance' ? 'icon-btn active' : 'icon-btn'} title="Maintenance Logs">🛠️</button>
      </div>

      <div className="admin-finance-content">
        {/* PROFIT & LOSS VIEW */}
        {activeTab === 'profit' && (
          <div className="tab-pane">
            <h2 className="view-header">Profit & Loss Financial Report (Annual)</h2>
            <div className="summary-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
                <div className="card" style={{ borderLeft: '5px solid #3b82f6' }}>
                    <h3>Gross Revenue</h3>
                    <p>Rs. {plData.totalRev.toLocaleString()}</p>
                </div>
                <div className="card" style={{ borderLeft: '5px solid #ef4444' }}>
                    <h3>Total Expenses</h3>
                    <p>Rs. {plData.totalExp.toLocaleString()}</p>
                </div>
                <div className="card" style={{ borderLeft: `5px solid ${plData.profit >= 0 ? '#10b981' : '#ef4444'}` }}>
                    <h3>Net Profit</h3>
                    <p style={{ color: plData.profit >= 0 ? '#10b981' : '#ef4444' }}>Rs. {plData.profit.toLocaleString()}</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px' }}>
                <div className="card" style={{ height: '350px' }}>
                    <h4>Expense Comparison</h4>
                    <ResponsiveContainer width="100%" height="90%">
                        <BarChart data={plData.barData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip formatter={(val) => `Rs. ${val.toLocaleString()}`} />
                            <Bar dataKey="amount" radius={[5, 5, 0, 0]}>
                                {plData.barData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index]} />)}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="card">
                    <h4>Detailed Breakdown</h4>
                    <table className="admin-view-table">
                        <tbody>
                            <tr><td>Operating Revenue</td><td align="right">{plData.totalRev.toLocaleString()}</td></tr>
                            <tr><td>Total Wages</td><td align="right" style={{ color: 'red' }}>- {plData.barData[0].amount.toLocaleString()}</td></tr>
                            <tr><td>Total Transport</td><td align="right" style={{ color: 'red' }}>- {plData.barData[1].amount.toLocaleString()}</td></tr>
                            <tr><td>Total Maintenance</td><td align="right" style={{ color: 'red' }}>- {plData.barData[2].amount.toLocaleString()}</td></tr>
                            <tr style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                <td>Net Profit</td>
                                <td align="right" style={{ color: plData.profit >= 0 ? 'green' : 'red' }}>{plData.profit.toLocaleString()}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
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
                      <td>{w.wageRate.toLocaleString()}</td><td className="bold-text">{w.total.toLocaleString()}</td>
                      <td><span className={`status-badge ${w.status.toLowerCase()}`}>{w.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TRANSPORT VIEW (කලින් තිබූ ආකාරයටම...) */}
        {activeTab === 'transport' && (
          <div className="tab-pane">
            <h2 className="view-header">Transport Cost Records</h2>
            <div className="table-container">
              <table className="admin-view-table">
                <thead><tr><th>Date</th><th>Vehicle</th><th>Route</th><th>Fuel</th><th>Maint.</th><th>Total</th></tr></thead>
                <tbody>
                  {transports.map(t => (
                    <tr key={t._id}>
                      <td>{new Date(t.date).toLocaleDateString()}</td><td>{t.vehicle}</td><td>{t.route}</td>
                      <td>{t.fuelCost.toLocaleString()}</td><td>{t.maintenance.toLocaleString()}</td>
                      <td className="bold-text">{t.total.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MAINTENANCE VIEW (කලින් තිබූ ආකාරයටම...) */}
        {activeTab === 'maintenance' && (
          <div className="tab-pane">
            <h2 className="view-header">Maintenance Logs</h2>
            <div className="table-container">
              <table className="admin-view-table">
                <thead><tr><th>Date</th><th>Equipment</th><th>Issue</th><th>Cost</th><th>Status</th></tr></thead>
                <tbody>
                  {maintenances.map(m => (
                    <tr key={m._id}>
                      <td>{new Date(m.date).toLocaleDateString()}</td><td>{m.equipment}</td><td>{m.issue}</td>
                      <td className="bold-text">{Number(m.cost).toLocaleString()}</td>
                      <td><span className={`status-badge ${m.statuse?.toLowerCase()}`}>{m.statuse}</span></td>
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