const User = require("../models/User");

// Profile දත්ත ලබා ගැනීම
exports.getProfile = async (req, res) => {
  try {
    // req.user.id භාවිතා කර Database එකෙන් සෙවීම
    const user = await User.findById(req.user.id).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error("Get Profile Error:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// Profile දත්ත Update කිරීම
exports.updateProfile = async (req, res) => {
  try {
    const { fullName, contact } = req.body;
    
    // Update කිරීමට අවශ්‍ය දත්ත පමණක් වෙන් කර ගැනීම
    let updateFields = { fullName, contact };

    // පින්තූරයක් ඇත්නම් පමණක් path එක එක් කිරීම
    if (req.file) {
      updateFields.profileImage = `/uploads/${req.file.filename}`;
    }

    // $set භාවිතා කිරීමෙන් අනිත් fields (email, role, password) ආරක්ෂා වේ
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found to update" });
    }

    res.json(updatedUser);
  } catch (err) {
    console.error("Update Profile Error:", err.message);
    res.status(500).json({ message: "Update failed" });
  }
};