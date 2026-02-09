import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Left */}
        <div className="footer-column">
          <h3>National Salt Limited</h3>
          <p>Mahawe­liyaya, Hambantota</p>
          <p>Sri Lanka</p>
        </div>

        {/* Center */}
        <div className="footer-column center">
          <h3>Contact</h3>

          <div className="contact-row">
            <span className="icon">✉️</span>
            <a href="mailto:info@lankasalt.lk">
              info@lankasalt.lk
            </a>
          </div>

          <div className="contact-row">
            <span className="icon">📞</span>
            <a href="tel:+945269632">
              +94 526 9632
            </a>
          </div>

          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noreferrer">
              <img src="/fb.png" alt="Facebook" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              <img src="/insta.png" alt="Instagram" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer">
              <img src="/twitter.png" alt="Twitter" />
            </a>
          </div>
        </div>

        {/* Right */}
        <div className="footer-column">
          <h3>Quick Links</h3>

          {/* 🔥 React router links */}
          <Link to="/products">Products</Link>
          <Link to="/events">Events</Link>
          <Link to="/board">Board</Link>
          <Link to="/downloads">Downloads</Link>
        </div>

      </div>

      <div className="footer-bottom">
        © National Salt Limited. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
