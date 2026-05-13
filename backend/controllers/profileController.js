const User = require("../models/User");
const bcrypt = require("bcryptjs"); // Password hash කිරීමට අවශ්‍යයි

// --- පවතින getProfile සහ updateProfile functions එලෙසම තබන්න ---

// Profile දත්ත ලබා ගැනීම
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Profile දත්ත Update කිරීම
exports.updateProfile = async (req, res) => {
  try {
    const { fullName, contact } = req.body;
    let updateFields = { fullName, contact };
    if (req.file) {
      updateFields.profileImage = `/uploads/${req.file.filename}`;
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select("-password");
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
};

// --- 🔐 අලුතින් එක් කරන Password Update Function එක ---
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 1. දැනට තියෙන Password එක නිවැරදිදැයි බැලීම
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // 2. අලුත් Password එක Hash කිරීම
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();
    res.json({ message: "Password updated successfully" });

  } catch (err) {
    console.error("Password Update Error:", err.message);
    res.status(500).json({ message: "Server error during password update" });
  }
};