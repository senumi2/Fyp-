import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './PondsManagement.css';

const PondsManagement = () => {
    const [tanks, setTanks] = useState([]);
    const [activeTab, setActiveTab] = useState('tank-details');
    const [inputData, setInputData] = useState({});
    
    // Search states for each tab
    const [dashSearch, setDashSearch] = useState("");
    const [brineSearch, setBrineSearch] = useState("");
    const [maintSearch, setMaintSearch] = useState("");

    const fetchTanks = () => {
        axios.get('http://localhost:5000/api/tanks')
            .then(res => setTanks(res.data))
            .catch(err => console.error(err));
    };

    useEffect(() => { fetchTanks(); }, []);

    // Helper: Check if a date is today
    const isToday = (someDate) => {
        const today = new Date();
        const d = new Date(someDate);
        return d.getDate() === today.getDate() &&
            d.getMonth() === today.getMonth() &&
            d.getFullYear() === today.getFullYear();
    };

    const handleInputChange = (tankId, field, value) => {
        setInputData(prev => ({
            ...prev,
            [tankId]: { ...prev[tankId], [field]: value }
        }));
    };

    // 1. Save New Salinity (Original Baumé Logic 24/28)
    const handleSalinitySave = (tankId) => {
        const data = inputData[tankId];
        if (!data?.level) return alert("Please enter Salinity level");
        axios.post(`http://localhost:5000/api/tanks/${tankId}/salinity`, {
            level: data.level,
            process: "Regular Monitoring"
        }).then(() => { 
            alert("Salinity Updated!"); 
            fetchTanks(); 
            setInputData(prev => ({...prev, [tankId]: {level: ''}}));
        });
    };

    // 2. Edit Today's Record Only
    const handleEditToday = (tankId, recordId) => {
        const newLevel = prompt("Enter the corrected Salinity level (Be°):");
        if (newLevel && !isNaN(newLevel)) {
            axios.put(`http://localhost:5000/api/tanks/${tankId}/salinity/${recordId}`, {
                level: Number(newLevel)
            }).then(() => {
                alert("Record Updated Successfully!");
                fetchTanks();
            }).catch(err => alert(err.response?.data?.message || "Error updating"));
        }
    };

    // 3. Delete Today's Record Only
    const handleDeleteToday = (tankId, recordId) => {
        if (window.confirm("Are you sure you want to delete today's record? This cannot be undone.")) {
            axios.delete(`http://localhost:5000/api/tanks/${tankId}/salinity/${recordId}`)
                .then(() => {
                    alert("Record Deleted.");
                    fetchTanks();
                })
                .catch(err => alert(err.response?.data?.message || "Error deleting"));
        }
    };

    const handleMaintenanceSave = (tankId) => {
        const data = inputData[tankId];
        if (!data?.task || !data?.startDate || !data?.endDate) return alert("Fill task and dates");
        axios.post(`http://localhost:5000/api/tanks/${tankId}/maintenance`, {
            task: data.task,
            startDate: data.startDate,
            endDate: data.endDate,
            description: data.description || ""
        }).then(() => { 
            alert("Maintenance Logged!"); 
            fetchTanks(); 
            setInputData(prev => ({...prev, [tankId]: {}}));
        });
    };

    // Unified Filter Logic
    const filterData = (list, query) => {
        return list.filter(t => 
            t.type.toLowerCase().includes(query.toLowerCase()) || 
            t.location.toLowerCase().includes(query.toLowerCase())
        );
    };

    // Empty State Component
    const EmptyResults = ({ onClear }) => (
        <div className="empty-state-container">
            <div className="empty-icon">🔍</div>
            <h4>No Tanks Found</h4>
            <p>We couldn't find any tanks matching your search. Try a different name or location.</p>
            <button className="clear-btn" onClick={onClear}>Clear Search</button>
        </div>
    );

    return (
        <div className="ponds-page-container">
            <aside className="ponds-sidebar">
                <div className="sidebar-brand">SALTPRO AI</div>
                <nav className="sidebar-nav">
                    <button className={`nav-item ${activeTab === 'tank-details' ? 'active' : ''}`} onClick={() => setActiveTab('tank-details')}>Dashboard Overview</button>
                    <button className={`nav-item ${activeTab === 'salinity' ? 'active' : ''}`} onClick={() => setActiveTab('salinity')}>Brine Control</button>
                    <button className={`nav-item ${activeTab === 'maintenance' ? 'active' : ''}`} onClick={() => setActiveTab('maintenance')}>Maintenance</button>
                    <button className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>AI Analytics</button>
                </nav>
            </aside>

            <main className="ponds-main-content">
                {/* 1. DASHBOARD OVERVIEW */}
                {activeTab === 'tank-details' && (
                    <div className="ponds-section">
                        <h3 className="section-title">Saltern Tank Overview</h3>
                        <div className="search-wrapper">
                            <input 
                                type="text" className="ponds-search-bar" 
                                placeholder="Search by Tank or Location..." 
                                value={dashSearch} onChange={(e) => setDashSearch(e.target.value)} 
                            />
                        </div>
                        
                        {filterData(tanks, dashSearch).length === 0 ? (
                            <EmptyResults onClear={() => setDashSearch("")} />
                        ) : (
                            <div className="ponds-tank-grid">
                                {filterData(tanks, dashSearch).map(t => (
                                    <div className="ponds-tank-card" key={t._id}>
                                        <div className="card-top">
                                            <span className="tank-name">{t.type}</span>
                                            <span className={`status-badge ${t.salinityRecords[t.salinityRecords.length - 1]?.status.toLowerCase().replace(/\s+/g, '-') || 'stable'}`}>
                                                {t.salinityRecords[t.salinityRecords.length - 1]?.status || 'Stable'}
                                            </span>
                                        </div>
                                        <p className="location-tag">📍 {t.location}</p>
                                        <div className="meter-container">
                                            <div className="meter-bar">
                                                <div className="meter-fill" style={{width: `${Math.min((t.currentSalinity / 30) * 100, 100)}%`}}></div>
                                            </div>
                                        </div>
                                        <div className="card-info-row">
                                            <span className="current-be">{t.currentSalinity || 0} Be°</span>
                                            <span className="capacity-tag">Cap: {t.capacity}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* 2. BRINE CONTROL */}
                {activeTab === 'salinity' && (
                    <div className="ponds-section">
                        <h3 className="section-title">Real-time Brine Tracking</h3>
                        <div className="search-wrapper">
                            <input 
                                type="text" className="ponds-search-bar" 
                                placeholder="Filter tanks..." 
                                value={brineSearch} onChange={(e) => setBrineSearch(e.target.value)} 
                            />
                        </div>

                        {filterData(tanks, brineSearch).length === 0 ? (
                            <EmptyResults onClear={() => setBrineSearch("")} />
                        ) : (
                            <div className="ponds-tank-grid">
                                {filterData(tanks, brineSearch).map(tank => (
                                    <div className="ponds-tank-card" key={tank._id}>
                                        <span className="tank-name">{tank.type} - {tank.location}</span>
                                        <div className="history-wrapper">
                                            <div className="table-scroll">
                                                <table className="ponds-mini-table">
                                                    <thead>
                                                        <tr><th>Date</th><th>Be°</th><th>Actions</th></tr>
                                                    </thead>
                                                    <tbody>
                                                        {tank.salinityRecords.slice().reverse().map((r, i) => (
                                                            <tr key={i}>
                                                                <td>{new Date(r.date).toLocaleDateString()}</td>
                                                                <td>{r.level}</td>
                                                                <td>
                                                                    {isToday(r.date) ? (
                                                                        <div className="action-btns">
                                                                            <button className="icon-btn edit" onClick={() => handleEditToday(tank._id, r._id)}>✏️</button>
                                                                            <button className="icon-btn delete" onClick={() => handleDeleteToday(tank._id, r._id)}>🗑️</button>
                                                                        </div>
                                                                    ) : (
                                                                        <span className="lock">🔒</span>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div className="ponds-input-group">
                                            <input type="number" placeholder="New Be°" value={inputData[tank._id]?.level || ''} onChange={e => handleInputChange(tank._id, 'level', e.target.value)} />
                                            <button className="ponds-add-btn" onClick={() => handleSalinitySave(tank._id)}>Add</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* 3. MAINTENANCE */}
                {activeTab === 'maintenance' && (
                    <div className="ponds-section">
                        <h3 className="section-title">Maintenance & Repairs</h3>
                        <div className="search-wrapper">
                            <input 
                                type="text" className="ponds-search-bar" 
                                placeholder="Search logs..." 
                                value={maintSearch} onChange={(e) => setMaintSearch(e.target.value)} 
                            />
                        </div>
                        {filterData(tanks, maintSearch).length === 0 ? (
                            <EmptyResults onClear={() => setMaintSearch("")} />
                        ) : (
                            <div className="ponds-tank-grid">
                                {filterData(tanks, maintSearch).map(tank => (
                                    <div className="ponds-tank-card" key={tank._id}>
                                        <span className="tank-name">{tank.type} Logs</span>
                                        <div className="table-scroll" style={{marginTop: '15px', height: '120px'}}>
                                            <table className="ponds-mini-table">
                                                <thead><tr><th>Task</th><th>Start</th><th>End</th></tr></thead>
                                                <tbody>
                                                    {tank.maintenanceLogs?.slice().reverse().map((l, i) => (
                                                        <tr key={i}><td>{l.task}</td><td>{l.startDate}</td><td>{l.endDate}</td></tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="ponds-maint-form">
                                            <input className="full-input" placeholder="Task Name" onChange={e => handleInputChange(tank._id, 'task', e.target.value)} />
                                            <div className="date-row">
                                                <input type="date" onChange={e => handleInputChange(tank._id, 'startDate', e.target.value)} />
                                                <input type="date" onChange={e => handleInputChange(tank._id, 'endDate', e.target.value)} />
                                            </div>
                                            <button className="ponds-add-btn" onClick={() => handleMaintenanceSave(tank._id)}>Save Log</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* 4. ANALYTICS */}
                {activeTab === 'analytics' && (
                    <div className="ponds-section">
                        <h3 className="section-title">Salinity Growth Analytics</h3>
                        <div className="ponds-chart-grid">
                            {tanks.length > 0 && tanks.slice(0, 4).map(tank => (
                                <div className="ponds-chart-card" key={tank._id}>
                                    <h4>{tank.type} Trend</h4>
                                    <ResponsiveContainer width="100%" height={220}>
                                        <LineChart data={tank.salinityRecords}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                            <XAxis dataKey="date" tick={{fontSize: 12}} tickFormatter={(str) => new Date(str).toLocaleDateString()} />
                                            <YAxis domain={[0, 35]} tick={{fontSize: 12}} />
                                            <Tooltip contentStyle={{borderRadius: '10px', border: 'none', boxShadow: '0 5px 15px rgba(0,0,0,0.1)'}} />
                                            <Line type="monotone" dataKey="level" stroke="#00A693" strokeWidth={3} dot={{fill: '#00A693', r: 4}} activeDot={{r: 6}} />
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

export default PondsManagement;