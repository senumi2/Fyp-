const ShippingAddress = require("../models/ShippingAddress");


exports.getShippingAddresses = async (req, res) => {
  try {
    
    const addresses = await ShippingAddress.find({ user: req.user.id });
    res.json(addresses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//  CREATE - Add a new address (Warehouse Location)
exports.saveShippingAddress = async (req, res) => {
  try {
    
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


exports.deleteShippingAddress = async (req, res) => {
  try {
    await ShippingAddress.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user.id 
    });
    res.json({ message: "Location deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};