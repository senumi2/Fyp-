import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

// ඔබ සතු Components (Paths නිවැරදි බව පරීක්ෂා කරන්න)
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
    const [activeTab, setActiveTab] = useState('ProductionVsSales');

    const renderContent = () => {
        switch (activeTab) {
            case 'ProductionVsSales': return <ProductionVsSalesView />;
            case 'AdminPondsManagement': return <AdminPondsManagement />;
            case 'AdminInventoryManagement': return <AdminInventoryManagement />;
            case 'AdminHarvestManagement': return <AdminHarvestManagement />;
            case 'AdminEqupmentUsage': return <AdminEqupmentUsage />;
            case 'AdminExpensesFinance': return <AdminExpensesFinance />;
            
            // --- 🚀 අලුත් Order Management View එක ---
            case 'ManageOrders': return <AdminOrderManager />;
            
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
                    
                    {/* 🚀 Order Control සඳහා අලුත් Button එක */}
                    <button className={activeTab === 'ManageOrders' ? 'active' : ''} onClick={() => setActiveTab('ManageOrders')}>
                        Manage Orders
                    </button>

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

// --- 🚀 ඇත්තටම වැඩ කරන Order Manager Component එක ---
const AdminOrderManager = () => {
    const [orders, setOrders] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [status, setStatus] = useState("");
    const [assignedDriver, setAssignedDriver] = useState("");
    const [truckNumber, setTruckNumber] = useState("");

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const orderRes = await axios.get("http://localhost:5000/api/orders/all-orders-admin", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const driverRes = await axios.get("http://localhost:5000/api/auth/drivers", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(orderRes.data);
            setDrivers(driverRes.data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/orders/update-tracking/${selectedOrder._id}`, {
                status, assignedDriver, truckNumber
            }, { headers: { Authorization: `Bearer ${token}` } });
            
            alert("Order Updated Successfully!");
            setSelectedOrder(null);
            fetchData();
        } catch (err) { alert("Update failed"); }
    };

    return (
        <div className="admin-view-content">
            <h2 className="view-title">Order & Delivery Management</h2>
            <div className="table-container">
                <table className="admin-custom-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order._id}>
                                <td>#{order._id.slice(-6).toUpperCase()}</td>
                                <td>{order.userId?.fullName || 'N/A'}</td>
                                <td>LKR {order.amount?.toLocaleString()}</td>
                                <td><span className={`status-badge ${order.status.toLowerCase()}`}>{order.status}</span></td>
                                <td>
                                    <button className="manage-btn" onClick={() => {
                                        setSelectedOrder(order);
                                        setStatus(order.status);
                                        setAssignedDriver(order.assignedDriver || "");
                                        setTruckNumber(order.truckNumber || "");
                                    }}>Manage</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedOrder && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal-content">
                        <h3>Update Delivery Details</h3>
                        <form onSubmit={handleUpdate}>
                            <label>Order Status</label>
                            <select value={status} onChange={(e) => setStatus(e.target.value)}>
                                <option value="Pending">Pending</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                            </select>

                            <label>Assign Driver</label>
                            <select value={assignedDriver} onChange={(e) => setAssignedDriver(e.target.value)}>
                                <option value="">-- Choose Driver --</option>
                                {drivers.map(d => <option key={d._id} value={d._id}>{d.fullName}</option>)}
                            </select>

                            <label>Truck Number</label>
                            <input type="text" value={truckNumber} onChange={(e) => setTruckNumber(e.target.value)} placeholder="Ex: WP-ABC-1234" />

                            <div className="modal-actions">
                                <button type="submit" className="save-btn">Save Changes</button>
                                <button type="button" className="cancel-btn" onClick={() => setSelectedOrder(null)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
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
                        <span>Graph for {item}</span>
                    </div>
                    <p className="chart-label">{item}</p>
                </div>
            ))}
        </div>
    </div>
);

export default AdminDashboard;