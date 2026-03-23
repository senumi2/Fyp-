import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPondsManagement.css';

const AdminPondsManagement = () => {
    const [tanks, setTanks] = useState([]);
    const [activeTab, setActiveTab] = useState('tank-details');
    const [formData, setFormData] = useState({ type: '', capacity: '', totalPonds: '', location: '' });
    const [editingId, setEditingId] = useState(null);

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
    };

    const handleDelete = (id) => {
        if (window.confirm("Delete this tank?")) {
            axios.delete(`${API_URL}/${id}`).then(() => fetchTanks());
        }
    };

    const resetForm = () => {
        setFormData({ type: '', capacity: '', totalPonds: '', location: '' });
        setEditingId(null);
    };

    return (
        <div className="ponds-admin-wrapper">
            <aside className="ponds-sidebar">
                <div className="ponds-sidebar-header">☰</div>
                <nav className="ponds-nav-list">
                    <button className={`ponds-nav-btn ${activeTab === 'tank-details' ? 'active' : ''}`} onClick={() => setActiveTab('tank-details')}>
                        <span className="ponds-icon">💧</span>
                        <span className="ponds-tooltip">Tank Details</span>
                    </button>
                    <button className={`ponds-nav-btn ${activeTab === 'salinity' ? 'active' : ''}`} onClick={() => setActiveTab('salinity')}>
                        <span className="ponds-icon">🧂</span>
                        <span className="ponds-tooltip">Salinity</span>
                    </button>
                    <button className={`ponds-nav-btn ${activeTab === 'weather-tracking' ? 'active' : ''}`} onClick={() => setActiveTab('weather-tracking')}>
                        <span className="ponds-icon">☁️</span>
                        <span className="ponds-tooltip">Weather Tracking</span>
                    </button>
                    <button className={`ponds-nav-btn ${activeTab === 'weather-prediction' ? 'active' : ''}`} onClick={() => setActiveTab('weather-prediction')}>
                        <span className="ponds-icon">🔮</span>
                        <span className="ponds-tooltip">Weather Prediction</span>
                    </button>
                </nav>
            </aside>

            <main className="ponds-main-content">
                {activeTab === 'tank-details' && (
                    <div className="ponds-section-tank">
                        <h3>{editingId ? "Edit Tank" : "Add New Tank"}</h3>
                        <form onSubmit={handleTankSubmit} className="ponds-tank-form">
                            <input type="text" placeholder="Type" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} required />
                            <input type="text" placeholder="Capacity" value={formData.capacity} onChange={(e) => setFormData({...formData, capacity: e.target.value})} required />
                            <input type="number" placeholder="Total Ponds" value={formData.totalPonds} onChange={(e) => setFormData({...formData, totalPonds: e.target.value})} required />
                            <input type="text" placeholder="Location" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} required />
                            <button type="submit" className="ponds-add-btn">{editingId ? "Update" : "Add Tank"}</button>
                            {editingId && <button type="button" onClick={resetForm} className="ponds-cancel-btn">Cancel</button>}
                        </form>

                        <table className="ponds-table-style">
                            <thead>
                                <tr><th>Type</th><th>Capacity</th><th>Ponds</th><th>Location</th><th>Actions</th></tr>
                            </thead>
                            <tbody>
                                {tanks.map(tank => (
                                    <tr key={tank._id}>
                                        <td>{tank.type}</td>
                                        <td>{tank.capacity}</td>
                                        <td>{tank.totalPonds}</td>
                                        <td>{tank.location}</td>
                                        <td>
                                            <button onClick={() => handleEdit(tank)} className="ponds-edit-mini">Edit</button>
                                            <button onClick={() => handleDelete(tank._id)} className="ponds-delete-mini">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'salinity' && (
                    <div className="ponds-section-salinity">
                        <h3>Salinity History (View Only)</h3>
                        {tanks.map((tank) => (
                            <div key={tank._id} className="ponds-management-block">
                                <p className="ponds-tank-label">{tank.type}</p>
                                <table className="ponds-table-style">
                                    <thead><tr><th>Date</th><th>Salinity Level</th><th>Process</th></tr></thead>
                                    <tbody>
                                        {tank.salinityRecords?.map((rec, i) => (
                                            <tr key={i}>
                                                <td>{new Date(rec.date).toLocaleDateString()}</td>
                                                <td>{rec.level}</td>
                                                <td>{rec.process}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'weather-prediction' && (
                    <div className="ponds-section-prediction">
                        <h3>Weather Prediction (View Only)</h3>
                        <div className="ponds-view-info">
                            <p>Upcoming weather predictions based on sensor data will appear here.</p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminPondsManagement;