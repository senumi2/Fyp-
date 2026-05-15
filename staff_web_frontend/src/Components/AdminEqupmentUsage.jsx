import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminEqupmentUsage.css';

const AdminEqupmentUsage = () => {
    const [activeTab, setActiveTab] = useState('inventory');
    const [dataList, setDataList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);

    const getTargetRoute = (tab) => {
        if (tab === 'logs') return 'maintenance-repair-logs';
        return tab;
    };

    const fetchCurrentData = async () => {
        setLoading(true);
        try {
            const endpoint = getTargetRoute(activeTab);
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            let url = `http://localhost:5000/api/${endpoint}`;
            
        if (searchTerm) {
          url += `?search=${searchTerm}`;
      }

            const response = await axios.get(url, config);
            setDataList(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            console.error("Fetch error:", err);
            setDataList([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchCurrentData();
        }, 300);
        return () => clearTimeout(delayDebounce);
    }, [activeTab, searchTerm]);

    return (
        <div className="admin-usage-wrapper">
            <aside className="admin-mini-sidebar">
                <div className="admin-sidebar-logo">ADMIN</div>
                <div className="admin-nav-icons">
                    <button 
                        className={`icon-btn ${activeTab === 'inventory' ? 'active' : ''}`} 
                        onClick={() => {setActiveTab('inventory'); setSearchTerm('');}}
                        title="Inventory"
                    >
                        📦
                    </button>
                    <button 
                        className={`icon-btn ${activeTab === 'issues' ? 'active' : ''}`} 
                        onClick={() => {setActiveTab('issues'); setSearchTerm('');}}
                        title="Issues"
                    >
                        ⚠️
                    </button>
                    <button 
                        className={`icon-btn ${activeTab === 'logs' ? 'active' : ''}`} 
                        onClick={() => {setActiveTab('logs'); setSearchTerm('');}}
                        title="Maintenance Logs"
                    >
                        🛠️
                    </button>
                </div>
            </aside>

            <main className="admin-usage-main">
                <header className="admin-usage-header">
                    <div className="admin-header-title">
                        <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} View</h1>
                        <p>View-only mode for equipment and maintenance monitoring.</p>
                    </div>
                    
                    <div className="admin-header-controls">
                        
                        <div className="admin-modern-search">
                            <span className="admin-search-icon">🔍</span>
                            <input 
                                type="text" 
                                placeholder={`Search for ${activeTab}...`} 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </header>

                <div className="admin-table-container">
                    {loading ? (
                        <div className="admin-loader">Fetching data...</div>
                    ) : (
                        <table className="admin-view-table">
                            <thead>
                                {activeTab === 'inventory' && (
                                    <tr><th>Date</th><th>Item Name</th><th>Quantity</th></tr>
                                )}
                                {activeTab === 'issues' && (
                                    <tr><th>Date</th><th>Issue</th><th>Status</th></tr>
                                )}
                                {activeTab === 'logs' && (
                                    <tr><th>Date</th><th>Equipment</th><th>Issue</th><th>Cost</th><th>Condition</th></tr>
                                )}
                            </thead>
                            <tbody>
                                {dataList.length > 0 ? (
                                    dataList.map((item) => (
                                        <tr key={item._id} className="admin-table-row">
                                            <td>{item.date ? new Date(item.date).toLocaleDateString() : 'N/A'}</td>
                                            {activeTab === 'inventory' && (
                                                <><td className="admin-bold-text">{item.items}</td>
                                                <td><span className="admin-qty-tag">{item.quantity}</span></td></>
                                            )}
                                            {activeTab === 'issues' && (
                                                <><td>{item.issue}</td>
                                                <td><span className={`admin-status-pill ${item.status?.toLowerCase()}`}>{item.status}</span></td></>
                                            )}
                                            {activeTab === 'logs' && (
                                                <>
                                                    <td className="admin-bold-text">{item.equipment}</td>
                                                    <td>{item.issue}</td>
                                                    <td className="admin-cost-text">Rs. {item.cost?.toLocaleString()}</td>
                                                    <td><span className={`admin-status-pill ${item.statuse?.toLowerCase()}`}>{item.statuse}</span></td>
                                                </>
                                            )}
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="5" className="admin-no-data">No records found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminEqupmentUsage;