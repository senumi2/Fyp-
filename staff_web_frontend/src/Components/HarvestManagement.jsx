import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './HarvestManagement.css';

const HarvestManagement = () => {
    const [harvestData, setHarvestData] = useState([]);
    const [activeTab, setActiveTab] = useState('management');
    const [inputs, setInputs] = useState({});

    const categories = ['Salt Harvest', 'Jipsum Harvest', 'Artimiya Harvest', 'Agriculture Salt Harvest'];

    
    const fetchHarvests = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/harvest');
            setHarvestData(res.data);
        } catch (err) {
            console.error("Data fetching error:", err);
        }
    };

    useEffect(() => {
        fetchHarvests();
    }, []);

    const handleInput = (cat, field, val) => {
        setInputs({ ...inputs, [cat]: { ...inputs[cat], [field]: val } });
    };

    const handleAdd = async (cat) => {
        const data = inputs[cat];
        if (!data?.type || !data?.quantity) return alert("fill the form.");
        
        try {
            const response = await axios.post('http://localhost:5000/api/harvest/add', {
                category: cat,
                type: data.type,
                quantity: data.quantity
            });
            
            
            setHarvestData(response.data);
            alert("Record Added Successfully!");
            
            
            setInputs({ ...inputs, [cat]: { type: '', quantity: '' } });
        } catch (err) {
            alert("Error adding record");
        }
    };

    const getChartData = (cat) => {
        const found = harvestData.find(h => h.category === cat);
        return found ? found.records.map(r => ({ 
            date: new Date(r.date).toLocaleDateString(), 
            qty: r.quantity 
        })) : [];
    };

    return (
        <div className="harvest-container">
            <div className="sidebar">
                <div className="sidebar-header">☰</div>
                <button className={`nav-btn ${activeTab === 'management' ? 'active' : ''}`} onClick={() => setActiveTab('management')}>Management</button>
                <button className={`nav-btn ${activeTab === 'tracking' ? 'active' : ''}`} onClick={() => setActiveTab('tracking')}>Harvest Tracking</button>
                <button className={`nav-btn ${activeTab === 'prediction' ? 'active' : ''}`} onClick={() => setActiveTab('prediction')}>Harvest Prediction</button>
            </div>

            <div className="main-content">
                {activeTab === 'management' && (
                    <div className="section management-bg">
                        <h3>Harvest Management</h3>
                        {categories.map(cat => (
                            <div key={cat} className="harvest-block">
                                <p className="cat-title">{cat}</p>
                                <table className="harvest-table">
                                    <thead>
                                        <tr><th>NO.</th><th>Date</th><th>Type</th><th>Quantity</th></tr>
                                    </thead>
                                    <tbody>
                                       
                                        {harvestData.find(h => h.category === cat)?.records.slice().reverse().map((r, i, arr) => (
                                            <tr key={i}>
                                                <td>{arr.length - i}</td>
                                                <td>{new Date(r.date).toLocaleDateString()}</td>
                                                <td>{r.type}</td>
                                                <td>{r.quantity}</td>
                                            </tr>
                                        ))}
                                        
                                        <tr className="input-row">
                                            <td>+</td>
                                            <td>{new Date().toLocaleDateString()}</td>
                                            <td><input type="text" value={inputs[cat]?.type || ''} placeholder="Type" onChange={e => handleInput(cat, 'type', e.target.value)} /></td>
                                            <td><input type="number" value={inputs[cat]?.quantity || ''} placeholder="Qty" onChange={e => handleInput(cat, 'quantity', e.target.value)} /></td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className="btn-group">
                                    <button className="action-btn" onClick={() => handleAdd(cat)}>Add</button>
                                    <button className="action-btn" onClick={() => handleAdd(cat)}>Update</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'tracking' && (
                    <div className="section tracking-bg">
                        <h3>Harvest Tracking</h3>
                        <div className="chart-grid">
                            {categories.map(cat => (
                                <div key={cat} className="chart-box">
                                    <p>{cat}</p>
                                    <ResponsiveContainer width="100%" height={180}>
                                        <LineChart data={getChartData(cat)}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="date" hide />
                                            <YAxis />
                                            <Tooltip />
                                            <Line type="monotone" dataKey="qty" stroke="#0000ff" strokeWidth={2} dot={{ r: 4 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HarvestManagement;