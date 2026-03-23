const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    contact: {
      type: String,
      required: true
    },
    jobRole: { 
      type: String, 
      required: true,
      enum: ['Admin', 'Ponds Management', 'Inventory Management', 'Harvest Management', 'Equipment Usage', 'Expenses & Finance']
    },

    //  profile image path
    profileImage: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
