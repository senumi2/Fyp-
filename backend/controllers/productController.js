const Product = require("../models/Product");
const Stock = require("../models/Stock");

// 🌐 Get All Products (Public) - Auto-calculates stock from Stock transactions
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    // එක් එක් Product එක සඳහා Inward/Outward ගණනය කර Live Stock එක ලබා ගැනීම
    const productsWithLiveStock = await Promise.all(
      products.map(async (product) => {
        // Stock model එකේ itemName එක Product name එකට සමාන ඒවා සොයයි
        const transactions = await Stock.find({ itemName: product.name });

        const totalInward = transactions
          .filter((t) => t.transactionType === "Inward")
          .reduce((sum, t) => sum + t.quantity, 0);

        const totalOutward = transactions
          .filter((t) => t.transactionType === "Outward")
          .reduce((sum, t) => sum + t.quantity, 0);

        const liveStock = totalInward - totalOutward;

        return {
          ...product._doc,
          stock: liveStock > 0 ? liveStock : 0, // සෘණ අගයන් පෙන්වීම වැලැක්වීමට
        };
      })
    );

    res.json(productsWithLiveStock);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔍 Get Product By ID (Public) - Includes calculated stock
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!require("mongoose").Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Single item stock calculation
    const transactions = await Stock.find({ itemName: product.name });
    const liveStock = transactions.reduce((total, t) => {
      return t.transactionType === "Inward"
        ? total + t.quantity
        : total - t.quantity;
    }, 0);

    const productWithStock = {
      ...product._doc,
      stock: liveStock > 0 ? liveStock : 0,
    };

    res.json(productWithStock);
  } catch (err) {
    console.error("Get product error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ➕ Create Product (Admin) - Supports Quality Specs
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, purity, iodine, moisture } = req.body;
    
    if (!req.file) return res.status(400).json({ message: "Image required" });

    const product = new Product({
      name,
      description,
      price,
      // stock එක manually දාන්නේ නැත, එය auto-calculate වේ
      purity: purity || "98.5%",
      iodine: iodine || "25-30 ppm",
      moisture: moisture || "< 0.5%",
      imageUrl: `/uploads/${req.file.filename}`,
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔄 Update Product (Admin)
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    });
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