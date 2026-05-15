import React from "react";
import { FaFacebook, FaInstagram, FaTwitter, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import "./Footer.css";

function Footer() {
  
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* About Section */}
        <div className="footer-column about">
          <h3 className="footer-title">National Salt Limited</h3>
          <div className="info-row">
            <FaMapMarkerAlt className="footer-icon" />
            <p>Mahaweliyaya, Hambantota, Sri Lanka</p>
          </div>
          <p className="footer-desc">
            The leading salt supplier in Sri Lanka, committed to purity and excellence in every grain.
          </p>
        </div>

        {/* Contact Section */}
        <div className="footer-column center">
          <h3 className="footer-title">Contact Us</h3>
          <div className="contact-links">
            <div className="contact-row">
              <FaEnvelope className="footer-icon" />
              <a href="mailto:info@lankasalt.lk">info@lankasalt.lk</a>
            </div>
            <div className="contact-row">
              <FaPhoneAlt className="footer-icon" />
              <a href="tel:+945269632">+94 526 9632</a>
            </div>
          </div>

          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noreferrer"><FaFacebook /></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer"><FaInstagram /></a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer"><FaTwitter /></a>
          </div>
        </div>

        <div className="footer-column links">
          <h3 className="footer-title">Quick Links</h3>
          <nav className="footer-nav">
            
            <button className="scroll-link" onClick={() => scrollToSection("events-section")}>Upcoming Events</button>
            <button className="scroll-link" onClick={() => scrollToSection("reports-section")}>Official Reports</button>
            <button className="scroll-link" onClick={() => scrollToSection("board-section")}>Board of Directors</button>
          </nav>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="bottom-content">
          <span>© {new Date().getFullYear()} National Salt Limited. All rights reserved.</span>
          <div className="bottom-links">
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;