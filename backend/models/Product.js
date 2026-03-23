const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String }, // 'details' වෙනුවට පොදුවේ description පාවිච්චි කරමු
  imageUrl: { type: String, required: true }, // 'image' path එක මෙතන තියෙනවා
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 }, // 'availableStock' එකටත් මේකම පාවිච්චි වේ
  
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