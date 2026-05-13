const Notice = require("../models/Notice");

// Get active notifications
exports.getPublicNotices = async (req, res) => {
  try {
    const notices = await Notice.find({ active: true }).sort({ date: -1 }).limit(3);
    res.json(notices);
  } catch (err) {
    res.status(500).json({ message: "Error fetching notices" });
  }
};