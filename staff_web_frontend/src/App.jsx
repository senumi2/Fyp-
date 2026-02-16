import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./Components/Navbar";
import Hero from "./Components/Hero";
import About from "./Components/About";
import Events from "./Components/Events";
import Directors from "./Components/Directors";
import Footer from "./Components/Footer";
import AdminDirectors from "./Components/AdminDirectors";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Reports from "./Pages/Reports";
import Profile from "./Pages/Profile";

import EqupmentUsage from "./Components/EqupmentUsage";


import Inventory from "./Pages/Inventory";
import Issues from "./Pages/Issues";
import Maintenance from "./Pages/Maintenance";

import "./App.css";


function App() {
  return (
    
    <>
      <Navbar />

      <Routes>
        <Route 
          path="/" 
          element={
            <>
              <Hero />
              <About />
              <Events />
              <Reports />
              <Directors />
            </>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/About" element={<About />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin/directors" element={<AdminDirectors />} />
            
            <Route path="/" element={<Inventory />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/issues" element={<Issues />} />
            <Route path="/maintenance" element={<Maintenance />} />

        <Route path="/equpmentUsage" element={<EqupmentUsage />} />
         </Routes>


         <Footer />
      </>
    
  );
}

export default App;                            