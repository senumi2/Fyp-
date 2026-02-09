const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
  date: Date,
  item: String,
  quantity: Number
}, { timestamps: true });

module.exports = mongoose.model("Inventory", inventorySchema);
