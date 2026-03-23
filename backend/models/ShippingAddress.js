const mongoose = require("mongoose");

const shippingAddressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    warehouseName: { type: String, required: true }, // අලුතින් එක් කළා
    fullName: String,
    contactNumber: String,
    address: String,
    province: String,
    district: String,
    postalCode: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("ShippingAddress", shippingAddressSchema);