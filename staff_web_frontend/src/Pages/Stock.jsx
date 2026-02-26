import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import "./Stock.css";

const Stock = () => {
    const [activeTab, setActiveTab] = useState('Inward');
    const [allData, setAllData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [reportType, setReportType] = useState('Monthly'); 
    const items = ["Salt", "Jipsum", "Artemiya", "Agriculture Salt"];
    const tableRefs = useRef({});

    
    const today = new Date().toISOString().split('T')[0];

    const [formData, setFormData] = useState({
        itemName: 'Salt',
        no: '', 
        date: today,
        subType: '',
        quantity: ''
    });

    
    const API_URL = "http://localhost:5000/api/stocks";

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        generateNextNo();
    }, [allData, activeTab, formData.itemName]);

    const fetchData = async () => {
        try {
            const res = await axios.get(API_URL);
            setAllData(res.data);
        } catch (err) { 
            console.error("Error fetching data:", err); 
        }
    };

    const generateNextNo = () => {
        const itemSpecificCount = allData.filter(d => 
            d.itemName === formData.itemName && 
            d.transactionType === activeTab
        ).length + 1;

        const prefix = activeTab === 'Inward' ? 'IN' : 'OUT';
        const itemPart = formData.itemName.toUpperCase().replace(/\s/g, ''); 
        const newNo = `${prefix}-${itemPart}-${itemSpecificCount.toString().padStart(3, '0')}`;
        
        setFormData(prev => ({ ...prev, no: newNo, date: today }));
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAdd = async (e) => {
        e.preventDefault();

 
        const payload = { 
            itemName: formData.itemName,
            transactionType: activeTab, // 'Inward' or 'Outward'
            date: new Date(formData.date), 
            subType: formData.subType,
            quantity: Number(formData.quantity), 
            no: formData.no
        };

        try {
           
            const response = await axios.post(`${API_URL}/add`, payload);
            
            if (response.status === 201) {
                alert(`Record ${formData.no} added successfully!`);
                setFormData(prev => ({ ...prev, subType: '', quantity: '' }));
                fetchData();
            }
        } catch (err) { 
            console.error("Error adding data:", err.response?.data || err.message);
            alert("Error adding data. Check console for details."); 
        }
    };

    const scrollToTable = (itemName) => {
        tableRefs.current[itemName]?.scrollIntoView({ behavior: 'smooth' });
    };

    // show data in the Table 
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

    // --- Graph Data Logic ---
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
        <div className="stock-module-wrapper">
            <div className="stock-layout">
                <aside className="stock-sidebar">
                    <div className="sidebar-header">STOCK MANAGER</div>
                    <nav className="sidebar-nav">
                        <button className={activeTab === 'Inward' ? 'active' : ''} onClick={() => setActiveTab('Inward')}>Inward Stock</button>
                        <button className={activeTab === 'Outward' ? 'active' : ''} onClick={() => setActiveTab('Outward')}>Outward Stock</button>
                        <button className={activeTab === 'Reports' ? 'active' : ''} onClick={() => setActiveTab('Reports')}>Analysis Reports</button>
                    </nav>
                </aside>

                <main className="stock-content">
                    <header className="content-top-bar">
                        <h2 className="tab-title">{activeTab} Dashboard</h2>
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

                            <form className="stock-form" onSubmit={handleAdd}>
                                <div className="form-group">
                                    <label>Item Name</label>
                                    <select name="itemName" value={formData.itemName} onChange={handleInputChange}>
                                        {items.map(item => <option key={item} value={item}>{item}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Reference</label>
                                    <input type="text" name="no" value={formData.no} readOnly className="read-only-input" />
                                </div>
                                <div className="form-group">
                                    <label>Date</label>
                                    <input type="date" name="date" value={formData.date} readOnly className="read-only-input" />
                                </div>
                                <div className="form-group">
                                    <label>Type</label>
                                    <input type="text" name="subType" value={formData.subType} onChange={handleInputChange} placeholder="Ex: Fine" />
                                </div>
                                <div className="form-group">
                                    <label>Quantity</label>
                                    <input type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} placeholder="0" required />
                                </div>
                                <button type="submit" className="form-add-btn">Add Record</button>
                            </form>

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

export default Stock;