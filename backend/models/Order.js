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
  shippingAddress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ShippingAddress",
    required: true
  },
  // --- පවරන ලද රියදුරු (අලුතින් එක් කළා) ---
  assignedDriver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
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
  deliveredAt: {
    type: Date
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Order", orderSchema);