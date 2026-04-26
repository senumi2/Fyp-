import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './AdminHarvestManagement.css';

const AdminHarvestManagement = () => {
    const [harvestData, setHarvestData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('management');
    const [searchTerm, setSearchTerm] = useState('');
    const [unit, setUnit] = useState('kg');

    const categories = ['Salt Harvest', 'Jipsum Harvest', 'Artimiya Harvest', 'Agriculture Salt Harvest'];

    useEffect(() => {
        const fetchHarvests = async () => {
            setLoading(true);
            try {
                const res = await axios.get('http://localhost:5000/api/harvest');
                setHarvestData(res.data || []);
            } catch (err) {
                console.error("Fetch Error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchHarvests();
    }, []);

    const formatVal = (val) => unit === 'kg' ? val : val / 1000;

    const stats = useMemo(() => {
        let total = 0;
        let catTotals = {};
        harvestData.forEach(c => {
            const sum = c.records ? c.records.reduce((acc, r) => acc + r.quantity, 0) : 0;
            total += sum;
            catTotals[c.category] = sum;
        });
        const highest = Object.keys(catTotals).length ? Object.keys(catTotals).reduce((a, b) => catTotals[a] > catTotals[b] ? a : b) : 'N/A';
        return { total, highest };
    }, [harvestData]);

    if (loading) return <div className="loader-box"><div className="spin"></div><p>SALTERN ERP Loading...</p></div>;

    return (
        <div className="harvest-main-wrapper">
            {/* SCOPED MINI SIDEBAR */}
            <aside className="harvest-sidebar-mini">
                <div className="harvest-mini-logo" title="Saltern ERP Harvest Section">🧂</div>
                
                <nav className="harvest-mini-nav">
                    <button 
                        className={activeTab === 'management' ? 'active' : ''} 
                        onClick={() => setActiveTab('management')}
                        title="Harvest Management"
                    >
                        📋
                    </button>
                    <button 
                        className={activeTab === 'tracking' ? 'active' : ''} 
                        onClick={() => setActiveTab('tracking')}
                        title="Harvest Analytics"
                    >
                        📈
                    </button>

                    <div className="h-divider"></div>
                    
                    <div className="h-unit-toggle" title={`Unit: ${unit.toUpperCase()}`}>
                        <span className={unit === 'kg' ? 'h-active-u' : ''}>K</span>
                        <label className="h-switch">
                            <input type="checkbox" checked={unit === 'tons'} onChange={() => setUnit(unit === 'kg' ? 'tons' : 'kg')} />
                            <span className="h-slider h-round"></span>
                        </label>
                        <span className={unit === 'tons' ? 'h-active-u' : ''}>T</span>
                    </div>
                    
                    <div className="h-divider"></div>
                </nav>
            </aside>

            <main className="harvest-content-area">
                <header className="h-dashboard-header">
                    <div className="h-stat-box h-yellow">
                        <span>Monthly Total ({unit})</span>
                        <h2>{formatVal(stats.total).toLocaleString(undefined, {minimumFractionDigits: 2})}</h2>
                    </div>
                    <div className="h-stat-box h-persian">
                        <span>Top Category</span>
                        <h2 style={{fontSize: '1.2rem'}}>{stats.highest}</h2>
                    </div>
                    <div className="h-stat-box h-teal">
                        <span>Data Status</span>
                        <h2>VERIFIED</h2>
                    </div>
                </header>

                {activeTab === 'management' && (
                    <div className="h-fade-in">
                        <div className="h-category-nav">
                            {categories.map(cat => (
                                <a key={cat} href={`#${cat.replace(/\s+/g, '')}`} className="h-nav-pill">{cat}</a>
                            ))}
                        </div>

                        <div className="h-search-container">
                            <input 
                                type="text" 
                                placeholder="Filter harvest types..." 
                                className="h-admin-search"
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {categories.map(cat => {
                            const categoryObj = harvestData.find(h => h.category === cat);
                            let records = categoryObj ? categoryObj.records.filter(r => 
                                r.type.toLowerCase().includes(searchTerm.toLowerCase())
                            ).reverse() : [];

                            return (
                                <section key={cat} id={cat.replace(/\s+/g, '')} className="h-table-card">
                                    <h3>{cat}</h3>
                                    <div className="h-table-wrapper">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Date</th>
                                                    <th>Type</th>
                                                    <th>Qty ({unit})</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {records.length > 0 ? records.map((r) => (
                                                    <tr key={r._id}>
                                                        <td>{new Date(r.date).toLocaleDateString()}</td>
                                                        <td><span className="h-type-tag">{r.type}</span></td>
                                                        <td className="h-bold">{formatVal(r.quantity).toLocaleString()}</td>
                                                    </tr>
                                                )) : (
                                                    <tr><td colSpan="3" style={{textAlign:'center', padding:'15px', color:'#999'}}>No records.</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </section>
                            );
                        })}
                    </div>
                )}

                {activeTab === 'tracking' && (
                    <div className="h-analytics-view h-fade-in">
                        <h2 className="h-section-title">Production Analytics ({unit.toUpperCase()})</h2>
                        <div className="h-chart-grid">
                            {categories.map(cat => {
                                const found = harvestData.find(h => h.category === cat);
                                const chartData = found ? found.records.map(r => ({
                                    date: new Date(r.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
                                    qty: formatVal(r.quantity)
                                })) : [];

                                return (
                                    <div key={cat} className="h-chart-card">
                                        <h4>{cat}</h4>
                                        <ResponsiveContainer width="100%" height={220}>
                                            <AreaChart data={chartData}>
                                                <XAxis dataKey="date" />
                                                <YAxis />
                                                <Tooltip />
                                                <Area type="monotone" dataKey="qty" stroke="#00A693" fill="#00A693" fillOpacity={0.1} />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminHarvestManagement;