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
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="loading">Loading reports...</p>;
  }

  return (
    <div className="reports-page">
      <h1 className="reports-title">System Reports</h1>

      <div className="reports-grid">
        {reports.map((report) => (
          <div className="report-card" key={report._id}>
            <h2>{report.title}</h2>
            <p className="category">{report.category}</p>
            <p className="description">{report.description}</p>
            <span className="date">
              {new Date(report.createdAt).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Reports;
