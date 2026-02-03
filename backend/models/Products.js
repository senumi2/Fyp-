const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    image: {
      type: String, // image path
      required: true
    },
    imageName: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    details: {
      type: String
    },
    availableStock: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      default: 1
    },
    reviews: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
