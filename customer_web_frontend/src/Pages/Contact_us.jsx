import React from "react";
import {Link} from "react-router-dom";
import "./Contact_us.css";

function Contact_us() {
    return(
        <div className="contact-page">
            <div className="contact-container">


        {/*left side form*/}
        <div className="contact-container-left">
      <div className="contact-header">
        Get In Touch With Us Now
      </div>

      <div className="contact-grid">
        {/* Phone */}
        <div className="contact-box light">
          <div className="icon">📞</div>
          <h4>Phone Number</h4>
          <p>+94 256 2395</p>
        </div>

        {/* Email */}
        <div className="contact-box">
          <div className="icon">✉️</div>
          <h4>E-mail</h4>
          <p className="link">info@lankasalt.lk</p>
        </div>

        {/* Location */}
        <div className="contact-box">
          <div className="icon">📍</div>
          <h4>Location</h4>
          <p>
            Lanka salt limited,<br />
            Mahalewaya,<br />
            Hambanthota,<br />
            Sri Lanka.
          </p>
        </div>

        {/* Working Hours */}
        <div className="contact-box light">
          <div className="icon">🕒</div>
          <h4>Working Hours</h4>
          <p>
            Monday to Friday<br />
            8.30 a.m. - 16.30 p.m.
          </p>
          <p className="closed">
            Saturday to Sunday<br />
            Close
          </p>
        </div>
      </div>
    </div>
  

        {/*Right side form*/}
        <div className="contact-form">
            <h2>Contact Us</h2>
            <form>
                <label>Name</label>
                <input type="text" placeholder="Enter your name" required/>

                <label>E-mail</label>
                <input type="text" placeholder="Enter your E-mail" required/>

                <label>Subject</label>
                <input type="text" placeholder="Enter subject" required/>

                <label>Message</label>
                <textarea placeholder="Write your message..." required></textarea>

                <button type="Submit">Submit</button>

            </form>
        </div>

        
            </div>
        </div>
    )
}

export default Contact_us;