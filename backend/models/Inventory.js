const mongoose = require("mongoose");

const InventorySchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  items: { type: String, required: true },
  quantity: { type: Number, required: true }
},

{ 
  timestamps: true 
});

module.exports = mongoose.model("Inventory", InventorySchema);
