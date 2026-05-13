const mongoose = require('mongoose');
const reportSchema = new mongoose.Schema({
  title: String,
  imageUrl: String,
  pdfUrl: String, 
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);