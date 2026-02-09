const express = require("express");
const Inventory = require("../models/Inventory");
const router = express.Router();

// Create
router.post("/", async (req, res) => {
  const data = await Inventory.create(req.body);
  res.json(data);
});

// Get (search + last month)
router.get("/", async (req, res) => {
  const { search, all } = req.query;

  let query = {};
  if (!all) {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    query.createdAt = { $gte: lastMonth };
  }

  if (search) {
    query.item = { $regex: search, $options: "i" };
  }

  const data = await Inventory.find(query).sort({ createdAt: -1 });
  res.json(data);
});

// Update
router.put("/:id", async (req, res) => {
  const data = await Inventory.findByIdAndUpdate(req.params.id, req.body);
  res.json(data);
});

// Delete
router.delete("/:id", async (req, res) => {
  await Inventory.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;
