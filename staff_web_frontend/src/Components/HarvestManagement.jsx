import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import './HarvestManagement.css';

const HarvestManagement = () => {
    const [harvestData, setHarvestData] = useState([]);
    const [activeTab, setActiveTab] = useState('management');
    const [inputs, setInputs] = useState({});

    const categories = ['Salt Harvest', 'Jipsum Harvest', 'Artimiya Harvest', 'Agriculture Salt Harvest'];

    // දත්ත ලබා ගැනීම
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

    // Input handle කිරීම
    const handleInput = (cat, field, val) => {
        setInputs({ 
            ...inputs, 
            [cat]: { ...inputs[cat], [field]: val } 
        });
    };

    // දත්ත ඇතුළත් කිරීම
    const handleAdd = async (cat) => {
        const data = inputs[cat];
        if (!data?.type || !data?.quantity) return alert("කරුණාකර සියලු විස්තර ඇතුළත් කරන්න.");
        
        try {
            const response = await axios.post('http://localhost:5000/api/harvest/add', {
                category: cat,
                type: data.type,
                quantity: Number(data.quantity)
            });
            
            // Backend එකෙන් ලැබෙන අලුත් data list එක update කිරීම
            setHarvestData(response.data);
            alert("Record Added Successfully!");
            
            // Input fields clear කිරීම
            setInputs({ 
                ...inputs, 
                [cat]: { type: '', quantity: '' } 
            });
        } catch (err) {
            alert("Error adding record");
            console.error(err);
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
        <div className="harvest-app-wrapper">
            <aside className="harvest-sidebar">
                <div className="sidebar-logo">SALTERN ERP</div>
                <nav className="harvest-nav">
                    <button className={activeTab === 'management' ? 'active' : ''} onClick={() => setActiveTab('management')}>📋 Management</button>
                    <button className={activeTab === 'tracking' ? 'active' : ''} onClick={() => setActiveTab('tracking')}>📈 Harvest Tracking</button>
                    <button className={activeTab === 'prediction' ? 'active' : ''} onClick={() => setActiveTab('prediction')}>🔮 Harvest Prediction</button>
                </nav>
            </aside>

            <div className="harvest-main">
                {activeTab === 'management' && (
                    <div className="harvest-section management-view fade-in">
                        <header className="section-header">
                            <h2>Harvest Management</h2>
                            <p>Daily production records & management</p>
                        </header>

                        <div className="harvest-blocks-container">
                            {categories.map(cat => {
                                const categoryObj = harvestData.find(h => h.category === cat);
                                const records = categoryObj ? [...categoryObj.records].reverse() : [];

                                return (
                                    <div key={cat} className="harvest-block-card">
                                        <div className="block-header">
                                            <p className="cat-title">{cat}</p>
                                        </div>
                                        <div className="table-container">
                                            <table className="harvest-table-custom">
                                                <thead>
                                                    <tr>
                                                        <th width="10%">NO.</th>
                                                        <th width="30%">Date</th>
                                                        <th width="30%">Type</th>
                                                        <th width="30%">Quantity (kg)</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {records.map((r, i) => (
                                                        <tr key={r._id || i}>
                                                            <td>{records.length - i}</td>
                                                            <td>{new Date(r.date).toLocaleDateString()}</td>
                                                            <td><span className="type-pill">{r.type}</span></td>
                                                            <td className="qty-val">{r.quantity.toLocaleString()}</td>
                                                        </tr>
                                                    ))}
                                                    
                                                    <tr className="input-row-highlight">
                                                        <td className="add-icon">+</td>
                                                        <td style={{color: '#94a3b8', fontSize: '0.85rem'}}>
                                                            {new Date().toLocaleDateString()} (Today)
                                                        </td>
                                                        <td>
                                                            <input 
                                                                type="text" 
                                                                value={inputs[cat]?.type || ''} 
                                                                placeholder="Enter Type" 
                                                                onChange={e => handleInput(cat, 'type', e.target.value)} 
                                                            />
                                                        </td>
                                                        <td>
                                                            <input 
                                                                type="number" 
                                                                value={inputs[cat]?.quantity || ''} 
                                                                placeholder="Qty" 
                                                                onChange={e => handleInput(cat, 'quantity', e.target.value)} 
                                                            />
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="btn-footer">
                                            <button className="btn-save" onClick={() => handleAdd(cat)}>Add Record</button>
                                            <button className="btn-update" onClick={() => handleAdd(cat)}>Update List</button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {activeTab === 'tracking' && (
                    <div className="harvest-section tracking-view fade-in">
                        <header className="section-header">
                            <h2>Production Analytics</h2>
                            <p>Visual trends for each harvest category</p>
                        </header>
                        <div className="analytics-grid">
                            {categories.map(cat => (
                                <div key={cat} className="chart-card-custom">
                                    <div className="chart-header">
                                        <h4>{cat} Analysis</h4>
                                    </div>
                                    <ResponsiveContainer width="100%" height={200}>
                                        <AreaChart data={getChartData(cat)}>
                                            <defs>
                                                <linearGradient id={`color${cat.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                                                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey="date" hide />
                                            <YAxis />
                                            <Tooltip />
                                            <Area 
                                                type="monotone" 
                                                dataKey="qty" 
                                                stroke="#4f46e5" 
                                                fillOpacity={1} 
                                                fill={`url(#color${cat.replace(/\s+/g, '')})`} 
                                                strokeWidth={2} 
                                            />
                                        </AreaChart>
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