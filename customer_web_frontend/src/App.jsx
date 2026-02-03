import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Products from "./components/Products";
import Events from "./components/Events";
import Directors from "./components/Directors";
import Footer from "./components/Footer";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Contact_us from "./pages/Contact_us";
import Shipping_address from "./pages/Shipping_address";
import Contact_info from "./pages/Contact_info";

import "./App.css";
import AddProduct from "./Pages/AddProduct";

function App() {
  return (
    <Router>
      {/* Navbar always visible */}
      <Navbar />

      {/* Page Content */}
      <Routes>
        <Route 
          path="/" 
          element={
            <>
              <Hero />
              <About />
              <Products />
              <Events />
              <Directors />
              <Contact_info />
            </>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/About" element={<About />} />
        <Route path="/contact" element={<Contact_us />} />
        <Route path="/shipping_address" element={<Shipping_address />} />
        <Route path="/addproduct" element={<AddProduct />} />
      </Routes>

      {/* Footer always visible */}
      <Footer />
    </Router>
  );
}

export default App;
