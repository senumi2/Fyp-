import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import toast, { Toaster } from 'react-hot-toast'; 
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import "./Stock.css";

const Stock = () => {
    const [activeTab, setActiveTab] = useState('Inward');
    const [allData, setAllData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [reportType, setReportType] = useState('Monthly'); 
    const [editId, setEditId] = useState(null); 
    const [showFullTable, setShowFullTable] = useState({}); 

    const items = ["Salt", "Jipsum", "Artemiya", "Agriculture Salt"];
    const tableRefs = useRef({});

    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;

    const today = new Date().toISOString().split('T')[0];

    const [formData, setFormData] = useState({
        itemName: 'Salt',
        date: today,
        subType: '',
        quantity: '',
        partyName: '' 
    });

    const API_URL = "http://localhost:5000/api/stocks";

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await axios.get(API_URL);
            setAllData(res.data);
        } catch (err) { 
            toast.error("Failed to retrieve data."); 
        }
    };

    const getBalance = (itemName) => {
        const itemData = allData.filter(d => d.itemName === itemName);
        const totalIn = itemData.filter(d => d.transactionType === 'Inward').reduce((sum, d) => sum + d.quantity, 0);
        const totalOut = itemData.filter(d => d.transactionType === 'Outward').reduce((sum, d) => sum + d.quantity, 0);
        return totalIn - totalOut;
    };

    const handleAddOrUpdate = async (e) => {
        e.preventDefault();
        if (activeTab === 'Outward' && !editId) {
            const currentStock = getBalance(formData.itemName);
            if (Number(formData.quantity) > currentStock) {
                toast.error(`The available stock is insufficient! (Available: ${currentStock}kg)`);
                return;
            }
        }
        const payload = { ...formData, transactionType: activeTab, quantity: Number(formData.quantity) };
        try {
            if (editId) {
                await axios.put(`${API_URL}/${editId}`, payload);
                toast.success("Data updated successfully!");
                setEditId(null);
            } else {
                await axios.post(`${API_URL}/add`, payload);
                toast.success("New data entry successful!");
            }
            setFormData({ itemName: 'Salt', date: today, subType: '', quantity: '', partyName: '' });
            fetchData();
        } catch (err) { 
            const errorMsg = err.response?.data?.error || "Action failed!";
            toast.error(errorMsg); 
        }
    };

    const handleEdit = (record) => {
        const recordDay = new Date(record.date).toISOString().split('T')[0];
        if (recordDay !== today) {
            toast.error("You can only edit today's data!");
            return;
        }
        setEditId(record._id);
        setFormData({
            itemName: record.itemName,
            date: recordDay,
            subType: record.subType || '',
            quantity: record.quantity,
            partyName: record.partyName || ''
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id, recordDate) => {
        const recordDay = new Date(recordDate).toISOString().split('T')[0];
        if (recordDay !== today) {
            toast.error("You can only delete today's data!");
            return;
        }
        if (window.confirm("Are You sure you want to delete this data?")) {
            try {
                await axios.delete(`${API_URL}/${id}`);
                toast.success("Data deleted.");
                fetchData();
            } catch (err) { toast.error("Data deletion failed."); }
        }
    };

    const toggleTableMode = (itemName) => {
        setShowFullTable(prev => ({ ...prev, [itemName]: !prev[itemName] }));
    };

    const scrollToTable = (itemName) => {
        tableRefs.current[itemName]?.scrollIntoView({ behavior: 'smooth' });
    };

    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text("Inventory Status Report", 14, 15);
        const tableData = allData.map(d => [d.no, d.itemName, d.transactionType, d.partyName || '-', `${d.quantity}kg`, new Date(d.date).toLocaleDateString()]);
        doc.autoTable({
            head: [['REF NO', 'Item', 'Type', 'Party', 'Qty', 'Date']],
            body: tableData,
            startY: 25,
            headStyles: { fillColor: [28, 57, 187] } 
        });
        doc.save(`Stock_Report_${today}.pdf`);
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

    const renderTable = (itemName) => {
        let filtered = allData.filter(d => 
            d.itemName === itemName && d.transactionType === activeTab &&
            `${d.no} ${d.partyName}`.toLowerCase().includes(searchTerm.toLowerCase())
        ).reverse(); 

        const isFull = showFullTable[itemName];
        const balance = getBalance(itemName);
        let displayRecords = [];
        let totalPages = 0;

        if (isFull) {
            const indexOfLast = currentPage * recordsPerPage;
            displayRecords = filtered.slice(indexOfLast - recordsPerPage, indexOfLast);
            totalPages = Math.ceil(filtered.length / recordsPerPage);
        } else {
            displayRecords = filtered.slice(0, 20);
        }

        return (
            <div key={itemName} className="inventory-card" ref={el => tableRefs.current[itemName] = el}>
                <div className="card-header-flex">
                    <div className="title-stack">
                        <h4>{itemName}</h4>
                        <span className="balance-tag">Available: {balance.toLocaleString()}kg</span>
                    </div>
                    {/* Low Stock Warning නැවත එක් කළා */}
                    <div className="header-badges">
                        {balance < 1000 && <span className="low-stock-warning">⚠️ Low Stock</span>}
                        {!isFull && filtered.length > 20 && <span className="view-mode-tag">Latest 20</span>}
                    </div>
                </div>
                <div className="table-responsive">
                    <table className="inventory-table">
                        <thead>
                            <tr>
                                <th>REF NO</th>
                                <th>{activeTab === 'Inward' ? 'Supplier Name' : 'Customer Name'}</th>
                                <th>Qty (kg)</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayRecords.map(record => (
                                <tr key={record._id}>
                                    <td><span className="ref-tag">{record.no}</span></td>
                                    <td><span className="party-name">{record.partyName || '-'}</span></td>
                                    <td className="qty-cell"><strong>{record.quantity.toLocaleString()}</strong></td>
                                    <td className="action-btns-group">
                                        <button onClick={() => handleEdit(record)} className="stock-edit-btn">Edit</button>
                                        <button onClick={() => handleDelete(record._id, record.date)} className="stock-del-btn">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="table-footer-actions">
                    {filtered.length > 20 ? (
                        <button className="view-all-btn" onClick={() => toggleTableMode(itemName)}>
                            {isFull ? "Show Less (Latest 20)" : `View All Records (${filtered.length})`}
                        </button>
                    ) : <div></div>}

                    {isFull && totalPages > 1 && (
                        <div className="pagination-wrapper">
                            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Prev</button>
                            <span>{currentPage} / {totalPages}</span>
                            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Next</button>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="stock-module-wrapper">
            <Toaster position="top-right" />
            <div className="stock-layout">
                <aside className="stock-sidebar">
                    <div className="sidebar-header">INVENTORY</div>
                    <nav className="sidebar-nav">
                        <button className={activeTab === 'Inward' ? 'active' : ''} onClick={() => {setActiveTab('Inward'); setEditId(null);}}>Inward Stock</button>
                        <button className={activeTab === 'Outward' ? 'active' : ''} onClick={() => {setActiveTab('Outward'); setEditId(null);}}>Outward Stock</button>
                        <button className={activeTab === 'Reports' ? 'active' : ''} onClick={() => setActiveTab('Reports')}>Analysis Reports</button>
                    </nav>
                </aside>

                <main className="stock-content">
                    <header className="content-top-bar">
                        <h2 className="tab-title">{activeTab} Management</h2>
                        {activeTab !== 'Reports' && (
                            <div className="search-wrapper">
                                <input 
                                    type="text" 
                                    placeholder="Search entries..." 
                                    className="search-input" 
                                    onChange={(e) => setSearchTerm(e.target.value)} 
                                />
                            </div>
                        )}
                    </header>

                    {activeTab !== 'Reports' && (
                        <>
                            <div className="item-nav-grid">
                                {items.map(item => (
                                    <div key={item} className="item-nav-card" onClick={() => scrollToTable(item)}>
                                        <h3>{item}</h3>
                                        <p>Balance: <strong>{getBalance(item).toLocaleString()} kg</strong></p>
                                        <button className="nav-view-btn">View Log</button>
                                    </div>
                                ))}
                            </div>

                            <form className="stock-form" onSubmit={handleAddOrUpdate}>
                                <div className="form-fields">
                                    <div className="input-group">
                                        <label>Product Item</label>
                                        <select name="itemName" value={formData.itemName} onChange={(e) => setFormData({...formData, itemName: e.target.value})}>
                                            {items.map(item => <option key={item} value={item}>{item}</option>)}
                                        </select>
                                    </div>
                                    <div className="input-group">
                                        <label>{activeTab === 'Inward' ? "Supplier" : "Customer"}</label>
                                        <input type="text" placeholder="Enter name..." value={formData.partyName} onChange={(e) => setFormData({...formData, partyName: e.target.value})} required />
                                    </div>
                                    <div className="input-group">
                                        <label>Quantity (kg)</label>
                                        <input type="number" placeholder="0.00" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})} required />
                                    </div>
                                </div>
                                <div className="form-actions">
                                    <button type="submit" className={editId ? "update-btn" : "form-add-btn"}>
                                        {editId ? '💾 Save Changes' : `➕ Add ${activeTab} Record`}
                                    </button>
                                    {editId && <button type="button" className="cancel-btn" onClick={() => {setEditId(null); setFormData({itemName:'Salt', date:today, subType:'', quantity:'', partyName:''})}}>Cancel</button>}
                                </div>
                            </form>

                            <div className="stock-tables-grid">
                                {items.map(item => renderTable(item))}
                            </div>
                        </>
                    )}

                    {activeTab === 'Reports' && (
                        <div className="reports-section">
                            <div className="report-header-flex">
                                <h3>Stock Statistical Analysis</h3>
                                <div className="report-controls">
                                    <button onClick={() => setReportType('Monthly')} className={reportType === 'Monthly' ? 'active-report-btn' : 'report-btn'}>Monthly</button>
                                    <button onClick={() => setReportType('Annually')} className={reportType === 'Annually' ? 'active-report-btn' : 'report-btn'}>Annually</button>
                                    <button onClick={downloadPDF} className="pdf-btn">📥 Export PDF</button>
                                </div>
                            </div>
                            <div className="summary-cards-row">
                                {items.map(item => (
                                    <div className="stat-card" key={item}>
                                        <span>{item} Stock</span>
                                        <h4>{getBalance(item).toLocaleString()} <span>kg</span></h4>
                                    </div>
                                ))}
                            </div>
                            <div className="charts-container">
                                {items.map(item => (
                                    <div className="chart-wrapper-card" key={item}>
                                        <h5>{item} In/Out Trend</h5>
                                        <ResponsiveContainer width="100%" height={250}>
                                            <LineChart data={getChartData(item)}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                                <XAxis dataKey="period" stroke="#64748b" fontSize={12} />
                                                <YAxis stroke="#64748b" fontSize={12} />
                                                <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                                <Legend iconType="circle" />
                                                <Line type="monotone" dataKey="inward" stroke="#008080" strokeWidth={3} dot={{r: 5, fill: "#008080"}} name="Inward (Teal)" />
                                                <Line type="monotone" dataKey="outward" stroke="#1C39BB" strokeWidth={3} dot={{r: 5, fill: "#1C39BB"}} name="Outward (Blue)" />
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