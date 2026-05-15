import React, { useEffect, useState } from "react";
import "./Reports.css";

function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/reports")
      .then((res) => res.json())
      .then((data) => {
        setReports(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching reports:", err);
        setLoading(false);
      });
  }, []);

 
  const openPdf = (pdfUrl) => {
    if (pdfUrl) {
      window.open(`http://localhost:5000${pdfUrl}`, "_blank", "noopener,noreferrer");
    } else {
      alert("PDF file not found for this report.");
    }
  };

  return (
    <section className="reports-section" id="reports-section">
      <div className="reports-container">
        <h2 className="section-title">Annual Reports</h2>
        <div className="title-bar"></div>
        
        {loading ? (
          <div className="loading">Loading reports...</div>
        ) : reports.length > 0 ? (
          <div className="reports-grid">
            {reports.map((report) => (
              <div key={report._id} className="report-card">
                <div className="report-image-wrapper">
                  <img 
                    src={`http://localhost:5000${report.imageUrl}`} 
                    alt={report.title} 
                    className="report-card-img" 
                  />
                 
                </div>
                <div className="report-card-content">
                  <h3>{report.title}</h3>
                  <button 
                    className="view-btn" 
                    onClick={() => openPdf(report.pdfUrl)}
                  >
                    View Report
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="loading">No reports available at the moment.</div>
        )}
      </div>
    </section>
  );
}

export default Reports;