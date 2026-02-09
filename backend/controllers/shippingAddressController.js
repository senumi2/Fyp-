const ShippingAddress = require("../models/ShippingAddress");

// GET (auto fill)
exports.getShippingAddress = async (req, res) => {
  try {
    const address = await ShippingAddress.findOne({ user: req.user.id });
    res.json(address);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE or UPDATE
exports.saveShippingAddress = async (req, res) => {
  try {
    const existing = await ShippingAddress.findOne({ user: req.user.id });

    if (existing) {
      const updated = await ShippingAddress.findByIdAndUpdate(
        existing._id,
        req.body,
        { new: true }
      );
      return res.json(updated);
    }

    const newAddress = new ShippingAddress({
      ...req.body,
      user: req.user.id
    });

    await newAddress.save();
    res.status(201).json(newAddress);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
