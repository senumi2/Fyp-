import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PondsManagement.css';

const PondsManagement = () => {
    const [tanks, setTanks] = useState([]);
    const [activeTab, setActiveTab] = useState('tank-details');
    const [inputData, setInputData] = useState({});

    const fetchTanks = () => {
        axios.get('http://localhost:5000/api/tanks')
            .then(res => setTanks(res.data))
            .catch(err => console.error(err));
    };

    useEffect(() => { fetchTanks(); }, []);

    const handleInputChange = (tankId, field, value) => {
        setInputData(prev => ({
            ...prev,
            [tankId]: { ...prev[tankId], [field]: value }
        }));
    };

    const handleSalinitySave = (tankId) => {
        const data = inputData[tankId];
        if (!data?.level || !data?.process) return alert("Fill all fields");
        axios.post(`http://localhost:5000/api/tanks/${tankId}/salinity`, {
            level: data.level,
            process: data.process
        }).then(() => { alert("Updated!"); fetchTanks(); });
    };

    const handleMaintenanceSave = (tankId) => {
        const data = inputData[tankId];
        if (!data?.task || !data?.performedBy) return alert("Fill task and name");
        axios.post(`http://localhost:5000/api/tanks/${tankId}/maintenance`, {
            task: data.task,
            performedBy: data.performedBy,
            description: data.description || ""
        }).then(() => { alert("Maintenance Logged!"); fetchTanks(); });
    };

    return (
        <div className="container">
            <div className="sidebar">
                <div className="sidebar-header">☰ Saltern Pro</div>
                <button className={`nav-btn ${activeTab === 'tank-details' ? 'active' : ''}`} onClick={() => setActiveTab('tank-details')}>Tank Details</button>
                <button className={`nav-btn ${activeTab === 'salinity' ? 'active' : ''}`} onClick={() => setActiveTab('salinity')}>Salinity Tracking</button>
                <button className={`nav-btn ${activeTab === 'maintenance' ? 'active' : ''}`} onClick={() => setActiveTab('maintenance')}>Maintenance Logs</button>
                <button className={`nav-btn ${activeTab === 'weather' ? 'active' : ''}`} onClick={() => setActiveTab('weather')}>Weather</button>
            </div>

            <div className="main-content">
                {activeTab === 'tank-details' && (
                    <div className="section section-tank">
                        <h3>Tank Overview</h3>
                        <table className="table-style">
                            <thead><tr><th>Type</th><th>Capacity</th><th>Ponds</th><th>Current Be°</th></tr></thead>
                            <tbody>
                                {tanks.map(t => (
                                    <tr key={t._id}><td>{t.type}</td><td>{t.capacity}</td><td>{t.totalPonds}</td><td>{t.currentSalinity || 0} Be°</td></tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'salinity' && (
                    <div className="section section-salinity">
                        <h3>Salinity (Brine Flow Control)</h3>
                        {tanks.map(tank => (
                            <div key={tank._id} className="management-block">
                                <p className="tank-label">{tank.type} - {tank.location}</p>
                                <table className="table-style">
                                    <thead><tr><th>Date</th><th>Level (Be°)</th><th>Status</th></tr></thead>
                                    <tbody>
                                        {tank.salinityRecords.slice().reverse().map((r, i) => (
                                            <tr key={i}>
                                                <td>{new Date(r.date).toLocaleDateString()}</td>
                                                <td>{r.level}</td>
                                                <td><span className={`status-pill ${r.status.replace(/\s+/g, '-').toLowerCase()}`}>{r.status}</span></td>
                                            </tr>
                                        ))}
                                        <tr className="input-row">
                                            <td>Today</td>
                                            <td><input type="number" onChange={e => handleInputChange(tank._id, 'level', e.target.value)} /></td>
                                            <td><button className="add-btn" onClick={() => handleSalinitySave(tank._id)}>Save</button></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'maintenance' && (
                    <div className="section section-maintenance">
                        <h3>Maintenance Logs</h3>
                        {tanks.map(tank => (
                            <div key={tank._id} className="management-block">
                                <p className="tank-label">{tank.type} History</p>
                                <table className="table-style">
                                    <thead><tr><th>Date</th><th>Task</th><th>By</th></tr></thead>
                                    <tbody>
                                        {tank.maintenanceLogs?.map((l, i) => (
                                            <tr key={i}><td>{new Date(l.date).toLocaleDateString()}</td><td>{l.task}</td><td>{l.performedBy}</td></tr>
                                        ))}
                                        <tr className="input-row">
                                            <td><input placeholder="Task" onChange={e => handleInputChange(tank._id, 'task', e.target.value)} /></td>
                                            <td><input placeholder="Name" onChange={e => handleInputChange(tank._id, 'performedBy', e.target.value)} /></td>
                                            <td><button className="add-btn" onClick={() => handleMaintenanceSave(tank._id)}>Log</button></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PondsManagement;