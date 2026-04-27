import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "./AdminPaymentHistory.css";

function AdminPaymentHistory() {
  const { token } = useContext(AuthContext);
  const [payments, setPayments] = useState([]); // Default empty array
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/orders/all-payments", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        
        // Essential: Check if data is array
        if (Array.isArray(data)) {
            setPayments(data);
        } else {
            setPayments([]);
        }
      } catch (err) {
        console.error("Error fetching payments:", err);
        setPayments([]); 
      }
    };
    if(token) fetchPayments();
  }, [token]);

  // Safe filtering logic
  const filteredPayments = Array.isArray(payments) ? payments.filter((p) => {
    const nameMatch = p.userId?.name?.toLowerCase() || "";
    const idMatch = p._id || "";
    
    const matchesSearch = 
      nameMatch.includes(searchTerm.toLowerCase()) ||
      idMatch.includes(searchTerm);
    const matchesStatus = statusFilter === "All" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) : [];

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPayments = filteredPayments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage) || 1;

  const totalRevenue = Array.isArray(payments) ? payments.reduce((sum, p) => p.status === "Paid" ? sum + p.amount : sum, 0) : 0;
  const successCount = Array.isArray(payments) ? payments.filter(p => p.status === "Paid").length : 0;
  const pendingCount = Array.isArray(payments) ? payments.filter(p => p.status === "Pending").length : 0;

  const exportToCSV = () => {
    const headers = ["Order ID,Customer,Email,Date,Method,Amount,Status\n"];
    const rows = filteredPayments.map(p => 
      `${p._id},${p.userId?.name},${p.userId?.email},${new Date(p.date).toLocaleDateString()},${p.paymentMethod},${p.amount},${p.status}`
    );
    const blob = new Blob([headers + rows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Payment_Report_${new Date().toLocaleDateString()}.csv`;
    a.click();
  };

  return (
    <div className="admin-payments-page">
      <div className="overlay-gradient"></div>
      <div className="content-wrapper">
        <header className="header-creative">
          <div className="header-text">
            <h1>Financial Insights</h1>
            <p>Comprehensive overview of saltern revenue & transactions</p>
          </div>
          <button className="btn-export" onClick={exportToCSV}>📥 Export CSV Report</button>
        </header>

        <section className="summary-cards-grid">
          <div className="stat-card">
            <span className="stat-label">Total Revenue</span>
            <h2 className="stat-val">Rs. {totalRevenue.toLocaleString()}</h2>
          </div>
          <div className="stat-card">
            <span className="stat-label">Successful Payments</span>
            <h2 className="stat-val">{successCount}</h2>
          </div>
          <div className="stat-card">
            <span className="stat-label">Pending Orders</span>
            <h2 className="stat-val">{pendingCount}</h2>
          </div>
        </section>

        <section className="filter-bar-container modern-glass-card">
          <input 
            type="text" 
            placeholder="Search by Customer or Order ID..." 
            className="search-input-main"
            onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
          />
          <select className="filter-select" onChange={(e) => {setStatusFilter(e.target.value); setCurrentPage(1);}}>
            <option value="All">All Statuses</option>
            <option value="Paid">Paid Only</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </section>

        <section className="table-section-creative modern-glass-card">
          <table className="payment-history-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer Name</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {currentPayments.map((p) => (
                <tr key={p._id}>
                  <td className="id-cell">#{p._id.substring(18)}</td>
                  <td>
                    <div className="cust-info">
                      <strong>{p.userId?.name}</strong>
                      <small>{p.userId?.email}</small>
                    </div>
                  </td>
                  <td>{new Date(p.date).toLocaleString()}</td>
                  <td className="amount-bold">Rs. {p.amount.toLocaleString()}</td>
                  <td><span className={`status-pill ${p.status.toLowerCase()}`}>{p.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination-footer">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>Prev</button>
            <span>Page {currentPage} of {totalPages}</span>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)}>Next</button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AdminPaymentHistory;