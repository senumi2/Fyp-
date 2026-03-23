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
            .catch(err => console.error("Error fetching tanks:", err));
    };

    useEffect(() => {
        fetchTanks();
    }, []);

    
    const handleInputChange = (tankId, field, value) => {
        setInputData(prev => ({
            ...prev,
            [tankId]: { ...prev[tankId], [field]: value }
        }));
    };

    
    const handleSalinitySave = (tankId) => {
        const data = inputData[tankId];
        if (!data || !data.level || !data.process) {
            alert("Please fill all fields for today's salinity record");
            return;
        }
        axios.post(`http://localhost:5000/api/tanks/${tankId}/salinity`, {
            level: data.level,
            process: data.process
        })
        .then(() => {
            alert("Salinity record saved/updated for today!");
            fetchTanks();
        })
        .catch(err => console.error(err));
    };

    
    const handleWeatherSave = (tankId) => {
        const status = inputData[tankId]?.weatherStatus;
        if (!status) {
            alert("Please enter weather status for today");
            return;
        }
        axios.post(`http://localhost:5000/api/tanks/${tankId}/weather`, { status })
        .then(() => {
            alert("Weather record updated for today!");
            fetchTanks();
        })
        .catch(err => console.error(err));
    };

    return (
        <div className="container">
            {/* Sidebar Navigation */}
            <div className="sidebar">
                <div className="sidebar-header">
                    <span className="menu-icon">☰</span>
                </div>
                <button className={`nav-btn ${activeTab === 'tank-details' ? 'active' : ''}`} onClick={() => setActiveTab('tank-details')}>Tank details</button>
                <button className={`nav-btn ${activeTab === 'salinity' ? 'active' : ''}`} onClick={() => setActiveTab('salinity')}>Saltinity</button>
                <button className={`nav-btn ${activeTab === 'weather-tracking' ? 'active' : ''}`} onClick={() => setActiveTab('weather-tracking')}>Weather Tracking</button>
                <button className={`nav-btn ${activeTab === 'weather-prediction' ? 'active' : ''}`} onClick={() => setActiveTab('weather-prediction')}>Weather Prediction</button>
            </div>

            <div className="main-content">
                
                {/*  Tank Details Section */}
                {activeTab === 'tank-details' && (
                    <div className="section-tank">
                        <h3>Tank Details</h3>
                        <table className="table-style">
                            <thead>
                                <tr>
                                    <th>Type</th>
                                    <th>Capacity</th>
                                    <th>Total No. of ponds</th>
                                    <th>Location</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tanks.map(tank => (
                                    <tr key={tank._id}>
                                        <td>{tank.type}</td>
                                        <td>{tank.capacity}</td>
                                        <td>{tank.totalPonds}</td>
                                        <td>{tank.location}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/*  Salinity Management Section */}
                {activeTab === 'salinity' && (
                    <div className="section-salinity">
                        <h3>Saltinity</h3>
                        {tanks.map((tank) => (
                            <div key={tank._id} className="management-block">
                                <p className="tank-label">{tank.type}</p>
                                <table className="table-style">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Saltinity</th>
                                            <th>Process</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* History Records */}
                                        {[...(tank.salinityRecords || [])].reverse().map((rec, i) => (
                                            <tr key={i}>
                                                <td>{new Date(rec.date).toLocaleDateString()}</td>
                                                <td>{rec.level}</td>
                                                <td>{rec.process}</td>
                                            </tr>
                                        ))}
                                        {/* Today Input Row */}
                                        <tr className="input-row">
                                            <td>{new Date().toLocaleDateString()}</td>
                                            <td>
                                                <input type="number" placeholder="Level" onChange={(e) => handleInputChange(tank._id, 'level', e.target.value)} />
                                            </td>
                                            <td>
                                                <input type="text" placeholder="Process" onChange={(e) => handleInputChange(tank._id, 'process', e.target.value)} />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className="btn-group">
                                    <button className="add-btn" onClick={() => handleSalinitySave(tank._id)}>Add</button>
                                    <button className="update-btn" onClick={() => handleSalinitySave(tank._id)}>Update</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/*  Weather Tracking Section */}
                {activeTab === 'weather-tracking' && (
                    <div className="section-weather">
                        <h3>Update Weather</h3>
                        {tanks.map((tank) => (
                            <div key={tank._id} className="management-block">
                                <p className="tank-label">{tank.type}</p>
                                <table className="table-style weather-table">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Weather</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[...(tank.weatherRecords || [])].reverse().map((w, i) => (
                                            <tr key={i}>
                                                <td>{new Date(w.date).toLocaleDateString()}</td>
                                                <td>{w.status}</td>
                                            </tr>
                                        ))}
                                        <tr className="input-row">
                                            <td>{new Date().toLocaleDateString()}</td>
                                            <td>
                                                <input type="text" placeholder="Weather" onChange={(e) => handleInputChange(tank._id, 'weatherStatus', e.target.value)} />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className="btn-group">
                                    <button className="add-btn" onClick={() => handleWeatherSave(tank._id)}>Add</button>
                                    <button className="update-btn" onClick={() => handleWeatherSave(tank._id)}>Update</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/*  Weather Prediction Section */}
                {activeTab === 'weather-prediction' && (
                    <div className="section-prediction">
                        <h3>Weather Prediction</h3>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PondsManagement;