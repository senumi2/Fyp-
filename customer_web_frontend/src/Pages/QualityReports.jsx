import React from "react";
import "./QualityReports.css";
import { FiCheckCircle, FiShield, FiFileText, FiDownload } from "react-icons/fi";

function QualityReports() {
  const generalStandards = [
    { label: "NaCl (Sodium Chloride)", value: "96% - 98%", desc: "High purity level for safe consumption." },
    { label: "Iodine Content", value: "20 - 30 ppm", desc: "Strictly maintained as per SLS standards." },
    { label: "Moisture Content", value: "< 0.5%", desc: "Ensures long shelf life and free-flowing nature." },
    { label: "Insolubles", value: "< 0.1%", desc: "Extremely low impurities for crystal clear quality." }
  ];

  return (
    <div className="quality-page-wrapper">
      <div className="quality-container">
        
        {/* Header */}
        <div className="quality-hero">
          <h1>Our Quality Commitment</h1>
          <p>National Salt Ltd ensures that every grain of salt produced meets the highest national and international safety standards.</p>
        </div>

        {/* Standards Grid */}
        <div className="standards-grid">
          {generalStandards.map((std, index) => (
            <div key={index} className="standard-card">
              <FiShield className="std-icon" />
              <h3>{std.label}</h3>
              <div className="std-value">{std.value}</div>
              <p>{std.desc}</p>
            </div>
          ))}
        </div>

        {/* Process Section */}
        <div className="process-section">
          <h2>How We Ensure Quality?</h2>
          <div className="process-steps">
            <div className="step">
              <span className="step-num">01</span>
              <h4>Solar Evaporation</h4>
              <p>Natural sea water is evaporated using solar energy in protected salterns.</p>
            </div>
            <div className="step">
              <span className="step-num">02</span>
              <h4>Triple Washing</h4>
              <p>Raw salt is washed multiple times to remove natural impurities and sand.</p>
            </div>
            <div className="step">
              <span className="step-num">03</span>
              <h4>Iodization</h4>
              <p>Precise amounts of Potassium Iodate are added to prevent Iodine Deficiency Disorders.</p>
            </div>
          </div>
        </div>

        {/* Certifications / Downloads */}
        <div className="cert-section">
          <h2>Official Certifications</h2>
          <div className="cert-list">
            <div className="cert-item">
              <FiFileText className="cert-icon" />
              <div>
                <h4>SLS 79:2020 Standard</h4>
                <p>Compliance certificate for edible common salt.</p>
              </div>
              <button className="view-btn"><FiDownload /> View Certificate</button>
            </div>
            <div className="cert-item">
              <FiFileText className="cert-icon" />
              <div>
                <h4>ISO 22000:2018</h4>
                <p>Food Safety Management System certification.</p>
              </div>
              <button className="view-btn"><FiDownload /> View Certificate</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default QualityReports;