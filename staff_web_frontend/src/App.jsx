import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import Hero from "./components/Hero";
import About from "./components/About";
import Events from "./components/Events";
import Directors from "./components/Directors";
import Footer from "./components/Footer";



import "./App.css";


function App() {
  return (
    <Router>
      {/* Navbar always visible */}
      

      {/* Page Content */}
      <Routes>
        <Route 
          path="/" 
          element={
            <>
              <Hero />
              <About />
              <Events />
              <Directors />
            </>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/About" element={<About />} />
        
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;                            