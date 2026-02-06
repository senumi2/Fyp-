const User = require("../models/User");

// GET PROFILE
exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
};

// UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  const { fullName, contact } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { fullName, contact },
    { new: true }
  ).select("-password");

  res.json(user);
};
