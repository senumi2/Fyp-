import React from "react";
import "./About.css";

function About() {
  return (
    <section className="about-section">
      <div className="about-container">
        
        <div className="about-card">
          <h2>Our Vision</h2>
          <p>
            To be the leading provider of high-quality salt products in Sri Lanka
            and the region, recognized for our commitment to excellence,
            innovation, and customer satisfaction.
          </p>
        </div>

        <div className="about-card highlight">
          <h2>Our Mission</h2>
          <p>
            At Lanka Salt, our mission is to produce and distribute salt products
            that meet the highest standards of quality and safety while providing
            exceptional value. We achieve this through investing in advanced
            technologies, collaborating with partners, and continuously improving
            our processes to meet the evolving needs of our customers.
          </p>
        </div>

      </div>
    </section>
  );
}

export default About;
