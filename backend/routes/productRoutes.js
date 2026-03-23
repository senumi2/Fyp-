const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const Product = require("../models/Product");
const authMiddleware = require("../middleware/authMiddleware");

// Controller functions (ඔයාගේ productController එකේ මේ නමින් functions තියෙන්න ඕනේ)
const {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getProductById
} = require("../controllers/productController");

// --- 📂 Multer Config (Images සඳහා) ---
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// --- 🌐 Public Routes ---
router.get("/", getProducts);
router.get("/:id", getProductById);

// --- 📝 Review Routes (හතරේම තිබුණු දේවල් මෙතන තියෙනවා) ---
router.post("/:id/review", authMiddleware, async (req, res) => {
  try {
    const { rating, comment, user } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      const newReview = {
        user: user,
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

router.delete("/:id/review/:reviewId", authMiddleware, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const review = product.reviews.id(req.params.reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });

    // ආරක්ෂාව සඳහා නම පරීක්ෂාව
    if (review.user !== req.query.userName) {
      return res.status(401).json({ message: "Not authorized" });
    }

    product.reviews.pull(req.params.reviewId);
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- 🛠️ Admin Routes ---
router.post("/", upload.single("image"), createProduct);
router.put("/:id", upload.single("image"), updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;