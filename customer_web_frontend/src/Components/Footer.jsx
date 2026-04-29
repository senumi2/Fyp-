import React from "react";
import { HashLink as Link } from "react-router-hash-link";
import { FaFacebookF, FaInstagram, FaTwitter, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* About Section */}
        <div className="footer-column about-section">
          <h3 className="footer-logo">National Salt <span>Limited</span></h3>
          <p className="address-text">
            <FaMapMarkerAlt className="inline-icon" /> Mahaweiliyaya, Hambantota,<br />
            Sri Lanka.
          </p>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-icon">
              <FaFacebookF />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-icon">
              <FaInstagram />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-icon">
              <FaTwitter />
            </a>
          </div>
        </div>

        {/* Quick Links Section */}
        <div className="footer-column links-section">
          <h3>Quick Links</h3>
          <nav className="footer-nav">
            <Link smooth to="/#products">Our Products</Link>
            <Link smooth to="/#events">Upcoming Events</Link>
            <Link smooth to="/#directors">Board of Directors</Link>
          </nav>
        </div>

        {/* Contact Section */}
        <div className="footer-column contact-section">
          <h3>Contact Us</h3>
          <div className="contact-links">
            <a href="mailto:info@lankasalt.lk" className="contact-item">
              <FaEnvelope className="icon" /> info@lankasalt.lk
            </a>
            <a href="tel:+945269632" className="contact-item">
              <FaPhoneAlt className="icon" /> +94 47 526 9632
            </a>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} National Salt Limited. Developed with Excellence.</p>
      </div>
    </footer>
  );
}

export default Footer;