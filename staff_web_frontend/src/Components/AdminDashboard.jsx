import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
    PieChart, Pie, Cell 
} from 'recharts';
import './AdminDashboard.css';
import { useAuth } from '../context/AuthContext'; 
import { useNavigate } from 'react-router-dom';
import AnalyticsDashboard from './AnalyticsDashboard';

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
    const { isAdmin, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated || !isAdmin()) {
            navigate('/login');
        }
    }, [isAuthenticated, isAdmin, navigate]);

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

    if (!isAuthenticated || !isAdmin()) return null; 

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
    const { token, logout } = useAuth(); 

    const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const processPieData = useCallback((data, monthLabel) => {
        if (!data) return;
        let w = 0, t = 0, m = 0, o = 0;

        // Controller එකේ totalAmount field එක භාවිතා කර ඇත
        if (monthLabel === "All") {
            w = (data.wageStats || []).reduce((a, b) => a + (Number(b.totalAmount) || 0), 0);
            t = (data.transportStats || []).reduce((a, b) => a + (Number(b.totalAmount) || 0), 0);
            m = (data.maintenanceStats || []).reduce((a, b) => a + (Number(b.totalAmount) || 0), 0);
            o = (data.operationalStats || []).reduce((a, b) => a + (Number(b.totalAmount) || 0), 0);
        } else {
            const mIdx = months.indexOf(monthLabel) + 1;
            w = data.wageStats?.find(s => Number(s._id) === mIdx)?.totalAmount || 0;
            t = data.transportStats?.find(s => Number(s._id) === mIdx)?.totalAmount || 0;
            m = data.maintenanceStats?.find(s => Number(s._id) === mIdx)?.totalAmount || 0;
            o = data.operationalStats?.find(s => Number(s._id) === mIdx)?.totalAmount || 0;
        }

        const pieArray = [
            { name: "Wages", value: Number(w) },
            { name: "Transport", value: Number(t) },
            { name: "Maintenance", value: Number(m) },
            { name: "Operational", value: Number(o) }
        ].filter(item => item.value > 0);

        setExpensePieData(pieArray);
    }, [months]);



    return (
        <div className='AnalyticsDashboardWrapper'>

            <AnalyticsDashboard /> 
           
        </div>
    );
};

export default AdminDashboard;