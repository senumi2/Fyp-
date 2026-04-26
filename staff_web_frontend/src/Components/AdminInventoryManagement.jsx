import React, { useState, useEffect } from "react";
import axios from "axios";
import { ArrowDownLeft, ArrowUpRight, BarChart3, FileText } from 'lucide-react';
import "./AdminInventoryManagement.css";

const AdminInventory = () => {
    const [activeTab, setActiveTab] = useState('Inward');
    const [allData, setAllData] = useState([]);
    const items = ["Salt", "Jipsum", "Artemiya", "Agriculture Salt"];
    const API_URL = "http://localhost:5000/api/stocks";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(API_URL);
                setAllData(res.data);
            } catch (err) { 
                console.error("Data fetching error:", err); 
            }
        };
        fetchData();
    }, []);

    const getBalance = (itemName) => {
        const itemData = allData.filter(d => d.itemName === itemName);
        const totalIn = itemData.filter(d => d.transactionType === 'Inward').reduce((sum, d) => sum + d.quantity, 0);
        const totalOut = itemData.filter(d => d.transactionType === 'Outward').reduce((sum, d) => sum + d.quantity, 0);
        return totalIn - totalOut;
    };

    return (
        <div className="admin-container">
            {/* Sidebar with Icons & Popups */}
            <aside className="admin-icon-sidebar">
                <div className="nav-group">
                    {/* Inward Tab */}
                    <div 
                        className={`nav-icon-wrapper ${activeTab === 'Inward' ? 'active' : ''}`} 
                        onClick={() => setActiveTab('Inward')}
                    >
                        <ArrowDownLeft size={22} color={activeTab === 'Inward' ? '#FFD700' : '#fff'} />
                        <span className="nav-popup-name">Inward Stocks</span>
                    </div>

                    {/* Outward Tab */}
                    <div 
                        className={`nav-icon-wrapper ${activeTab === 'Outward' ? 'active' : ''}`} 
                        onClick={() => setActiveTab('Outward')}
                    >
                        <ArrowUpRight size={22} color={activeTab === 'Outward' ? '#FFD700' : '#fff'} />
                        <span className="nav-popup-name">Outward Stocks</span>
                    </div>

                    {/* Analysis Tab */}
                    <div 
                        className={`nav-icon-wrapper ${activeTab === 'Reports' ? 'active' : ''}`} 
                        onClick={() => setActiveTab('Reports')}
                    >
                        <BarChart3 size={22} color={activeTab === 'Reports' ? '#FFD700' : '#fff'} />
                        <span className="nav-popup-name">Stock Analysis</span>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="admin-main-content">
                <header className="admin-header">
                    <div className="header-title">
                        <h2>Inventory Management</h2>
                        <small>{activeTab} View Mode</small>
                    </div>
                </header>

                {/* Stock Summary Cards */}
                <div className="admin-stats-grid">
                    {items.map(item => (
                        <div key={item} className="admin-stat-box">
                            <p>{item}</p>
                            <h3>{getBalance(item).toLocaleString()} kg</h3>
                        </div>
                    ))}
                </div>

                {/* Data Table */}
                <div className="admin-table-section">
                    <table className="admin-pure-table">
                        <thead>
                            <tr>
                                <th>REF</th>
                                <th>{activeTab === 'Inward' ? 'Supplier / Source' : 'Customer / Destination'}</th>
                                <th>Quantity</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allData
                                .filter(d => d.transactionType === activeTab)
                                .slice(0, 15) // Displaying latest 15 records
                                .map(record => (
                                    <tr key={record._id}>
                                        <td>#{record.no || record._id.slice(-5)}</td>
                                        <td>{record.partyName || 'General Stock'}</td>
                                        <td>{record.quantity.toLocaleString()} kg</td>
                                        <td><span className="status-badge">Verified</span></td>
                                    </tr>
                                ))}
                            {allData.filter(d => d.transactionType === activeTab).length === 0 && (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
                                        No {activeTab} records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default AdminInventory;