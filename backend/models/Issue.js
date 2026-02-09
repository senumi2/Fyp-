const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema({
  date: Date,
  issue: String,
  status: String
}, { timestamps: true });

module.exports = mongoose.model("Issue", issueSchema);
