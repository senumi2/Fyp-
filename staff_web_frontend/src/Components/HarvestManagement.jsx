import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import WeatherDashboard from './WeatherDashboard';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import './HarvestManagement.css';

const HarvestManagement = () => {
    const [harvestData, setHarvestData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('management');
    const [inputs, setInputs] = useState({});
    const [showAll, setShowAll] = useState({});
    const [unit, setUnit] = useState('kg');
    const [searchTerm, setSearchTerm] = useState("");
    const [editMode, setEditMode] = useState(null);

    const categories = ['Salt Harvest', 'Jipsum Harvest', 'Artimiya Harvest', 'Agriculture Salt Harvest'];

    const fetchHarvests = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:5000/api/harvest');
            setHarvestData(res.data || []);
        } catch (err) { console.error("Fetch Error:", err); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchHarvests(); }, []);

    const isToday = (date) => new Date(date).toDateString() === new Date().toDateString();

    const handleInput = (cat, field, val) => {
        setInputs({ ...inputs, [cat]: { ...inputs[cat], [field]: val } });
    };

    const handleAddOrUpdate = async (cat) => {
        const data = inputs[cat];
        if (!data?.type || !data?.quantity) return alert("Please fill all fields.");

        try {
            let response;
            if (editMode && editMode.cat === cat) {
                response = await axios.put(`http://localhost:5000/api/harvest/update/${cat}/${editMode.id}`, {
                    type: data.type,
                    quantity: Number(data.quantity)
                });
                setEditMode(null);
            } else {
                response = await axios.post('http://localhost:5000/api/harvest/add', {
                    category: cat, type: data.type, quantity: Number(data.quantity)
                });
            }
            setHarvestData(response.data);
            setInputs({ ...inputs, [cat]: { type: '', quantity: '' } });
        } catch (err) { alert(err.response?.data?.message || "An error occurred.."); }
    };

    const startEdit = (cat, record) => {
        setEditMode({ cat, id: record._id });
        setInputs({ ...inputs, [cat]: { type: record.type, quantity: record.quantity } });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (cat, recordId) => {
        if (!window.confirm("Do you want to delete this data?")) return;
        try {
            const res = await axios.delete(`http://localhost:5000/api/harvest/delete/${cat}/${recordId}`);
            setHarvestData(res.data);
        } catch (err) { alert(err.response?.data?.message || "Delete failed"); }
    };

    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text("SALTERN ERP - Harvest Report", 14, 20);
        doc.setFontSize(11);
        doc.text(`Report Generated: ${new Date().toLocaleString()}`, 14, 30);
        
        let allRecordsForPdf = [];
        harvestData.forEach(catObj => {
            catObj.records.forEach(r => {
                allRecordsForPdf.push([
                    new Date(r.date).toLocaleDateString(),
                    catObj.category,
                    r.type,
                    `${formatVal(r.quantity).toLocaleString()} ${unit}`
                ]);
            });
        });

        autoTable(doc, {
            head: [['Date', 'Category', 'Type', `Quantity (${unit})`]],
            body: allRecordsForPdf,
            startY: 35,
            theme: 'striped',
            headStyles: { fillColor: [0, 109, 91] }
        });
        doc.save("Saltern_Harvest_Report.pdf");
    };

    const formatVal = (val) => unit === 'kg' ? val : val / 1000;

    const stats = useMemo(() => {
        let total = 0;
        let catTotals = {};
        harvestData.forEach(c => {
            const sum = c.records ? c.records.reduce((acc, r) => acc + r.quantity, 0) : 0;
            total += sum;
            catTotals[c.category] = sum;
        });
        const highest = Object.keys(catTotals).length > 0 
            ? Object.keys(catTotals).reduce((a, b) => catTotals[a] > catTotals[b] ? a : b) : 'N/A';
        return { total, highest };
    }, [harvestData]);

    const getChartData = (cat) => {
        const found = harvestData.find(h => h.category === cat);
        return found ? found.records.map(r => ({
            date: new Date(r.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
            qty: formatVal(r.quantity)
        })) : [];
    };

    if (loading) return <div className="loader-box"><div className="spin"></div><p>SALTERN ERP Loading...</p></div>;

    return (
        <div className="harvest-container">
            <aside className="sidebar">
                <div className="logo">SALTERN <span>ERP</span></div>
                <nav>
                    <button className={activeTab === 'management' ? 'active' : ''} onClick={() => setActiveTab('management')}>📋 Management</button>
                    <button className={activeTab === 'tracking' ? 'active' : ''} onClick={() => setActiveTab('tracking')}>📈 Analytics</button>
                    <button className={activeTab === 'weatherdashboard'? 'active' : ''} onClick={() => setActiveTab('weatherdashboard')}>💧Weather Prediction</button>
                </nav>
                <div className="unit-toggle-container">
                    <span className={unit === 'kg' ? 'active-u' : ''}>KG</span>
                    <label className="switch">
                        <input type="checkbox" checked={unit === 'tons'} onChange={() => setUnit(unit === 'kg' ? 'tons' : 'kg')} />
                        <span className="slider round"></span>
                    </label>
                    <span className={unit === 'tons' ? 'active-u' : ''}>TONS</span>
                </div>
            </aside>

            <main className="content">
                <header className="dashboard-header">
                    <div className="stat-box yellow">
                        <span>Total Monthly Harvest ({unit})</span>
                        <h2>{formatVal(stats.total).toLocaleString(undefined, {minimumFractionDigits: 2})}</h2>
                    </div>
                    <div className="stat-box persian">
                        <span>Top Category</span>
                        <h2>{stats.highest}</h2>
                    </div>
                    <div className="stat-box teal pdf-btn-container">
                        <button className="pdf-btn" onClick={downloadPDF}>📥 Download PDF</button>
                    </div>
                </header>

                {/* ---  Switching Tabs --- */}
                
                {activeTab === 'management' && (
                    <div className="fade-in">
                        <div className="search-bar-container">
                            <input 
                                type="text" 
                                placeholder="Search by type or date (e.g. Fine or 2024)..." 
                                className="search-input"
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="category-nav">
                            {categories.map(cat => (
                                <a key={cat} href={`#${cat.replace(/\s+/g, '')}`} className="nav-pill">{cat}</a>
                            ))}
                        </div>

                        <div className="table-list">
                            {categories.map(cat => {
                                const categoryObj = harvestData.find(h => h.category === cat);
                                let records = categoryObj ? categoryObj.records : [];
                                
                                const filteredRecords = records.filter(r => 
                                    r.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    new Date(r.date).toLocaleDateString().includes(searchTerm)
                                ).reverse();

                                const displayData = filteredRecords;

                                return (
                                    <section key={cat} id={cat.replace(/\s+/g, '')} className="table-card">
                                        <h3>{cat}</h3>
                                        <div className="table-wrapper">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>#</th><th>Date</th><th>Type</th><th>Qty ({unit})</th><th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr className="add-row">
                                                        <td className="plus">+</td>
                                                        <td className="small-date">Today</td>
                                                        <td><input type="text" placeholder="Type" value={inputs[cat]?.type || ''} onChange={e => handleInput(cat, 'type', e.target.value)} /></td>
                                                        <td><input type="number" placeholder="Qty" value={inputs[cat]?.quantity || ''} onChange={e => handleInput(cat, 'quantity', e.target.value)} /></td>
                                                        <td>
                                                            <button className="add-btn" onClick={() => handleAddOrUpdate(cat)}>
                                                                {editMode?.cat === cat ? 'Update' : 'Add'}
                                                            </button>
                                                            {editMode?.cat === cat && <button className="del-btn" style={{marginLeft:'5px'}} onClick={() => {setEditMode(null); setInputs({});}}>Cancel</button>}
                                                        </td>
                                                    </tr>
                                                    {displayData.map((r, i) => (
                                                        <tr key={r._id}>
                                                            <td>{filteredRecords.length - i}</td>
                                                            <td>{new Date(r.date).toLocaleDateString()}</td>
                                                            <td><span className="type-tag">{r.type}</span></td>
                                                            <td className="bold">{formatVal(r.quantity).toLocaleString()}</td>
                                                            <td>
                                                                {isToday(r.date) && (
                                                                    <>
                                                                        <button className="edit-btn" onClick={() => startEdit(cat, r)} style={{marginRight:'8px'}}>Edit</button>
                                                                        <button className="del-btn" onClick={() => handleDelete(cat, r._id)}>Delete</button>
                                                                    </>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </section>
                                );
                            })}
                        </div>
                    </div>
                )}

                {activeTab === 'tracking' && (
                    <div className="analytics-view fade-in">
                        <h2 className="section-title">Visual Production Analytics ({unit.toUpperCase()})</h2>
                        <div className="chart-grid">
                            {categories.map(cat => (
                                <div key={cat} className="chart-card">
                                    <h4>{cat} Analysis</h4>
                                    <ResponsiveContainer width="100%" height={280}>
                                        <AreaChart data={getChartData(cat)}>
                                            <defs>
                                                <linearGradient id={`grad${cat.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#00A693" stopOpacity={0.4}/>
                                                    <stop offset="95%" stopColor="#00A693" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                            <XAxis dataKey="date" tick={{fontSize: 12}} />
                                            <YAxis tick={{fontSize: 12}} />
                                            <Tooltip />
                                            <Area type="monotone" dataKey="qty" stroke="#00A693" fillOpacity={1} fill={`url(#grad${cat.replace(/\s+/g, '')})`} strokeWidth={3} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'weatherdashboard' && (
                    <div className="fade-in">
                        <WeatherDashboard />
                    </div>
                )}
            </main>
        </div>
    );
};

export default HarvestManagement;