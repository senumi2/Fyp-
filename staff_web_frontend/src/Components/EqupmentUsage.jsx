import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EqupmentUsage.css';

const EqupmentUsage = () => {
    const [activeTab, setActiveTab] = useState('inventory');
    const [dataList, setDataList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);

    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [formData, setFormData] = useState({
        items: '', 
        quantity: '', 
        issue: '', 
        status: 'Pending', 
        equipment: '', 
        cost: '', 
        statuse: 'Good'
    });

   
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
            
           
            if (activeTab !== 'logs' && searchTerm) {
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

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this data?")) {
            const endpoint = getTargetRoute(activeTab);
            const token = localStorage.getItem('token');
            try {
                await axios.delete(`http://localhost:5000/api/${endpoint}/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchCurrentData();
            } catch (err) {
                alert("Deletion failed!");
            }
        }
    };

    const openModal = (item = null) => {
        if (item) {
            setIsEditing(true);
            setCurrentId(item._id);
            setFormData(item);
        } else {
            setIsEditing(false);
            setCurrentId(null);
            setFormData({ 
                items: '', 
                quantity: '', 
                issue: '', 
                status: 'Pending', 
                equipment: '', 
                cost: '', 
                statuse: 'Good' 
            });
        }
        setIsModalOpen(true);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const endpoint = getTargetRoute(activeTab);
        const url = `http://localhost:5000/api/${endpoint}`;
        const token = localStorage.getItem('token');

        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            if (isEditing) {
                await axios.put(`${url}/${currentId}`, formData, config);
            } else {
                await axios.post(url, formData, config);
            }
            setIsModalOpen(false);
            fetchCurrentData();
            alert("Saved successfully!");
        } catch (err) {
            console.error("Submit Error:", err.response?.data);
            alert("Save failed! Message received from backend: " + (err.response?.data?.message || "Error"));
        }
    };

    return (
        <div className="usage-wrapper">
            <nav className="usage-sidebar">
                <h2 className="sidebar-logo">SmartEquip</h2>
                <div className="nav-group">
                    <button className={activeTab === 'inventory' ? 'nav-btn active' : 'nav-btn'} onClick={() => {setActiveTab('inventory'); setSearchTerm('');}}>Inventory</button>
                    <button className={activeTab === 'issues' ? 'nav-btn active' : 'nav-btn'} onClick={() => {setActiveTab('issues'); setSearchTerm('');}}>Reported Issues</button>
                    <button className={activeTab === 'logs' ? 'nav-btn active' : 'nav-btn'} onClick={() => {setActiveTab('logs'); setSearchTerm('');}}>Maintenance Logs</button>
                </div>
            </nav>

            <main className="usage-main">
                <header className="usage-header">
                    <div className="header-title">
                        <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management</h1>
                        <p>Manage and monitor your equipment assets effectively.</p>
                    </div>
                    
                    <div className="header-controls">
                        <div className="modern-search-wrapper">
                            <span className="search-icon">🔍</span>
                            <input 
                                type="text" 
                                placeholder={`Search ${activeTab} items...`} 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="add-main-btn" onClick={() => openModal()}>+ New Entry</button>
                    </div>
                </header>

                <div className="table-container">
                    {loading ? (
                        <div className="loader">Loading data...</div>
                    ) : (
                        <table className="modern-table">
                            <thead>
                                {activeTab === 'inventory' && (
                                    <tr><th>Date</th><th>Item Name</th><th>Quantity</th><th>Actions</th></tr>
                                )}
                                {activeTab === 'issues' && (
                                    <tr><th>Date</th><th>Issue</th><th>Status</th><th>Actions</th></tr>
                                )}
                                {activeTab === 'logs' && (
                                    <tr><th>Date</th><th>Equipment</th><th>Issue</th><th>Repair Cost</th><th>Condition</th><th>Actions</th></tr>
                                )}
                            </thead>
                            <tbody>
                                {dataList.length > 0 ? (
                                    dataList.map((item) => (
                                        <tr key={item._id} className="table-row">
                                            <td>{item.date ? new Date(item.date).toLocaleDateString() : 'N/A'}</td>
                                            {activeTab === 'inventory' && (<><td className="bold-text">{item.items}</td><td><span className="qty-tag">{item.quantity}</span></td></>)}
                                            {activeTab === 'issues' && (<><td>{item.issue}</td><td><span className={`status-pill ${item.status?.toLowerCase()}`}>{item.status}</span></td></>)}
                                            {activeTab === 'logs' && (
                                                <>
                                                    <td className="bold-text">{item.equipment}</td>
                                                    <td>{item.issue}</td>
                                                    <td className="cost-text">Rs. {item.cost?.toLocaleString()}</td>
                                                    <td><span className={`status-pill ${item.statuse}`}>{item.statuse}</span></td>
                                                </>
                                            )}
                                            <td>
                                                <div className="action-group">
                                                    <button className="update-btn" onClick={() => openModal(item)}>Update</button>
                                                    <button className="delete-btn" onClick={() => handleDelete(item._id)}>Delete</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="6" className="no-data">No records found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </main>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-card">
                        <div className="modal-header">
                            <h3>{isEditing ? 'Update Entry' : 'Add New Entry'}</h3>
                            <button className="close-x" onClick={() => setIsModalOpen(false)}>×</button>
                        </div>
                        <form onSubmit={handleFormSubmit} className="modal-form">
                            {activeTab === 'inventory' && (
                                <><label>Item Name</label><input type="text" required value={formData.items} onChange={(e) => setFormData({...formData, items: e.target.value})} /><label>Quantity</label><input type="number" required value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})} /></>
                            )}
                            {activeTab === 'issues' && (
                                <><label>Issue Description</label><input type="text" required value={formData.issue} onChange={(e) => setFormData({...formData, issue: e.target.value})} /><label>Status</label><select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}><option value="Pending">Pending</option><option value="Ongoing">Ongoing</option><option value="Fixed">Fixed</option></select></>
                            )}
                            {activeTab === 'logs' && (
                                <>
                                    <label>Equipment Name</label>
                                    <input type="text" required value={formData.equipment} onChange={(e) => setFormData({...formData, equipment: e.target.value})} />
                                    
                                    <label>Maintenance Issue</label>
                                    <input type="text" required value={formData.issue} onChange={(e) => setFormData({...formData, issue: e.target.value})} />
                                    
                                    <label>Repair Cost (Rs.)</label>
                                    <input type="number" required value={formData.cost} onChange={(e) => setFormData({...formData, cost: e.target.value})} />
                                    
                                    <label>Condition</label>
                                    <select value={formData.statuse} onChange={(e) => setFormData({...formData, statuse: e.target.value})}>
                                        <option value="Good">Good</option>
                                        <option value="Fair">Fair</option>
                                        <option value="Poor">Poor</option>
                                    </select>
                                </>
                            )}
                            <div className="modal-footer">
                                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn-submit">{isEditing ? 'Save Changes' : 'Add Entry'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EqupmentUsage;