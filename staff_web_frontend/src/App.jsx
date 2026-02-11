import React from "react";
import { Routes, Route } from "react-router-dom";


import Hero from "./Components/Hero";
import About from "./Components/About";
import Events from "./Components/Event";
import Directors from "./Components/Directors";
import Footer from "./Components/Footer";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Reports from "./Pages/Reports";

import EqupmentUsageSidebar from "./Components/EqupmentUsageSidebar";
import Inventory from "./Pages/Inventory";
import ReportIssues from "./Pages/ReportIssues";
import MaintenanceLogs from "./Pages/MaintenanceLogs";

import "./App.css";


function App() {
  return (
    <>
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
         </Routes>


         
      <EqupmentUsageSidebar />
      <Routes>
        <Route path="/" element={<Inventory />} />
        <Route path="/issues" element={<ReportIssues />} />
        <Route path="/maintenance" element={<MaintenanceLogs />} />
      </Routes>
    



      <Footer />
    </>
  );
}

export default App;                            