import React, { useEffect, useState } from "react";
import "./Reports.css";

function Reports() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/reports")
      .then((res) => res.json())
      .then((data) => setReports(data))
      .catch((err) => console.error("Error fetching reports:", err));
  }, []);

  return (
    <section className="reports-section">
      <div className="reports-container">
        <h2 className="section-title">System Reports</h2>
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
                <button className="view-btn">View Report</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


export default Reports;