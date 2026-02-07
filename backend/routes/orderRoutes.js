const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const authMiddleware = require("../middleware/authMiddleware");

// 🔐 Get logged user's order history
router.get("/my-orders", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// 🔐 Get single order invoice
router.get("/invoice/:id", authMiddleware, async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.id,
    userId: req.user.id
  });

  if (!order) {
    return res.status(403).json({ message: "Access denied" });
  }

  res.json(order);
});

module.exports = router;
