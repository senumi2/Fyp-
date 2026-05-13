import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import toast, { Toaster } from 'react-hot-toast'; 
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; 
import "./Stock.css";

const Stock = () => {
    const [activeTab, setActiveTab] = useState('Inward');
    const [allData, setAllData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [reportType, setReportType] = useState('Monthly'); 
    const [editId, setEditId] = useState(null); 
    const [showFullTable, setShowFullTable] = useState({}); 
    const [unit, setUnit] = useState('kg'); 

    // නිෂ්පාදන කාණ්ඩ සහ ඔබ ලබා දුන් නිශ්චිත නිෂ්පාදන නාමයන්
    const items = ["Salt", "Gypsum", "Artemia", "Agriculture Salt"];
    
    const productMapping = {
        "Salt": [
            "Iodized Edible CommonSalt 1kg",
            "Iodized Edible CommonSalt 400g",
            "Refined iodized Table Salt 400g",
            "Refined iodized Table Salt 1kg"
        ],
        "Gypsum": [
            "Gypsum (Crude) 500g", 
            "Gypsum (Industrial) 500g"
        ],
        "Artemia": [
            "Artemia Cysts 500g",
            "Artemia Biomass 500g"
        ],
        "Agriculture Salt": [
            "Agriculture Salt (Fertilizer Grade Salt) 500g",
            "Agriculture Salt (Soil Amendment Salt) 500g"
        ]
    };

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

    const formatWeight = (value) => {
        const num = Number(value);
        if (unit === 'Tons') {
            return (num / 1000).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 3 });
        }
        return num.toLocaleString();
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
        try {
            if (!allData || allData.length === 0) {
                toast.error("No data to export");
                return;
            }
            const doc = new jsPDF();
            doc.setFontSize(18);
            doc.setTextColor(28, 57, 187);
            doc.text("Inventory Status Report", 14, 20);
            doc.setFontSize(10);
            doc.text(`Generated on: ${new Date().toLocaleString()} | Unit: ${unit}`, 14, 28);

            const tableData = allData.map(d => [
                d.no ? String(d.no) : '-', 
                d.itemName || '-', 
                d.subType || '-',
                d.partyName || '-', 
                `${formatWeight(d.quantity || 0)} ${unit}`, 
                d.date ? new Date(d.date).toLocaleDateString() : '-'
            ]);

            autoTable(doc, {
                head: [['REF NO', 'Category', 'Product Name', 'Party', `Qty (${unit})`, 'Date']],
                body: tableData,
                startY: 35,
                theme: 'grid',
                headStyles: { fillColor: [28, 57, 187], textColor: [255, 255, 255] },
                alternateRowStyles: { fillColor: [240, 244, 248] }
            });
            doc.save(`Stock_Report_${today}.pdf`);
            toast.success("PDF Downloaded!");
        } catch (error) {
            toast.error("Error generating PDF");
        }
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
            const qty = unit === 'Tons' ? entry.quantity / 1000 : entry.quantity;
            if (entry.transactionType === 'Inward') summary[period].inward += qty;
            else summary[period].outward += qty;
        });
        return Object.values(summary).sort((a, b) => a.period.localeCompare(b.period));
    };

    const renderTable = (itemName) => {
        let filtered = allData.filter(d => 
            d.itemName === itemName && d.transactionType === activeTab &&
            `${d.no} ${d.partyName} ${d.subType}`.toLowerCase().includes(searchTerm.toLowerCase())
        ).sort((a, b) => new Date(b.date) - new Date(a.date)); 

        const isFull = showFullTable[itemName];
        const balance = getBalance(itemName);
        let displayRecords = isFull ? filtered.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage) : filtered.slice(0, 20);
        let totalPages = Math.ceil(filtered.length / recordsPerPage);

        return (
            <div key={itemName} className="inventory-card" ref={el => tableRefs.current[itemName] = el}>
                <div className="card-header-flex">
                    <div className="title-stack">
                        <h4>{itemName}</h4>
                        <span className="balance-tag">Available: {formatWeight(balance)} {unit}</span>
                    </div>
                </div>
                <div className="table-responsive">
                    <table className="inventory-table">
                        <thead>
                            <tr>
                                <th>REF NO</th>
                                <th>Date</th>
                                <th>{activeTab === 'Inward' ? 'Supplier Name' : 'Customer Name'}</th>
                                <th>Product Name</th>
                                <th>Qty ({unit})</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayRecords.map(record => (
                                <tr key={record._id}>
                                    <td><span className="ref-tag">{record.no}</span></td>
                                    <td>{new Date(record.date).toLocaleDateString()}</td>
                                    <td><span className="party-name">{record.partyName || '-'}</span></td>
                                    <td>{record.subType || '-'}</td>
                                    <td className="qty-cell"><strong>{formatWeight(record.quantity)}</strong></td>
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
                    {filtered.length > 20 && (
                        <button className="view-all-btn" onClick={() => toggleTableMode(itemName)}>
                            {isFull ? "Show Less" : `View All (${filtered.length})`}
                        </button>
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
                    <div className="sidebar-header"><span className="header-icon">📦</span> INVENTORY</div>
                    <nav className="sidebar-nav">
                        <button className={activeTab === 'Inward' ? 'active' : ''} onClick={() => setActiveTab('Inward')}>Inward Stock</button>
                        <button className={activeTab === 'Outward' ? 'active' : ''} onClick={() => setActiveTab('Outward')}>Outward Stock</button>
                        <button className={activeTab === 'Reports' ? 'active' : ''} onClick={() => setActiveTab('Reports')}>Analysis Reports</button>
                    </nav>
                    <div className="sidebar-footer">
                        <div className="unit-toggle-container">
                            <span className={unit === 'kg' ? 'active' : ''}>kg</span>
                            <label className="switch">
                                <input type="checkbox" checked={unit === 'Tons'} onChange={() => setUnit(unit === 'kg' ? 'Tons' : 'kg')} />
                                <span className="slider round"></span>
                            </label>
                            <span className={unit === 'Tons' ? 'active' : ''}>Tons</span>
                        </div>
                    </div>
                </aside>

                <main className="stock-content">
                    <header className="content-top-bar">
                        <h2 className="tab-title">{activeTab} Management</h2>
                        <input type="text" placeholder="Search..." className="search-input" onChange={(e) => setSearchTerm(e.target.value)} />
                    </header>

                    {activeTab !== 'Reports' && (
                        <>
                            <div className="item-nav-grid">
                                {items.map(item => (
                                    <div key={item} className="item-nav-card" onClick={() => scrollToTable(item)}>
                                        <h3>{item}</h3>
                                        <p>Balance: <strong>{formatWeight(getBalance(item))} {unit}</strong></p>
                                    </div>
                                ))}
                            </div>

                            <form className="stock-form" onSubmit={handleAddOrUpdate}>
                                <div className="form-fields">
                                    <div className="input-group">
                                        <label>Date</label>
                                        <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} required />
                                    </div>
                                    <div className="input-group">
                                        <label>Category</label>
                                        <select value={formData.itemName} onChange={(e) => setFormData({...formData, itemName: e.target.value, subType: ''})}>
                                            {items.map(item => <option key={item} value={item}>{item}</option>)}
                                        </select>
                                    </div>
                                    <div className="input-group">
                                        <label>Product Name</label>
                                        <select value={formData.subType} onChange={(e) => setFormData({...formData, subType: e.target.value})} required>
                                            <option value="">Select Product</option>
                                            {/* (productMapping[formData.itemName] || []) මඟින් error එක වළක්වා ඇත */}
                                            {(productMapping[formData.itemName] || []).map(prod => (
                                                <option key={prod} value={prod}>{prod}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="input-group">
                                        <label>{activeTab === 'Inward' ? "Supplier" : "Customer"}</label>
                                        <input type="text" value={formData.partyName} onChange={(e) => setFormData({...formData, partyName: e.target.value})} required />
                                    </div>
                                    <div className="input-group">
                                        <label>Quantity (kg)</label>
                                        <input type="number" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})} required />
                                    </div>
                                </div>
                                <button type="submit" className="form-add-btn">{editId ? 'Save' : `Add ${activeTab} Record`}</button>
                            </form>

                            <div className="stock-tables-grid">
                                {items.map(item => renderTable(item))}
                            </div>
                        </>
                    )}

                    {activeTab === 'Reports' && (
                        <div className="reports-section">
                            <div className="report-header-flex">
                                <h3>Stock Analysis ({unit})</h3>
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
                                        <h4>{formatWeight(getBalance(item))} <span>{unit}</span></h4>
                                    </div>
                                ))}
                            </div>
                            <div className="charts-container">
                                {items.map(item => (
                                    <div className="chart-wrapper-card" key={item}>
                                        <h5>{item} Trend ({unit})</h5>
                                        <ResponsiveContainer width="100%" height={250}>
                                            <LineChart data={getChartData(item)}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                                <XAxis dataKey="period" stroke="#64748b" fontSize={12} />
                                                <YAxis stroke="#64748b" fontSize={12} />
                                                <Tooltip contentStyle={{ borderRadius: '10px', border: 'none' }} />
                                                <Legend iconType="circle" />
                                                <Line type="monotone" dataKey="inward" stroke="#008080" strokeWidth={3} dot={{r: 5, fill: "#008080"}} name={`Inward (${unit})`} />
                                                <Line type="monotone" dataKey="outward" stroke="#1C39BB" strokeWidth={3} dot={{r: 5, fill: "#1C39BB"}} name={`Outward (${unit})`} />
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