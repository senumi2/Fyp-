import React from "react";
import herobg from "../images/hero-bg.jpg";
import "./Hero.css";

function Hero() {
  return (
    <section
     className="hero-container"
     style={{ backgroundImage: `url(${herobg})` }}
     >
      <div className="hero-overlay"></div>

     {/* Shadow Box With Text */}
      <div className="hero-content">
        <h2 className="hero-title">Welcome to </h2>
        <h1 className="hero-title">NATIONAL SALT LIMITED</h1>
        <p className="hero-subtitle">
          Goverment owned company under the purview of Ministry of Industry and Entrepreneurship  Development
        </p>
      </div>
    
    </section>
  );
}

export default Hero;
