const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = require("../models/Product");

// @route   GET /api/product-detail/:id
// @desc    Get single product document directly from database
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // 1. ID එක Valid ද කියා පරීක්ෂා කිරීම
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID format" });
    }

    
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    
    console.log(`✅ Fetched direct data for: ${product.name}`);
    res.json(product);

  } catch (err) {
    console.error("Route Error:", err.message);
    res.status(500).json({ message: "Server error occurred while fetching product" });
  }
});

module.exports = router;