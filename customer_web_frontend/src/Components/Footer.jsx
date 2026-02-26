import React from "react";
import { HashLink as Link } from "react-router-hash-link";
import fbImg from "../images/fb.jpg";
import instaImg from "../images/insta.jpg";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        
        <div className="footer-column about-section">
          <h3 className="footer-logo">National Salt <span>Limited</span></h3>
          <p className="address-text">
            Mahaweiliyaya, Hambantota<br />
            Sri Lanka
          </p>
        </div>

        
        <div className="footer-column contact-section">
          <h3>Contact Us</h3>
          <div className="contact-links">
            <a href="mailto:info@lankasalt.lk" className="contact-item">
              <span className="icon">✉️</span> info@lankasalt.lk
            </a>
            <a href="tel:+945269632" className="contact-item">
              <span className="icon">📞</span> +94 526 9632
            </a>
          </div>
          
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
              <img src={fbImg} alt="FB" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
              <img src={instaImg} alt="Insta" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter">
              <img src="/twitter.png" alt="Twitter" />
            </a>
          </div>
        </div>


        <div className="footer-column links-section">
          <h3>Quick Links</h3>
          <nav className="footer-nav">
           
            <Link smooth to="/#products">Products</Link>
            <Link smooth to="/#events">Events</Link>
            <Link smooth to="/#directors">Directors</Link>
          </nav>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} National Salt Limited. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;