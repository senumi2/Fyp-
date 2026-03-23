const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Product = require("../models/Product"); 
const authMiddleware = require("../middleware/authMiddleware");

const {
  createProduct,
  getProducts,
  getProductById
} = require("../controllers/productController");

// Multer Config
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// --- පවතින රූට්ස් ---
router.post("/", upload.single("image"), createProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);

// --- 📝 Review එකතු කිරීමේ Route එක ---
router.post("/:id/review", authMiddleware, async (req, res) => {
  try {
    const { rating, comment, user } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      const newReview = {
        user: user, // AuthContext එකෙන් එවන නම
        rating: Number(rating),
        comment: comment,
        createdAt: new Date()
      };

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

// --- 🗑️ Review ඉවත් කිරීමේ Route එක ---
router.delete("/:id/review/:reviewId", authMiddleware, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Review එක සොයාගැනීම
    const review = product.reviews.id(req.params.reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });

    // ආරක්ෂාව සඳහා: Review එක අයිති කෙනාමද බලනවා (නම අනුව)
    if (review.user !== req.query.userName) {
      return res.status(401).json({ message: "Not authorized to delete this review" });
    }

    product.reviews.pull(req.params.reviewId);
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;