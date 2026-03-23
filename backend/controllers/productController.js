const Product = require("../models/Product");

// ➕ Create Product (Admin) - Updated with Quality Specs
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, purity, iodine, moisture } = req.body;
    if (!req.file) return res.status(400).json({ message: "Image required" });

    const product = new Product({
      name,
      description,
      price,
      stock,
      purity: purity || "98.5%", // අගයක් එව්වේ නැත්නම් default අගය ගනී
      iodine: iodine || "25-30 ppm",
      moisture: moisture || "< 0.5%",
      imageUrl: `/uploads/${req.file.filename}`
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔄 Update Product (Admin) - Updated to handle quality specs
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    
    // රූපරාමුවක් අලුතින් upload කරොත් පමණක් path එක update කරයි
    if (req.file) updateData.imageUrl = `/uploads/${req.file.filename}`;

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🗑️ Delete Product (Admin)
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🌐 Get All Products (Public)
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔍 Get Product By ID (Public) - Combined version for safety
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId (ID එකේ වැරද්දක් ඇත්දැයි බලයි)
    if (!require("mongoose").Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);

  } catch (err) {
    console.error("Get product error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ⭐ Add Review (Public/User)
exports.addReview = async (req, res) => {
  try {
    const { user, rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.reviews.push({ user, rating, comment });
    await product.save();

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};