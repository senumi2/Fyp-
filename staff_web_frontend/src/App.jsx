import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

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
import StaffLogin from "./Components/StaffLogin";
import AdminDashboard from "./Components/AdminDashboard";
import DriverDashboard from "./Pages/DriverDashboard";
import ManageOrders from "./Pages/ManageOrders";

import EqupmentUsage from "./Components/EqupmentUsage";
import InventoryManagement from "./Components/InventoryManagement";
import PondsManagement from "./Components/PondsManagement";
import HarvestManagement from "./Components/HarvestManagement";
import ExpensesFinance from "./Components/ExpensesFinance";

import Inventory from "./Pages/Inventory";
import Issues from "./Pages/Issues";
import Maintenance from "./Pages/Maintenance";
import WeatherDashboard from "./Components/WeatherDashboard";

import "./App.css";

function App() {

  const location = useLocation();

  // Pages that do not need to display the footer
  const excludeFooterPaths = [
    "/login", 
    "/register", 
    "/adminDashboard", 
    "/driverDashboard",
    "/equpmentUsage",
    "/inventoryManagement",
    "/pondsManagement",
    "/harvestManagement",
    "/expensesFinance",
    "/admin/directors",
    "/staff",
    "/profile",

  ];

  
  const shouldShowFooter = !excludeFooterPaths.includes(location.pathname);


  return (
    <>
      <Navbar />

      <Routes>
        {/* --- Main Website Routes --- */}
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
        
        {/* --- Auth & User Routes --- */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        
        {/* --- Static Content Routes --- */}
        <Route path="/about" element={<About />} />
        <Route path="/events" element={<Events />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/board" element={<Directors />} />
        <Route path="/staff" element={<StaffLogin />} />

        {/* --- Inventory & Logistics Pages --- */}
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/issues" element={<Issues />} />
        <Route path="/maintenance" element={<Maintenance />} />

        {/* --- Admin & Management Dashboards --- */}
        <Route path="/adminDashboard" element={<AdminDashboard />} />
        <Route path="/admin/directors" element={<AdminDirectors />} />
        <Route path="/equpmentUsage" element={<EqupmentUsage />} />
        <Route path="/inventoryManagement" element={<InventoryManagement />} />
        <Route path="/pondsManagement" element={<PondsManagement />} />
        <Route path="/harvestManagement" element={<HarvestManagement />} />
        <Route path="/expensesFinance" element={<ExpensesFinance />} />
        <Route path="/manageOrders" element={<ManageOrders />} />

        {/* ---  Driver Dashboard Route --- */}
        <Route path="/driverDashboard" element={<DriverDashboard />} />

        {/* --- Weather Management Route --- */}
        <Route path="/weatherdashboard" element={<WeatherDashboard />} />

        
      </Routes>

      {shouldShowFooter && <Footer />}
    </>
  );
}

export default App;