import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "./AdminReports.css";

function AdminReports() {
  const { token } = useContext(AuthContext);
  const [reports, setReports] = useState([]);
  const [form, setForm] = useState({ title: "", image: null });
  const [editingId, setEditingId] = useState(null);

  const fetchReports = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/reports");
      const data = await res.json();
      setReports(data);
    } catch (err) {
      console.error("Error fetching reports:", err);
    }
  };

  useEffect(() => { fetchReports(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", form.title);
    if (form.image) data.append("image", form.image);

    const url = editingId 
      ? `http://localhost:5000/api/reports/${editingId}` 
      : "http://localhost:5000/api/reports";
    const method = editingId ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { Authorization: `Bearer ${token}` },
      body: data
    });

    setForm({ title: "", image: null });
    setEditingId(null);
    fetchReports();
  };

  const handleEdit = (report) => {
    setForm({ title: report.title, image: null });
    setEditingId(report._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;
    await fetch(`http://localhost:5000/api/reports/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchReports();
  };

  return (
    <div className="admin-reports-wrapper">
      <header className="reports-header-main">
        <h2>{editingId ? "Update Report" : "System Reports"}</h2>
        <p>Manage and view all documentation from here</p>
      </header>

      {/* Modern Compact Form */}
      <section className="report-form-section">
        <form onSubmit={handleSubmit} className="report-form-inline">
          <div className="report-field">
            <label>Report Title</label>
            <input 
              type="text" 
              placeholder="Enter report title..." 
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })} 
              required 
            />
          </div>
          <div className="report-field">
            <label>Upload File / Image</label>
            <input 
              type="file" 
              className="file-input-box"
              onChange={(e) => setForm({ ...form, image: e.target.files[0] })} 
              required={!editingId}
            />
          </div>
          <div className="form-actions">
            <button type="submit" className={`report-btn ${editingId ? 'update-btn' : 'add-btn'}`}>
              {editingId ? "Save Changes" : "Upload"}
            </button>
            {editingId && (
              <button type="button" className="cancel-btn-alt" onClick={() => { setEditingId(null); setForm({ title: "", image: null }); }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      {/* Grid - 3 Items Per Row */}
      <div className="reports-grid-admin">
        {reports.map((report) => (
          <div key={report._id} className="report-item-card">
            {/* Clickable Area to View Report */}
            <a href={`http://localhost:5000${report.imageUrl}`} target="_blank" rel="noopener noreferrer" className="report-click-area">
              <div className="report-thumb">
                <img src={`http://localhost:5000${report.imageUrl}`} alt={report.title} />
                <div className="view-overlay-text">
                   <span>VIEW FULL REPORT</span>
                </div>
              </div>
            </a>
            
            <div className="report-item-info">
              <h4>{report.title}</h4>
              <div className="report-item-controls">
                <button className="ctrl-edit" onClick={() => handleEdit(report)}>Edit</button>
                <button className="ctrl-del" onClick={() => handleDelete(report._id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminReports;