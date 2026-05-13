const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String }, 
  imageUrl: { type: String, required: true }, 
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 }, 
  
  // --- 🧂 Quality Specs (New) ---
  purity: { type: String, default: "98.5%" },
  iodine: { type: String, default: "25-30 ppm" },
  moisture: { type: String, default: "< 0.5%" },
  
  // --- ⭐ Reviews (Array format is better) ---
  reviews: [
    {
      user: { type: String },
      rating: { type: Number },
      comment: { type: String },
      createdAt: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);