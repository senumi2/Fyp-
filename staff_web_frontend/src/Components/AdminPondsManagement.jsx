import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './AdminPondsManagement.css';

const AdminPondsManagement = () => {
    
    const [tanks, setTanks] = useState([]);
    const [activeTab, setActiveTab] = useState('tank-details');
    const [formData, setFormData] = useState({ type: '', capacity: '', totalPonds: '', location: '' });
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const API_URL = 'http://localhost:5000/api/tanks';

    const fetchTanks = () => {
        axios.get(API_URL)
            .then(res => setTanks(res.data))
            .catch(err => console.error("Error fetching tanks:", err));
    };

    useEffect(() => {
        fetchTanks();
    }, []);

    const handleTankSubmit = (e) => {
        e.preventDefault();
        if (editingId) {
            axios.put(`${API_URL}/${editingId}`, formData).then(() => {
                alert("Tank updated!");
                resetForm();
                fetchTanks();
            });
        } else {
            axios.post(API_URL, formData).then(() => {
                alert("Tank added!");
                resetForm();
                fetchTanks();
            });
        }
    };

    const handleEdit = (tank) => {
        setEditingId(tank._id);
        setFormData({ type: tank.type, capacity: tank.capacity, totalPonds: tank.totalPonds, location: tank.location });
        setActiveTab('tank-details');
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete?")) {
            axios.delete(`${API_URL}/${id}`)
                .then(() => {
                    setTanks(tanks.filter(tank => tank._id !== id));
                    alert("Tank deleted successfully!");
                })
                .catch(err => {
                    console.error("Delete error:", err);
                    alert("Failed to delete the tank.");
                });
        }
    };

    const resetForm = () => {
        setFormData({ type: '', capacity: '', totalPonds: '', location: '' });
        setEditingId(null);
    };

    const filteredTanks = tanks.filter(t => 
        t.type.toLowerCase().includes(searchTerm.toLowerCase()) || 
        t.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="ponds-page-container">
            {/* 1. Mini Sidebar */}
            <aside className="ponds-mini-sidebar">
                <div className="sidebar-logo-area">
                    <div className="mini-logo-circle">
                        <span role="img" aria-label="salt-logo">🧂</span>
                    </div>
                </div>

                <div className="mini-sidebar-content">
                    <button className={`mini-nav-btn ${activeTab === 'tank-details' ? 'active' : ''}`} onClick={() => setActiveTab('tank-details')}>
                        <span className="mini-icon">💧</span>
                        <div className="mini-tooltip">Tank Management</div>
                    </button>
                    
                    <button className={`mini-nav-btn ${activeTab === 'salinity' ? 'active' : ''}`} onClick={() => setActiveTab('salinity')}>
                        <span className="mini-icon">📅</span>
                        <div className="mini-tooltip">Brine Logs</div>
                    </button>

                    <button className={`mini-nav-btn ${activeTab === 'maintenance' ? 'active' : ''}`} onClick={() => setActiveTab('maintenance')}>
                        <span className="mini-icon">🛠️</span>
                        <div className="mini-tooltip">Maintenance</div>
                    </button>

                    <div className="mini-divider"></div>

                    <button className={`mini-nav-btn ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>
                        <span className="mini-icon">📈</span>
                        <div className="mini-tooltip">Analytics Trends</div>
                    </button>
                </div>
            </aside>

            {/* 2. Main Content Area */}
            <main className="ponds-content-area">
                <header className="ponds-content-header">
                    <div className="header-text">
                        <h2>{activeTab.replace('-', ' ').toUpperCase()}</h2>
                        <p>National Salt Limited - Hambantota Saltern Management</p>
                    </div>
                    <input 
                        type="text" 
                        className="ponds-search-bar" 
                        placeholder="Filter database..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </header>

                <div className="ponds-scroll-body">
                    {/* Tank Management Tab */}
                    {activeTab === 'tank-details' && (
                        <div className="fade-in">
                            <form onSubmit={handleTankSubmit} className="ponds-glass-form">
                                <input type="text" placeholder="Tank Type" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} required />
                                <input type="text" placeholder="Capacity" value={formData.capacity} onChange={(e) => setFormData({...formData, capacity: e.target.value})} required />
                                <input type="number" placeholder="Total Ponds" value={formData.totalPonds} onChange={(e) => setFormData({...formData, totalPonds: e.target.value})} required />
                                <input type="text" placeholder="Location" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} required />
                                <button type="submit" className="ponds-primary-btn">{editingId ? "Update Tank" : "Register Tank"}</button>
                            </form>

                            <div className="ponds-table-card">
                                <table className="ponds-modern-table">
                                    <thead>
                                        <tr><th>TANK TYPE</th><th>CAPACITY</th><th>LOCATION</th><th>CONTROLS</th></tr>
                                    </thead>
                                    <tbody>
                                        {filteredTanks.map(tank => (
                                            <tr key={tank._id}>
                                                <td><strong>{tank.type}</strong></td>
                                                <td>{tank.capacity}</td>
                                                <td>{tank.location}</td>
                                                <td>
                                                    <button onClick={() => handleEdit(tank)} className="btn-edit">Edit</button>
                                                    <button onClick={() => handleDelete(tank._id)} className="btn-delete">Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Brine Logs Tab  */}
                    {activeTab === 'salinity' && (
                        <div className="view-grid-layout fade-in">
                            {filteredTanks.map(tank => (
                                <div key={tank._id} className="data-card scrollable-card">
                                    <h4 className="card-title">{tank.type} - {tank.location}</h4>
                                    <div className="table-scroll-container">
                                        <table className="ponds-modern-table mini">
                                            <thead><tr><th>DATE</th><th>SALINITY (Be°)</th></tr></thead>
                                            <tbody>
                                                {tank.salinityRecords?.map((rec, i) => (
                                                    <tr key={i}><td>{new Date(rec.date).toLocaleDateString()}</td><td className="text-highlighted">{rec.level} Be°</td></tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Maintenance Tab  */}
                    {activeTab === 'maintenance' && (
                        <div className="view-grid-layout fade-in">
                            {filteredTanks.map(tank => (
                                <div key={tank._id} className="data-card scrollable-card">
                                    <h4 className="card-title">{tank.type} Maintenance</h4>
                                    <div className="table-scroll-container">
                                        <table className="ponds-modern-table mini">
                                            <thead><tr><th>TASK</th><th>START DATE</th><th>STATUS</th></tr></thead>
                                            <tbody>
                                                {tank.maintenanceLogs?.map((log, i) => (
                                                    <tr key={i}>
                                                        <td>{log.task}</td>
                                                        <td>{log.startDate}</td>
                                                        <td>
                                                            <span className={`badge ${log.endDate === "Pending" ? "pending" : "completed"}`}>
                                                                {log.endDate === "Pending" ? "Processing" : "Completed"}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    {/* Analytics Tab  */}
                    {activeTab === 'analytics' && (
                        <div className="analytics-grid-layout fade-in">
                            {filteredTanks.map(tank => (
                                <div className="chart-card" key={tank._id}>
                                    <h4>{tank.type} Concentration Trend</h4>
                                    <ResponsiveContainer width="100%" height={250}>
                                        <LineChart data={tank.salinityRecords}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                            <XAxis dataKey="date" hide />
                                            <YAxis />
                                            <Tooltip />
                                            <Line type="monotone" dataKey="level" stroke="#008080" strokeWidth={3} dot={{ r: 4, fill: '#008080' }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminPondsManagement;