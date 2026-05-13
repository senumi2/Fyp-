import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import './AdminInventoryManagement.css';

const AdminInventoryManagement = () => {
    const [inventoryData, setInventoryData] = useState([]);
    const [activeTab, setActiveTab] = useState('Inward'); // Inward, Outward, Reports
    const [unit, setUnit] = useState('kg');
    const [searchTerm, setSearchTerm] = useState("");
    const [reportType, setReportType] = useState('Monthly'); 
    const [loading, setLoading] = useState(true);
    
    const items = ['Salt', 'Gypsum', 'Artemia', 'Agriculture Salt'];
    const tableRefs = useRef({});
    const API_URL = "http://localhost:5000/api/stocks";

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            const res = await axios.get(API_URL);
            setInventoryData(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Fetch error:", err);
            setLoading(false);
        }
    };

    const formatWeight = (value) => {
        const num = Number(value) || 0;
        if (unit === 'Tons') return (num / 1000).toLocaleString(undefined, { minimumFractionDigits: 2 });
        return num.toLocaleString();
    };

    const getBalance = (itemName) => {
        const inward = inventoryData
            .filter(d => d.itemName === itemName && d.transactionType === 'Inward')
            .reduce((sum, d) => sum + (Number(d.quantity) || 0), 0);
        const outward = inventoryData
            .filter(d => d.itemName === itemName && d.transactionType === 'Outward')
            .reduce((sum, d) => sum + (Number(d.quantity) || 0), 0);
        return inward - outward;
    };

    // Analysis Report සඳහා දත්ත සකස් කිරීම (Stock.jsx හි logic එකට අනුව)
    const getChartData = (itemName) => {
        const filtered = inventoryData.filter(d => d.itemName === itemName);
        const summary = {};
        filtered.forEach(entry => {
            const dateObj = new Date(entry.date);
            const period = reportType === 'Monthly' 
                ? `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`
                : `${dateObj.getFullYear()}`;
            
            if (!summary[period]) summary[period] = { period, inward: 0, outward: 0 };
            const qty = unit === 'Tons' ? entry.quantity / 1000 : entry.quantity;
            
            if (entry.transactionType === 'Inward') summary[period].inward += qty;
            else if (entry.transactionType === 'Outward') summary[period].outward += qty;
        });
        return Object.values(summary).sort((a, b) => a.period.localeCompare(b.period));
    };

    if (loading) return <div className="inventory-loading">Loading Inventory...</div>;

    return (
        <div className="inventory-container-root">
            <aside className="inventory-mini-sidebar">
                <div className="sidebar-brand"><h2>Inventory</h2></div>
                <nav className="mini-nav-menu">
                    <button className={`mini-nav-item ${activeTab === 'Inward' ? 'active' : ''}`} onClick={() => setActiveTab('Inward')}>Inward Stock</button>
                    <button className={`mini-nav-item ${activeTab === 'Outward' ? 'active' : ''}`} onClick={() => setActiveTab('Outward')}>Outward Stock</button>
                    <button className={`mini-nav-item ${activeTab === 'Reports' ? 'active' : ''}`} onClick={() => setActiveTab('Reports')}>Analysis Reports</button>
                </nav>
                <div className="mini-sidebar-footer">
                    <div className="unit-toggle-wrapper">
                        <span>{unit}</span>
                        <label className="ui-switch">
                            <input type="checkbox" checked={unit === 'Tons'} onChange={() => setUnit(unit === 'kg' ? 'Tons' : 'kg')} />
                            <span className="ui-slider round"></span>
                        </label>
                    </div>
                </div>
            </aside>

            <main className="inventory-content-wrapper">
                <header className="inventory-header">
                    <h2 className="tab-display-title">{activeTab} Management</h2>
                    {activeTab !== 'Reports' && (
                        <input 
                            type="text" 
                            placeholder="Search by Ref, Name or Product..." 
                            className="inventory-search"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    )}
                </header>

                <div className="scrollable-area">
                    {/* --- INWARD & OUTWARD SECTIONS --- */}
                    {activeTab !== 'Reports' && (
                        <>
                            <div className="inventory-stats-grid">
                                {items.map(item => (
                                    <div key={item} className="inventory-card-stat" onClick={() => tableRefs.current[item]?.scrollIntoView({behavior: 'smooth'})}>
                                        <span className="card-title">{item} Balance</span>
                                        <h2 className="card-amount">{formatWeight(getBalance(item))} <small>{unit}</small></h2>
                                    </div>
                                ))}
                            </div>

                            <div className="inventory-tables-container">
                                {items.map(item => (
                                    <div key={item} className="inventory-data-table-card" ref={el => tableRefs.current[item] = el}>
                                        <div className="table-card-header">
                                            <h3>{item} Logs</h3>
                                        </div>
                                        <div className="table-responsive">
                                            <table className="custom-table">
                                                <thead>
                                                    <tr>
                                                        <th>Ref No</th>
                                                        <th>Date</th>
                                                        <th>{activeTab === 'Inward' ? 'Supplier' : 'Customer'}</th>
                                                        <th>Product</th>
                                                        <th>Qty ({unit})</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {inventoryData
                                                        .filter(d => d.itemName === item && d.transactionType === activeTab)
                                                        .filter(d => `${d.no} ${d.partyName} ${d.subType}`.toLowerCase().includes(searchTerm.toLowerCase()))
                                                        .map(row => (
                                                            <tr key={row._id}>
                                                                <td><span className="ref-chip">{row.no}</span></td>
                                                                <td>{new Date(row.date).toLocaleDateString()}</td>
                                                                <td>{row.partyName}</td>
                                                                <td>{row.subType}</td>
                                                                <td><b>{formatWeight(row.quantity)}</b></td>
                                                            </tr>
                                                        ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {/* --- ANALYSIS REPORTS SECTION --- */}
                    {activeTab === 'Reports' && (
                        <div className="admin-reports-view">
                            <div className="report-controls-bar">
                                <div className="report-btn-group">
                                    <button onClick={() => setReportType('Monthly')} className={reportType === 'Monthly' ? 'btn-active' : ''}>Monthly</button>
                                    <button onClick={() => setReportType('Annually')} className={reportType === 'Annually' ? 'btn-active' : ''}>Annually</button>
                                </div>
                            </div>

                            <div className="charts-grid-container">
                                {items.map(item => (
                                    <div className="admin-chart-card" key={item}>
                                        <h4>{item} Trend ({unit})</h4>
                                        <ResponsiveContainer width="100%" height={250}>
                                        <LineChart data={getChartData(item)}>
    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
    <XAxis dataKey="period" fontSize={11} stroke="#666" />
    <YAxis fontSize={11} stroke="#666" />
    <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} />
    <Legend verticalAlign="top" height={36}/>
    {/* Persian Green සහ Teal Green වර්ණ භාවිතා කර ඇත */}
    <Line type="monotone" dataKey="inward" stroke="#00A693" strokeWidth={3} dot={{ r: 4 }} name="Inward Stock" />
    <Line type="monotone" dataKey="outward" stroke="#008080" strokeWidth={3} dot={{ r: 4 }} name="Outward Stock" />
</LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminInventoryManagement;