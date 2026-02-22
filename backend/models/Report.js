const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  imageUrl: { 
    type: String, 
    required: true 
  }
});

module.exports = mongoose.model("Report", reportSchema);