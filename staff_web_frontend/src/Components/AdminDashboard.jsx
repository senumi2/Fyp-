import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
    PieChart, Pie, Cell 
} from 'recharts';
import 'jspdf-autotable';
import './AdminDashboard.css';

// Components Imports
import AdminInventoryManagement from './AdminInventoryManagement'; 
import AdminHarvestManagement from './AdminHarvestManagement'; 
import AdminExpensesFinance from './AdminExpensesFinance';
import AdminEqupmentUsage from './AdminEqupmentUsage';
import AdminPondsManagement from './AdminPondsManagement';
import AdminPaymentHistory from '../Pages/AdminPaymentHistory';
import AdminProducts from '../Pages/AdminProducts';
import AdminDirectors from './AdminDirectors';
import AdminReports from '../Pages/AdminReports';
import AdminEvents from './AdminEvents';
import AdminStaffRegisterAccess from '../Pages/AdminStaffRegisterAccess';
import OrderManager from '../Pages/ManageOrders';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('ProductionVsSales');

    const renderContent = () => {
        switch (activeTab) {
            case 'ProductionVsSales': return <ProductionVsSalesView />;
            case 'AdminPondsManagement': return <AdminPondsManagement />;
            case 'AdminInventoryManagement': return <AdminInventoryManagement />;
            case 'AdminHarvestManagement': return <AdminHarvestManagement />;
            case 'AdminEqupmentUsage': return <AdminEqupmentUsage />;
            case 'AdminExpensesFinance': return <AdminExpensesFinance />;
            case 'ManageOrders': return <OrderManager />;
            case 'AdminPaymentHistory': return <AdminPaymentHistory />;
            case 'AdminProducts': return <AdminProducts />;
            case 'AdminDirectors': return <AdminDirectors />;
            case 'AdminReports': return <AdminReports />;
            case 'AdminEvents': return <AdminEvents />;
            case 'AdminStaffRegisterAccess': return <AdminStaffRegisterAccess/>;
            default: return <ProductionVsSalesView />;
        }
    };

    return (
        <div className="admin-container">
            <aside className="admin-sidebar">
                <div className="sidebar-header">ADMIN DASHBOARD</div>
                <nav className="sidebar-nav">
                    <button className={activeTab === 'ProductionVsSales' ? 'active' : ''} onClick={() => setActiveTab('ProductionVsSales')}>Production Vs Sales</button>
                    <button className={activeTab === 'ManageOrders' ? 'active' : ''} onClick={() => setActiveTab('ManageOrders')}>Manage Orders</button>
                    <button className={activeTab === 'AdminPondsManagement' ? 'active' : ''} onClick={() => setActiveTab('AdminPondsManagement')}>Ponds Management</button>
                    <button className={activeTab === 'AdminInventoryManagement' ? 'active' : ''} onClick={() => setActiveTab('AdminInventoryManagement')}>Inventory Management</button>
                    <button className={activeTab === 'AdminHarvestManagement' ? 'active' : ''} onClick={() => setActiveTab('AdminHarvestManagement')}>Harvest Management</button>
                    <button className={activeTab === 'AdminEqupmentUsage' ? 'active' : ''} onClick={() => setActiveTab('AdminEqupmentUsage')}>Equipment Usage</button>
                    <button className={activeTab === 'AdminExpensesFinance' ? 'active' : ''} onClick={() => setActiveTab('AdminExpensesFinance')}>Expenses & Finance</button>
                    <button className={activeTab === 'AdminStaffRegisterAccess' ? 'active' : ''} onClick={() => setActiveTab('AdminStaffRegisterAccess')}>Register Access</button>
                    <button className={activeTab === 'AdminEvents' ? 'active' : ''} onClick={() => setActiveTab('AdminEvents')}>Events</button>
                    <button className={activeTab === 'AdminReports' ? 'active' : ''} onClick={() => setActiveTab('AdminReports')}>Reports</button>
                    <button className={activeTab === 'AdminDirectors' ? 'active' : ''} onClick={() => setActiveTab('AdminDirectors')}>Directors</button>
                    <button className={activeTab === 'AdminProducts' ? 'active' : ''} onClick={() => setActiveTab('AdminProducts')}>Products</button>
                    <button className={activeTab === 'AdminPaymentHistory' ? 'active' : ''} onClick={() => setActiveTab('AdminPaymentHistory')}>Payment History</button>
                </nav>
            </aside>

            <main className="admin-main-content">
                {renderContent()}
            </main>
        </div>
    );
};

const ProductionVsSalesView = () => {
    const [originalChartData, setOriginalChartData] = useState([]);
    const [displayChartData, setDisplayChartData] = useState([]);
    const [expensePieData, setExpensePieData] = useState([]);
    const [rawFinancials, setRawFinancials] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState("All");
    const [loading, setLoading] = useState(true);

    const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    
    const processPieData = useCallback((data, monthLabel) => {
        if (!data) return;
        let w = 0, t = 0, m = 0, o = 0;

        if (monthLabel === "All") {
            w = (data.wageStats || []).reduce((a, b) => a + (Number(b.total) || 0), 0);
            t = (data.transportStats || []).reduce((a, b) => a + (Number(b.total) || 0), 0);
            m = (data.maintenanceStats || []).reduce((a, b) => a + (Number(b.cost) || 0), 0);
            o = (data.operationalStats || []).reduce((a, b) => a + (Number(b.amount) || 0), 0);
        } else {
            const mIdx = months.indexOf(monthLabel) + 1;
            w = data.wageStats?.find(s => Number(s._id) === mIdx)?.total || 0;
            t = data.transportStats?.find(s => Number(s._id) === mIdx)?.total || 0;
            m = data.maintenanceStats?.find(s => Number(s._id) === mIdx)?.cost || 0;
            o = data.operationalStats?.find(s => Number(s._id) === mIdx)?.amount || 0;
        }

        setExpensePieData([
            { name: "Wages", value: Number(w) },
            { name: "Transport", value: Number(t) },
            { name: "Maintenance", value: Number(m) },
            { name: "Operational", value: Number(o) }
        ]);
    }, [months]);

    useEffect(() => {
        const fetchAllStats = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error("No authorization token found");
                    setLoading(false);
                    return;
                }
                
                
                const config = { 
                    headers: { 
                        'Authorization': `Bearer ${token.trim()}`,
                        'Content-Type': 'application/json'
                    } 
                };

                const [resProd, resFin] = await Promise.all([
                    axios.get("http://localhost:5000/api/analytics/production-vs-sales?year=2026", config),
                    axios.get("http://localhost:5000/api/analytics/financial-stats?year=2026", config)
                ]);

                const sales = resProd.data.salesStats || [];
                const harvest = resProd.data.harvestStats || [];
                
                
                const formatted = months.map((m, index) => {
                    const mNum = index + 1;
                    const hEntry = harvest.find(h => Number(h._id) === mNum);
                    const sEntry = sales.find(s => Number(s._id) === mNum);

                    return {
                        name: m,
                        Harvest: hEntry ? Number(hEntry.totalHarvest) : 0,
                        Sales: sEntry ? Number(sEntry.totalQuantity) : 0
                    };
                });

                setOriginalChartData(formatted);
                setDisplayChartData(formatted); 
                setRawFinancials({ ...resFin.data, salesStats: sales });
                processPieData(resFin.data, "All");
                
                setLoading(false);
            } catch (err) {
                console.error("Dashboard error:", err.response?.data || err.message);
                setLoading(false);
            }
        };
        fetchAllStats();
    }, [processPieData]);

    const handleFilterChange = (e) => {
        const selected = e.target.value;
        setSelectedMonth(selected);
        
        if (selected === "All") {
            setDisplayChartData(originalChartData);
        } else {
            const filtered = originalChartData.filter(item => item.name === selected);
            setDisplayChartData(filtered);
        }

        processPieData(rawFinancials, selected);
    };

    if (loading) return <div className="admin-main-content"><p className="loading-text">Loading Analytics...</p></div>;

    return (
        <div className="admin-view-content">
            <h2 className="view-title">Production & Operational Analytics</h2>
            
            <div className="admin-charts-grid">
                <div className="admin-chart-card">
                    <div className="chart-header">
                        <h4 className="chart-label" style={{ margin: 0 }}>Harvest vs Sales (kg)</h4>
                        <select className="month-filter-dropdown" value={selectedMonth} onChange={handleFilterChange}>
                            <option value="All">Annual (All Months)</option>
                            {months.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </div>
                    <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={displayChartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="Harvest" stroke="#3b82f6" strokeWidth={3} name="Harvest (kg)" dot={{ r: 4 }} />
                                <Line type="monotone" dataKey="Sales" stroke="#10b981" strokeWidth={3} name="Sales (kg)" dot={{ r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="viewing-label">Showing: <strong>{selectedMonth === "All" ? "Full Year 2026" : selectedMonth}</strong></p>
                </div>

                <div className="admin-chart-card">
                    <h4 className="chart-label">Operational Cost Distribution</h4>
                    <div className="chart-wrapper" style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={expensePieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                    {expensePieData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip formatter={(value) => `LKR ${Number(value).toLocaleString()}`} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="viewing-label">Cost Breakdown for: <strong>{selectedMonth === "All" ? "Annual" : selectedMonth}</strong></p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;