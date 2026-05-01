import React, { useState, useEffect } from "react";
import axios from "axios";
import { Download, Search, ChevronDown, ChevronUp, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import "./AdminInventoryManagement.css";

const AdminInventory = () => {
    const [activeTab, setActiveTab] = useState('Inward');
    const [allData, setAllData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [reportType, setReportType] = useState('Monthly'); 
    const [unit, setUnit] = useState('kg'); 
    const [showFullTable, setShowFullTable] = useState({}); 
    const [loading, setLoading] = useState(true);
    
    const items = ["Salt", "Jipsum", "Artemiya", "Agriculture Salt"];
    const API_URL = "http://localhost:5000/api/stocks";

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await axios.get(API_URL);
            setAllData(Array.isArray(res.data) ? res.data : []);
            setLoading(false);
        } catch (err) { 
            console.error("Error:", err); 
            setLoading(false);
        }
    };

    const formatWeight = (value) => {
        const num = Number(value) || 0;
        if (unit === 'Tons') return (num / 1000).toLocaleString(undefined, { minimumFractionDigits: 2 });
        return num.toLocaleString();
    };

    const getBalance = (itemName) => {
        const itemData = allData.filter(d => d.itemName === itemName);
        const totalIn = itemData.filter(d => d.transactionType === 'Inward').reduce((sum, d) => sum + (Number(d.quantity) || 0), 0);
        const totalOut = itemData.filter(d => d.transactionType === 'Outward').reduce((sum, d) => sum + (Number(d.quantity) || 0), 0);
        return totalIn - totalOut;
    };

    // Chart Logic
    const getChartData = (itemName) => {
        const filtered = allData.filter(d => d.itemName === itemName);
        const summary = {};
        filtered.forEach(entry => {
            if (!entry.date) return;
            const dateObj = new Date(entry.date);
            const period = reportType === 'Monthly' 
                ? `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`
                : `${dateObj.getFullYear()}`;
            
            if (!summary[period]) summary[period] = { period, inward: 0, outward: 0 };
            const qty = unit === 'Tons' ? (Number(entry.quantity) || 0) / 1000 : (Number(entry.quantity) || 0);
            
            if (entry.transactionType === 'Inward') summary[period].inward += qty;
            else summary[period].outward += qty;
        });
        return Object.values(summary).sort((a, b) => a.period.localeCompare(b.period));
    };

    const renderStockTable = (itemName) => {
        const filtered = allData.filter(d => 
            d.itemName === itemName && d.transactionType === activeTab &&
            (d.no?.toString().toLowerCase().includes(searchTerm.toLowerCase()) || 
             d.partyName?.toLowerCase().includes(searchTerm.toLowerCase()))
        ).sort((a, b) => new Date(b.date) - new Date(a.date));

        const isFull = showFullTable[itemName];
        const displayRecords = isFull ? filtered : filtered.slice(0, 5);
        const balance = getBalance(itemName);

        return (
            <div key={`${activeTab}-${itemName}`} className="admin-inventory-card">
                <div className="admin-card-header">
                    <div className="title-border">
                        <h4>{itemName}</h4>
                        <span className="admin-balance">Current: {formatWeight(balance)} {unit}</span>
                    </div>
                </div>
                <div className="table-container">
                    <table className="admin-table">
                        <thead>
                            <tr><th>REF</th><th>DATE</th><th>PARTY</th><th>QTY ({unit})</th></tr>
                        </thead>
                        <tbody>
                            {displayRecords.map(record => (
                                <tr key={record._id}>
                                    <td>#{record.no}</td>
                                    <td>{new Date(record.date).toLocaleDateString()}</td>
                                    <td className="party-name-cell">{record.partyName || '-'}</td>
                                    <td className="qty-cell"><strong>{formatWeight(record.quantity)}</strong></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filtered.length > 5 && (
                    <button className="view-more-action" onClick={() => setShowFullTable(prev => ({ ...prev, [itemName]: !prev[itemName] }))}>
                        {isFull ? <ChevronUp size={14}/> : <ChevronDown size={14}/>} {isFull ? "Show Less" : "View All"}
                    </button>
                )}
            </div>
        );
    };

    if (loading) return <div className="loading-screen">Syncing Data...</div>;

    return (
        <div className="inventory-view-root">
            <aside className="inventory-side-nav">
                <div className="nav-icon-stack">
                    <div className={`nav-box ${activeTab === 'Inward' ? 'active' : ''}`} onClick={() => setActiveTab('Inward')}><span className="icon-emoji">🧂</span></div>
                    <div className={`nav-box ${activeTab === 'Outward' ? 'active' : ''}`} onClick={() => setActiveTab('Outward')}><span className="icon-emoji">📋</span></div>
                    <div className={`nav-box ${activeTab === 'Reports' ? 'active' : ''}`} onClick={() => setActiveTab('Reports')}><span className="icon-emoji">📈</span></div>
                    <div className="nav-divider"></div>
                    <div className="unit-switch-container">
                        <span className="unit-text">K</span>
                        <label className="unit-toggle">
                            <input type="checkbox" checked={unit === 'Tons'} onChange={() => setUnit(unit === 'kg' ? 'Tons' : 'kg')} />
                            <span className="unit-slider"></span>
                        </label>
                        <span className="unit-text">T</span>
                    </div>
                </div>
            </aside>

            <main className="inventory-body">
                <header className="inventory-main-header">
                    <div className="header-text">
                        <h2>{activeTab} Analytics</h2>
                        <p>Inventory Intelligence</p>
                    </div>
                </header>

                {/* Summary Cards */}
                <section className="inventory-stats-row">
                    <div className="stat-card card-gold">
                        <span className="stat-label">MONTHLY ACTIVITY</span>
                        <h3 className="stat-value">{formatWeight(allData.length)} Records</h3>
                    </div>
                    <div className="stat-card card-teal">
                        <span className="stat-label">MAIN STOCK</span>
                        <h3 className="stat-value">Salt</h3>
                    </div>
                    <div className="stat-card card-dark">
                        <span className="stat-label">SYSTEM</span>
                        <h3 className="stat-value">LIVE</h3>
                    </div>
                </section>

                <div className="inventory-content">
                    {activeTab !== 'Reports' ? (
                        <div className="inventory-grid-display">
                            {items.map(item => renderStockTable(item))}
                        </div>
                    ) : (
                        <div className="reports-section">
                            <div className="report-controls">
                                <button className={reportType === 'Monthly' ? 'btn-active' : ''} onClick={() => setReportType('Monthly')}>Monthly</button>
                                <button className={reportType === 'Annually' ? 'btn-active' : ''} onClick={() => setReportType('Annually')}>Annually</button>
                            </div>
                            <div className="charts-grid">
                                {items.map(item => (
                                    <div className="chart-card" key={item}>
                                        <h5>{item} Flow ({unit})</h5>
                                        <ResponsiveContainer width="100%" height={220}>
                                            <LineChart data={getChartData(item)}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                                <XAxis dataKey="period" fontSize={10} />
                                                <YAxis fontSize={10} />
                                                <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }} />
                                                <Legend />
                                                <Line type="monotone" dataKey="inward" stroke="#008080" strokeWidth={3} dot={{ r: 3 }} name="Inward" />
                                                <Line type="monotone" dataKey="outward" stroke="#1C39BB" strokeWidth={3} dot={{ r: 3 }} name="Outward" />
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

export default AdminInventory;