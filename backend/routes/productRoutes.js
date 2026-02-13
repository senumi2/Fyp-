const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getProductById,
  addReview
} = require("../controllers/productController");


// Public Routes


// Get all products
router.get("/", (req, res, next) => {
  console.log("GET /api/products route hit");
  next();
}, getProducts);

// Get product by ID (DEBUG VERSION)
router.get("/:id", (req, res, next) => {
  console.log("GET /api/products/:id route hit");
  console.log("Requested ID:", req.params.id);
  next();
}, getProductById);

// Add review
router.post("/:id/review", (req, res, next) => {
  console.log("POST review route hit for ID:", req.params.id);
  next();
}, addReview);


// Admin Routes

router.post("/", upload.single("image"), createProduct);
router.put("/:id", upload.single("image"), updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
