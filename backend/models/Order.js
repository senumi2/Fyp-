const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  items: String,
  quantity: Number,
  paymentMethod: String,
  amount: Number,
  status: {
    type: String,
    default: "Pending" 
  },
  // --- පාරිභෝගිකයා තෝරාගත් ගබඩා ලිපිනය (අලුතින් එක් කළා) ---
  shippingAddress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ShippingAddress",
    required: true
  },
  // --- Tracking සඳහා ඇති කොටස් (වෙනස් කර නැත) ---
  truckNumber: { 
    type: String, 
    default: "Not Assigned" 
  },
  driverName: { 
    type: String, 
    default: "Not Assigned" 
  },
  estimatedDelivery: { 
    type: String, 
    default: "TBD" 
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Order", orderSchema);