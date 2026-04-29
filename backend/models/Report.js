const mongoose = require('mongoose');
const reportSchema = new mongoose.Schema({
  title: String,
  imageUrl: String,
  pdfUrl: String, // මෙම පේළිය අනිවාර්යයි
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);