import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Products from "./components/Products";
import ProductDetail from "./Components/ProductDetail";
import Events from "./components/Events";
import Directors from "./Components/Directors";
import Footer from "./components/Footer";


import Login from "./pages/Login";
import Register from "./pages/Register";
import Contact_us from "./pages/Contact_us";
import Shipping_address from "./pages/Shipping_address";
import OrderTracking from "./Pages/orderTracking";
import PaymentHistory from "./Pages/paymentHistory";

import "./App.css";
import AddProduct from "./Pages/AddProduct";
import Profile from "./Pages/Profile";

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
              
            </>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/About" element={<About />} />
        <Route path="/contact" element={<Contact_us />} />
        <Route path="/shipping_address" element={<Shipping_address />} />
        <Route path="/OrderTracking" element={<OrderTracking />} />
        <Route path="/PaymentHistory" element={<PaymentHistory />} />
        <Route path="/addproduct" element={<AddProduct />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetail />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;                            