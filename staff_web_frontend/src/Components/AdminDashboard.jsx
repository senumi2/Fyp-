import React, { useState } from 'react';
import './AdminDashboard.css';

// ඔබ සතු Components නිවැරදිව import කරගන්න (Paths පරීක්ෂා කරන්න)
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


const AdminDashboard = () => {
    // මුලින්ම පෙන්විය යුතු පේජ් එක ලෙස 'ProductionVsSales' තබා ඇත
    const [activeTab, setActiveTab] = useState('ProductionVsSales');

    // Tab එක අනුව අදාළ Component එක Return කරන logic එක
    const renderContent = () => {
        switch (activeTab) {
            case 'ProductionVsSales': 
                return <ProductionVsSalesView />;
            case 'AdminPondsManagement': 
                return <AdminPondsManagement />;
            case 'AdminInventoryManagement': 
                return <AdminInventoryManagement />;
            case 'AdminHarvestManagement': 
                return <AdminHarvestManagement />;
            case 'AdminEqupmentUsage': 
                return <AdminEqupmentUsage />;
            case 'AdminExpensesFinance': 
                return <AdminExpensesFinance />;
            case 'PendingOrders': 
                return <PendingOrdersView />;
            case 'AdminPaymentHistory': 
                return <AdminPaymentHistory />;
            case 'AdminProducts': 
                return <AdminProducts />;
            case 'AdminDirectors': 
                return <AdminDirectors />;
            case 'AdminReports': 
                return <AdminReports />;
            case 'AdminEvents': 
                return <AdminEvents />;
            case 'AdminStaffRegisterAccess': 
                return <AdminStaffRegisterAccess/>;
            default: 
                return <ProductionVsSalesView />;
        }
    };

    return (
        <div className="admin-container">
            {/* Sidebar Section */}
            <aside className="admin-sidebar">
                <div className="sidebar-header">ADMIN DASHBOARD</div>
                <nav className="sidebar-nav">
                    <button 
                        className={activeTab === 'ProductionVsSales' ? 'active' : ''} 
                        onClick={() => setActiveTab('ProductionVsSales')}>
                        Production Vs Sales
                    </button>
                    <button 
                        className={activeTab === 'AdminPondsManagement' ? 'active' : ''} 
                        onClick={() => setActiveTab('AdminPondsManagement')}>
                        Ponds Management
                    </button>
                    <button 
                        className={activeTab === 'AdminInventoryManagement' ? 'active' : ''} 
                        onClick={() => setActiveTab('AdminInventoryManagement')}>
                        Inventory Management
                    </button>
                    <button 
                        className={activeTab === 'AdminHarvestManagement' ? 'active' : ''} 
                        onClick={() => setActiveTab('AdminHarvestManagement')}>
                        Harvest Management
                    </button>
                    <button 
                        className={activeTab === 'AdminEqupmentUsage' ? 'active' : ''} 
                        onClick={() => setActiveTab('AdminEqupmentUsage')}>
                        Equipment Usage
                    </button>
                    <button 
                        className={activeTab === 'AdminExpensesFinance' ? 'active' : ''} 
                        onClick={() => setActiveTab('AdminExpensesFinance')}>
                        Expenses & Finance
                    </button>
                    <button 
                        className={activeTab === 'PendingOrders' ? 'active' : ''} 
                        onClick={() => setActiveTab('PendingOrders')}>
                        Pending Orders
                    </button>
                    <button 
                        className={activeTab === 'AdminStaffRegisterAccess' ? 'active' : ''} 
                        onClick={() => setActiveTab('AdminStaffRegisterAccess')}>
                        Register Access
                    </button>
                    <button 
                        className={activeTab === 'AdminEvents' ? 'active' : ''} 
                        onClick={() => setActiveTab('AdminEvents')}>
                        Events
                    </button>
                    <button 
                        className={activeTab === 'AdminReports' ? 'active' : ''} 
                        onClick={() => setActiveTab('AdminReports')}>
                        Reports
                    </button>
                    <button 
                        className={activeTab === 'AdminDirectors' ? 'active' : ''} 
                        onClick={() => setActiveTab('AdminDirectors')}>
                        Directors
                    </button>
                    <button 
                        className={activeTab === 'AdminProducts' ? 'active' : ''} 
                        onClick={() => setActiveTab('AdminProducts')}>
                        Products
                    </button>
                    <button 
                        className={activeTab === 'AdminPaymentHistory' ? 'active' : ''} 
                        onClick={() => setActiveTab('AdminPaymentHistory')}>
                        Payment History
                    </button>
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="admin-main-content">
                {renderContent()}
            </main>
        </div>
    );
};

// --- Production Vs Sales View Component ---
const ProductionVsSalesView = () => (
    <div className="admin-view-content">
        <h2 className="view-title">Production Vs Sales Analytics</h2>
        <div className="admin-charts-grid">
            {['Salt', 'Jipsum', 'Agriculture Salt', 'Artemiya'].map(item => (
                <div key={item} className="admin-chart-card">
                    <div className="graph-box-placeholder">
                        {/* පසුව මෙතනට Recharts LineChart එකක් ඇතුළත් කළ හැක */}
                        <span>Graph for {item}</span>
                    </div>
                    <p className="chart-label">{item}</p>
                </div>
            ))}
        </div>
    </div>
);

// --- Pending Orders View Component ---
const PendingOrdersView = () => (
    <div className="admin-view-content">
        <h2 className="view-title">New Pending Orders</h2>
        <div className="table-container">
            <table className="admin-custom-table">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Item</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>#ORD-8821</td>
                        <td>Southern Export Ltd</td>
                        <td>Industrial Salt</td>
                        <td><span className="status-badge pending">Pending</span></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
);

export default AdminDashboard;