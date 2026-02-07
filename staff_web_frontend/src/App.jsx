import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import Hero from "./Components/Hero";
import About from "./Components/About";
import Events from "./Components/Event";
import Directors from "./Components/Directors";
import Footer from "./Components/Footer";
import Login from "./Pages/Login";
import Register from "./Pages/Register";




import "./App.css";


function App() {
  return (
    <Router>
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