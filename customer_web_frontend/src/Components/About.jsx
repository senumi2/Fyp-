import React from "react";
import "./About.css";
import saltImg from "../images/Lanka-Salt.jpg";
import { FiTarget, FiAward, FiTrendingUp } from "react-icons/fi";
import { useInView } from "react-intersection-observer";

function About() {
  
  const { ref: storyRef, inView: storyVisible } = useInView({
    triggerOnce: true,
    threshold: 0.4,
  });

  const { ref: cardsRef, inView: cardsVisible } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  return (
    <div className="about-page-wrapper">
      {/* SECTION 1: OUR STORY */}
      <section className="story-section" ref={storyRef}>
        <div className={`story-container animate-fade ${storyVisible ? "show" : ""}`}>
          <div className="story-left">
            <h2>OUR STORY</h2>
            <p>
              National Salt Ltd. has a long history in salt production in Sri Lanka.
              It manufactures common salt, iodine mixed salt, crush salt, and 
              Industrial salt. The major production areas are located in Mannar and
              Elephantpass (Kilinochchi) District, and its administrative office located 
              in Colombo.
            </p>
            <p>
              The salt department was started in 1938 and went through 
              different administrative control and finally it was named as National
              Salt Ltd from 2001. In June 2021 it is renamed as National Salt Limited.
            </p>
            <p>
              National Salt Limited is trying to ensure that Sri Lanka is self-sufficient in the salt 
              production in year 2026.
            </p>
          </div>

          <div className="story-right">
            <img src={saltImg} className="story-img" alt="Salt Production" />
          </div>
        </div>
      </section>

      {/* SECTION 2: VISION, MISSION, VALUES */}
      <section className="about-cards-section" ref={cardsRef}>
        <div className="about-bg-elements">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
        </div>

        <div className="about-container">
          <div className="about-header-text">
            <span className="sub-title">GET TO KNOW US</span>
            <h1>Quality Salt for Every Home</h1>
          </div>

          <div className={`about-grid ${cardsVisible ? "visible" : ""}`}>
            {/* Vision Card */}
            <div className="about-card animate-up">
              <div className="card-icon-box">
                <FiTarget />
              </div>
              <h2>Our Vision</h2>
              <div className="card-line"></div>
              <p>
                To be the leading provider of high-quality salt products in Sri Lanka
                and the region, recognized for our commitment to excellence.
              </p>
            </div>

            {/* Mission Card */}
            <div className="about-card highlight animate-up delay-1">
              <div className="card-icon-box gold">
                <FiAward />
              </div>
              <h2>Our Mission</h2>
              <div className="card-line"></div>
              <p>
                At Lanka Salt, our mission is to produce and distribute salt products
                that meet the highest standards of quality and safety.
              </p>
            </div>

            {/* Values Card */}
            <div className="about-card animate-up delay-2">
              <div className="card-icon-box">
                <FiTrendingUp />
              </div>
              <h2>Our Values</h2>
              <div className="card-line"></div>
              <p>
                Sustainability, integrity, and social responsibility are at the core
                of our operations for the environments we serve.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;