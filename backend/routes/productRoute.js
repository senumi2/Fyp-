const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const {
  createProduct,
  getProducts,
  getProductById
} = require("../controllers/productController");

// Multer config
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + path.extname(file.originalname)
    );
  }
});

const upload = multer({ storage });

// Routes
router.post("/", upload.single("image"), createProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);

module.exports = router;
