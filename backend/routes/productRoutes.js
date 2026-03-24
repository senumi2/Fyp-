const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const Product = require("../models/Product");
const authMiddleware = require("../middleware/authMiddleware");

const {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getProductById
} = require("../controllers/productController");

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

router.get("/", getProducts);
router.get("/:id", getProductById);

router.post("/:id/review", authMiddleware, async (req, res) => {
  try {
    const { rating, comment, user } = req.body;
    const product = await Product.findById(req.params.id);
    if (product) {
      const newReview = { user, rating: Number(rating), comment, createdAt: new Date() };
      product.reviews.push(newReview);
      await product.save();
      res.status(201).json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id/review/:reviewId", authMiddleware, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    const review = product.reviews.id(req.params.reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });
    if (review.user !== req.query.userName) return res.status(401).json({ message: "Not authorized" });
    product.reviews.pull(req.params.reviewId);
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", authMiddleware, authMiddleware.admin, upload.single("image"), createProduct);
router.put("/:id", authMiddleware, authMiddleware.admin, upload.single("image"), updateProduct);
router.delete("/:id", authMiddleware, authMiddleware.admin, deleteProduct);

module.exports = router;