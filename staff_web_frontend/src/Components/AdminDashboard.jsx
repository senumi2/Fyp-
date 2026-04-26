import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
    PieChart, Pie, Cell 
} from 'recharts';
import jsPDF from 'jspdf';
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

// --- 📊 Production Vs Sales & Financial View (UPDATED) ---
const ProductionVsSalesView = () => {
    const [chartData, setChartData] = useState([]);
    const [expenseData, setExpenseData] = useState([]);
    const [rawExpenseStats, setRawExpenseStats] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState("All"); 
    const [loading, setLoading] = useState(true);

    const COLORS = ["#3b82f6", "#10b981", "#f59e0b"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };

                // 1. Production vs Sales Data
                const resProd = await axios.get("http://localhost:5000/api/analytics/production-vs-sales", config);
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

                // 2. Financial Stats Data
                const resFin = await axios.get("http://localhost:5000/api/analytics/financial-stats", config);
                
                // සැබෑ විකුණුම් මුදල (salesStats) Financial state එකට සම්බන්ධ කිරීම
                setRawExpenseStats({
                    ...resFin.data,
                    salesStats: resProd.data.salesStats
                });
                
                updatePieChart(resFin.data, "All");
                setLoading(false);
            } catch (err) {
                console.error("Analytics fetch error:", err);
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    const updatePieChart = (data, monthLabel) => {
        let wages = 0, transport = 0, maintenance = 0;
        if (monthLabel === "All") {
            wages = data.wageStats.reduce((acc, curr) => acc + (curr.total || 0), 0);
            transport = data.transportStats.reduce((acc, curr) => acc + (curr.total || 0), 0);
            maintenance = data.maintenanceStats.reduce((acc, curr) => acc + (curr.total || 0), 0);
        } else {
            const monthNum = months.indexOf(monthLabel) + 1;
            wages = data.wageStats.find(s => s._id === monthNum)?.total || 0;
            transport = data.transportStats.find(s => s._id === monthNum)?.total || 0;
            maintenance = data.maintenanceStats.find(s => s._id === monthNum)?.total || 0;
        }
        setExpenseData([
            { name: "Wages", value: wages },
            { name: "Transport", value: transport },
            { name: "Maintenance", value: maintenance },
        ]);
    };

    const handleMonthChange = (e) => {
        const m = e.target.value;
        setSelectedMonth(m);
        if (rawExpenseStats) updatePieChart(rawExpenseStats, m);
    };

    // --- 📄 Report Generation Logic (Using Actual Order.amount) ---
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
            
            // Backend එකෙන් එන සැබෑ විකුණුම් මුදල (Amount) ලබා ගැනීම
            const sData = rawExpenseStats?.salesStats?.find(s => s._id === mIdx) || { totalSales: 0 };
            
            const w = rawExpenseStats.wageStats.find(s => s._id === mIdx)?.total || 0;
            const t = rawExpenseStats.transportStats.find(s => s._id === mIdx)?.total || 0;
            const m = rawExpenseStats.maintenanceStats.find(s => s._id === mIdx)?.total || 0;
            
            const totalExp = w + t + m;
            const rev = sData.totalSales; // සැබෑ ආදායම (Order amount වල එකතුව)

            return { 
                harvest: dRow.Harvest, 
                salesKg: dRow.Sales, 
                rev: rev, 
                exp: totalExp, 
                profit: rev - totalExp 
            };
        };

        if (selectedMonth === "All") {
            months.forEach(mName => {
                const s = getDataForMonth(mName);
                if (s.harvest > 0 || s.salesKg > 0 || s.exp > 0 || s.rev > 0) {
                    tableData.push([
                        mName, 
                        s.harvest, 
                        s.salesKg, 
                        s.rev.toLocaleString(), 
                        s.exp.toLocaleString(), 
                        s.profit.toLocaleString()
                    ]);
                    grandTotalRev += s.rev;
                    grandTotalExp += s.exp;
                }
            });
        } else {
            const s = getDataForMonth(selectedMonth);
            tableData.push([
                selectedMonth, 
                s.harvest, 
                s.salesKg, 
                s.rev.toLocaleString(), 
                s.exp.toLocaleString(), 
                s.profit.toLocaleString()
            ]);
            grandTotalRev = s.rev;
            grandTotalExp = s.exp;
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
        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.text(`Total Revenue: LKR ${grandTotalRev.toLocaleString()}`, 130, finalY);
        doc.text(`Total Expenses: LKR ${grandTotalExp.toLocaleString()}`, 130, finalY + 10);
        
        const netProfit = grandTotalRev - grandTotalExp;
        doc.setTextColor(netProfit >= 0 ? [22, 101, 52] : [185, 28, 28]);
        doc.text(`Net Profit: LKR ${netProfit.toLocaleString()}`, 130, finalY + 20);

        doc.save(`${reportTitle}.pdf`);
    };

    if (loading) return <div className="admin-view-content"><p className="loading-text">Loading Real-time Analytics...</p></div>;

    return (
        <div className="admin-view-content">
            <h2 className="view-title">Production & Business Analytics</h2>
            
            <div className="admin-charts-grid">
                <div className="admin-chart-card">
                    <h4 className="chart-label">Annual Production vs Sales (kg)</h4>
                    <div style={{ height: '300px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="Harvest" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} name="Harvest" />
                                <Line type="monotone" dataKey="Sales" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} name="Sales" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="admin-chart-card">
                    <div className="chart-header">
                        <h4 className="chart-label" style={{ margin: 0 }}>Expense Distribution</h4>
                        <select className="month-filter-dropdown" value={selectedMonth} onChange={handleMonthChange}>
                            <option value="All">All Months</option>
                            {months.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </div>
                    <div style={{ height: '280px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={expenseData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%" cy="50%"
                                    outerRadius={80}
                                    label={({ name, percent }) => percent > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : ""}
                                >
                                    {expenseData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => `LKR ${value.toLocaleString()}`} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="viewing-label">Viewing: <strong>{selectedMonth === "All" ? "Yearly Summary" : selectedMonth}</strong></p>
                    <button className="manage-btn" style={{ marginTop: '20px', width: '100%', background: '#1e293b', color: 'white' }} onClick={handleDownloadReport}>
                        📄 Download {selectedMonth === "All" ? "Annual" : selectedMonth} Report
                    </button>
                </div>
            </div>

            <h3 className="view-title" style={{ fontSize: '1.4rem' }}>Product Trends</h3>
            <div className="admin-charts-grid">
                {['Salt', 'Jipsum', 'Agriculture Salt', 'Artemiya'].map(item => (
                    <div key={item} className="admin-chart-card">
                        <div className="graph-box-placeholder"><span>{item} Trend Analytics</span></div>
                        <p className="chart-label">{item}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};



export default AdminDashboard;