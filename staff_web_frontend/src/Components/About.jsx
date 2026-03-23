import React from "react";
import "./About.css";
import { FiTarget, FiAward, FiTrendingUp } from "react-icons/fi";
import { useInView } from "react-intersection-observer";

function About() {
  // Intersection Observer options
  const { ref, inView } = useInView({
    triggerOnce: true, 
    threshold: 0.2,    
  });

  return (
    <section className="about-section">
      <div className="about-bg-elements">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      <div className="about-container">
        <div className="about-header-text">
          <span className="sub-title">GET TO KNOW US</span>
          <h1>Quality Salt for Every Home</h1>
        </div>

        
        <div className={`about-grid ${inView ? "visible" : ""}`} ref={ref}>
          {/* Vision Card */}
          <div className="about-card animate-up">
            <div className="card-icon-box">
              <FiTarget />
            </div>
            <h2>Our Vision</h2>
            <div className="card-line"></div>
            <p>
              To be the leading provider of high-quality salt products in Sri Lanka
              and the region, recognized for our commitment to excellence,
              innovation, and customer satisfaction.
            </p>
          </div>

          {/* Mission Card (Highlighted) */}
          <div className="about-card highlight animate-up delay-1">
            <div className="card-icon-box gold">
              <FiAward />
            </div>
            <h2>Our Mission</h2>
            <div className="card-line"></div>
            <p>
              At Lanka Salt, our mission is to produce and distribute salt products
              that meet the highest standards of quality and safety while providing
              exceptional value. We achieve this through investing in advanced
              technologies and collaborating with partners.
            </p>
          </div>

          {/* Strategy Card  */}
          <div className="about-card animate-up delay-2">
            <div className="card-icon-box">
              <FiTrendingUp />
            </div>
            <h2>Our Values</h2>
            <div className="card-line"></div>
            <p>
              Sustainability, integrity, and social responsibility are at the core
              of our operations, ensuring that we contribute positively to the
              communities and environments we serve.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;