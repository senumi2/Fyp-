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
        if (window.confirm("Are you sure you want to delete this tank and all its history?")) {
            axios.delete(`${API_URL}/${id}`).then(() => fetchTanks());
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
        <div className="ponds-admin-wrapper">
            <aside className="ponds-sidebar">
                <div className="ponds-sidebar-header">☰</div>
                <nav className="ponds-nav-list">
                    <button className={`ponds-nav-btn ${activeTab === 'tank-details' ? 'active' : ''}`} onClick={() => setActiveTab('tank-details')}>
                        <span className="ponds-icon">💧</span>
                        <span className="ponds-tooltip">Tank Management</span>
                    </button>
                    <button className={`ponds-nav-btn ${activeTab === 'salinity' ? 'active' : ''}`} onClick={() => setActiveTab('salinity')}>
                        <span className="ponds-icon">🧂</span>
                        <span className="ponds-tooltip">Brine Logs</span>
                    </button>
                    <button className={`ponds-nav-btn ${activeTab === 'maintenance' ? 'active' : ''}`} onClick={() => setActiveTab('maintenance')}>
                        <span className="ponds-icon">🛠️</span>
                        <span className="ponds-tooltip">Maintenance</span>
                    </button>
                    <button className={`ponds-nav-btn ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>
                        <span className="ponds-icon">📊</span>
                        <span className="ponds-tooltip">AI Analytics</span>
                    </button>
                </nav>
            </aside>

            <main className="ponds-main-content">
                <div className="admin-header-flex">
                    <h3>
                        {activeTab === 'tank-details' && (editingId ? "Update Existing Tank" : "Register New Saltern Tank")}
                        {activeTab === 'salinity' && "Historical Brine Data"}
                        {activeTab === 'maintenance' && "Maintenance Logs"}
                        {activeTab === 'analytics' && "Growth Trends (Real-time AI)"}
                        {activeTab !== 'tank-details' && <span className="view-badge">View Only</span>}
                    </h3>
                    <input 
                        type="text" className="admin-search" 
                        placeholder="Search by name/location..." 
                        value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {activeTab === 'tank-details' && (
                    <div className="ponds-section-tank">
                        <form onSubmit={handleTankSubmit} className="ponds-tank-form">
                            <input type="text" placeholder="Tank Type" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} required />
                            <input type="text" placeholder="Capacity" value={formData.capacity} onChange={(e) => setFormData({...formData, capacity: e.target.value})} required />
                            <input type="number" placeholder="Total Ponds" value={formData.totalPonds} onChange={(e) => setFormData({...formData, totalPonds: e.target.value})} required />
                            <input type="text" placeholder="Location" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} required />
                            <button type="submit" className="ponds-add-btn">{editingId ? "Update Tank" : "Register Tank"}</button>
                            {editingId && <button type="button" onClick={resetForm} className="ponds-cancel-btn">Cancel</button>}
                        </form>

                        {filteredTanks.length === 0 ? (
                            <div className="admin-empty-state">No tanks found. Please add or adjust search.</div>
                        ) : (
                            <table className="ponds-table-style">
                                <thead>
                                    <tr><th>Type</th><th>Capacity</th><th>Ponds</th><th>Location</th><th>Current Be°</th><th>Actions</th></tr>
                                </thead>
                                <tbody>
                                    {filteredTanks.map(tank => (
                                        <tr key={tank._id}>
                                            <td><strong>{tank.type}</strong></td>
                                            <td>{tank.capacity}</td>
                                            <td>{tank.totalPonds}</td>
                                            <td>{tank.location}</td>
                                            <td>{tank.currentSalinity || 0} Be°</td>
                                            <td>
                                                <button onClick={() => handleEdit(tank)} className="ponds-edit-mini">Edit</button>
                                                <button onClick={() => handleDelete(tank._id)} className="ponds-delete-mini">Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                {activeTab === 'salinity' && (
                    <div className="ponds-section-salinity">
                        <div className="admin-view-grid">
                            {filteredTanks.map((tank) => (
                                <div key={tank._id} className="view-block">
                                    <div className="block-header">{tank.type} - {tank.location}</div>
                                    <div className="scroll-table-wrapper">
                                        <table className="ponds-table-style mini">
                                            <thead><tr><th>Date</th><th>Be°</th><th>Status</th></tr></thead>
                                            <tbody>
                                                {tank.salinityRecords?.slice().reverse().map((rec, i) => (
                                                    <tr key={i}>
                                                        <td>{new Date(rec.date).toLocaleDateString()}</td>
                                                        <td>{rec.level}</td>
                                                        <td><span className={`status-text ${rec.status?.toLowerCase().replace(/\s/g, '-')}`}>{rec.status}</span></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'maintenance' && (
                    <div className="ponds-section-salinity">
                        <div className="admin-view-grid">
                            {filteredTanks.map((tank) => (
                                <div key={tank._id} className="view-block">
                                    <div className="block-header">{tank.type} Maintenance</div>
                                    <div className="scroll-table-wrapper">
                                        <table className="ponds-table-style mini">
                                            <thead><tr><th>Task</th><th>Start</th><th>End</th></tr></thead>
                                            <tbody>
                                                {tank.maintenanceLogs?.slice().reverse().map((log, i) => (
                                                    <tr key={i}>
                                                        <td>{log.task}</td>
                                                        <td>{log.startDate}</td>
                                                        <td>{log.endDate}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'analytics' && (
                    <div className="ponds-section-prediction">
                        <div className="admin-chart-grid">
                            {filteredTanks.map(tank => (
                                <div className="chart-wrapper-admin" key={tank._id}>
                                    <h4>{tank.type} Salinity Curve</h4>
                                    <ResponsiveContainer width="100%" height={200}>
                                        <LineChart data={tank.salinityRecords}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                                            <XAxis dataKey="date" tickFormatter={(d) => new Date(d).toLocaleDateString()} hide />
                                            <YAxis />
                                            <Tooltip />
                                            <Line type="monotone" dataKey="level" stroke="#2563eb" strokeWidth={2} dot={false} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminPondsManagement;