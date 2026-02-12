const Product = require("../models/Products");

// CREATE PRODUCT
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      details,
      availableStock,
      quantity,
      reviews
    } = req.body;

    const product = new Product({
      name,
      price,
      details,
      availableStock,
      quantity,
      reviews,
      image: `/uploads/${req.file.filename}`,
      imageName: req.file.originalname
    });

    await product.save();
    res.status(201).json(product);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL PRODUCTS
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET PRODUCT BY ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
