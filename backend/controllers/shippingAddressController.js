const ShippingAddress = require("../models/ShippingAddress");

// 1. GET - ලොග් වී සිටින User ගේ සියලුම ලිපින ලබා ගැනීම
exports.getShippingAddresses = async (req, res) => {
  try {
    // findOne වෙනුවට find පාවිච්චි කරන්න (සියල්ලම ගැනීමට)
    const addresses = await ShippingAddress.find({ user: req.user.id });
    res.json(addresses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 2. CREATE - අලුත් ලිපිනයක් (Warehouse Location) එකතු කිරීම
exports.saveShippingAddress = async (req, res) => {
  try {
    // හැමතිස්සෙම අලුත් එකක් විදිහට Save කරන්න (Overwrite කරන්නේ නැහැ)
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

// 3. DELETE - අවශ්‍ය නැති ලිපිනයක් ඉවත් කිරීම
exports.deleteShippingAddress = async (req, res) => {
  try {
    await ShippingAddress.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user.id // තහවුරු කරගන්න තමන්ගේම ලිපිනයක්ද කියලා
    });
    res.json({ message: "Location deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};