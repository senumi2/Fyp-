import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "./AdminReports.css";

function AdminReports() {
  const { token } = useContext(AuthContext);
  const [reports, setReports] = useState([]);
  const [form, setForm] = useState({ title: "", image: null, pdf: null });
  const [editingId, setEditingId] = useState(null);

  const fetchReports = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/reports");
      const data = await res.json();
      if (Array.isArray(data)) setReports(data);
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
    if (form.pdf) data.append("pdf", form.pdf);

    const url = editingId 
      ? `http://localhost:5000/api/reports/${editingId}` 
      : "http://localhost:5000/api/reports";
    const method = editingId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { 
          'Authorization': `Bearer ${token}` 
        },
        body: data
      });

      const result = await response.json();

      if (response.ok) {
        alert(editingId ? "Report updated!" : "Report uploaded!");
        setForm({ title: "", image: null, pdf: null });
        setEditingId(null);
        fetchReports();
      } else {
       
        alert(`Error: ${result.message || "Something went wrong"}`);
        if (response.status === 401) console.error("Session expired. Please re-login.");
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("Network error. Please try again.");
    }
  };

  const handleEdit = (report) => {
    setForm({ title: report.title, image: null, pdf: null });
    setEditingId(report._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const response = await fetch(`http://localhost:5000/api/reports/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) fetchReports();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="admin-reports-wrapper">
      <header className="reports-header-main">
        <h2>{editingId ? "Update Report" : "System Reports"}</h2>
        <p>Upload a cover image and the corresponding PDF document</p>
      </header>

      <section className="report-form-section">
        <form onSubmit={handleSubmit} className="report-form-inline">
          <div className="report-field">
            <label>Report Title</label>
            <input 
              type="text" 
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })} 
              required 
            />
          </div>
          
          <div className="report-field">
            <label>Cover Image (Thumbnail)</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => setForm({ ...form, image: e.target.files[0] })} 
              required={!editingId}
            />
          </div>

          <div className="report-field">
            <label>PDF Document</label>
            <input 
              type="file" 
              accept=".pdf"
              onChange={(e) => setForm({ ...form, pdf: e.target.files[0] })} 
              required={!editingId}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className={`report-btn ${editingId ? 'update-btn' : 'add-btn'}`}>
              {editingId ? "Save Changes" : "Upload Report"}
            </button>
            {editingId && (
              <button type="button" className="cancel-btn-alt" onClick={() => { setEditingId(null); setForm({ title: "", image: null, pdf: null }); }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <div className="reports-grid-admin">
        {reports.map((report) => (
          <div key={report._id} className="report-item-card">
            <a 
              href={`http://localhost:5000${report.pdfUrl}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="report-click-area"
            >
              <div className="report-thumb">
                <img src={`http://localhost:5000${report.imageUrl}`} alt={report.title} />
                <div className="view-overlay-text">
                    <span>OPEN PDF</span>
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