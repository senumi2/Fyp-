const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, default: "info" }, // උදා: "warning", "info", "success"
  active: { type: Boolean, default: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Notice", noticeSchema);