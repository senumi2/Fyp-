import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import "./AdminInventoryManagement.css";

const AdminInventoryManagement = () => {
    const [activeTab, setActiveTab] = useState('Inward');
    const [allData, setAllData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [reportType, setReportType] = useState('Monthly'); 
    const items = ["Salt", "Jipsum", "Artemiya", "Agriculture Salt"];
    const tableRefs = useRef({});

    const API_URL = "http://localhost:5000/api/stocks";

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await axios.get(API_URL);
            setAllData(res.data);
        } catch (err) { 
            console.error("Error fetching data:", err); 
        }
    };

    const scrollToTable = (itemName) => {
        tableRefs.current[itemName]?.scrollIntoView({ behavior: 'smooth' });
    };

    const renderTable = (itemName) => {
        const filtered = allData.filter(d => 
            d.itemName === itemName && 
            d.transactionType === activeTab &&
            `${d.no} ${d.subType}`.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return (
            <div key={itemName} className="inventory-card" ref={el => tableRefs.current[itemName] = el}>
                <div className="card-header-flex">
                    <div className="title-info">
                        <h4>{itemName}</h4>
                        <span className="count-badge">{filtered.length} Entries</span>
                    </div>
                </div>
                <div className="table-responsive">
                    <table className="inventory-table">
                        <thead>
                            <tr>
                                <th>REF NO</th>
                                <th>Date</th>
                                <th>Type</th>
                                <th>Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length > 0 ? (
                                filtered.map((record, index) => (
                                    <tr key={index}>
                                        <td><span className="ref-tag">{record.no}</span></td>
                                        <td>{new Date(record.date).toLocaleDateString()}</td>
                                        <td><span className="type-pill">{record.subType || '-'}</span></td>
                                        <td className="qty-cell">{record.quantity}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="4" className="no-data">No records found</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    const getChartData = (itemName) => {
        const filtered = allData.filter(d => d.itemName === itemName);
        const summary = {};
        filtered.forEach(entry => {
            const dateObj = new Date(entry.date);
            const period = reportType === 'Monthly' 
                ? `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`
                : `${dateObj.getFullYear()}`;
            if (!summary[period]) summary[period] = { period, inward: 0, outward: 0 };
            if (entry.transactionType === 'Inward') summary[period].inward += Number(entry.quantity);
            else summary[period].outward += Number(entry.quantity);
        });
        return Object.values(summary).sort((a, b) => a.period.localeCompare(b.period));
    };

    return (
        <div className="admin-stock-container">
            <div className="stock-layout">
                <aside className="stock-sidebar">
                    <div className="sidebar-header">📦</div>
                    <nav className="sidebar-nav">
                        <button 
                            className={activeTab === 'Inward' ? 'active' : ''} 
                            onClick={() => setActiveTab('Inward')}
                        >
                            <span className="nav-icon">📥</span>
                            <span className="nav-tooltip">Inward Stock</span>
                        </button>
                        <button 
                            className={activeTab === 'Outward' ? 'active' : ''} 
                            onClick={() => setActiveTab('Outward')}
                        >
                            <span className="nav-icon">📤</span>
                            <span className="nav-tooltip">Outward Stock</span>
                        </button>
                        <button 
                            className={activeTab === 'Reports' ? 'active' : ''} 
                            onClick={() => setActiveTab('Reports')}
                        >
                            <span className="nav-icon">📊</span>
                            <span className="nav-tooltip">Analysis Reports</span>
                        </button>
                    </nav>
                </aside>

                <main className="stock-content">
                    <header className="content-top-bar">
                        <h2 className="tab-title">{activeTab} Viewer</h2>
                        {activeTab !== 'Reports' && (
                            <input 
                                type="text" 
                                placeholder="Search by ref or type..." 
                                className="search-input"
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        )}
                    </header>

                    {(activeTab === 'Inward' || activeTab === 'Outward') && (
                        <>
                            <div className="item-nav-grid">
                                {items.map(item => (
                                    <div key={item} className="item-nav-card" onClick={() => scrollToTable(item)}>
                                        <h3>{item}</h3>
                                        <button className="nav-action-btn">View Table</button>
                                    </div>
                                ))}
                            </div>

                            <div className="stock-tables-grid">
                                {items.map(item => renderTable(item))}
                            </div>
                        </>
                    )}

                    {activeTab === 'Reports' && (
                        <div className="stock-reports-container">
                            <div className="reports-top-flex">
                                <h3>Visual Analytics</h3>
                                <div className="report-toggle">
                                    <button className={reportType === 'Monthly' ? 'toggle-active' : ''} onClick={() => setReportType('Monthly')}>Monthly</button>
                                    <button className={reportType === 'Annually' ? 'toggle-active' : ''} onClick={() => setReportType('Annually')}>Annually</button>
                                </div>
                            </div>
                            <div className="charts-grid-container">
                                {items.map(item => (
                                    <div className="chart-card-full" key={item}>
                                        <h4>{item} Flow</h4>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <LineChart data={getChartData(item)}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                <XAxis dataKey="period" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Line type="monotone" dataKey="inward" stroke="#10b981" strokeWidth={3} name="Inward" />
                                                <Line type="monotone" dataKey="outward" stroke="#ef4444" strokeWidth={3} name="Outward" />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default AdminInventoryManagement;