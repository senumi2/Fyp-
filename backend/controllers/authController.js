const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. User Register
exports.register = async (req, res) => {
  try {
    const { fullName, email, contact, jobRole, password } = req.body;
    
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ fullName, email, contact, jobRole, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.jobRole }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token, user: { id: user._id, fullName, jobRole } });
  } catch (err) {
    console.error(err.message); 
    res.status(500).json({ error: err.message }); 
  }
};

// 2. User Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid Credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });

    const token = jwt.sign({ id: user._id, role: user.jobRole }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user._id, fullName: user.fullName, jobRole: user.jobRole } });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

// 3. User ගේ Profile එක සහ Address එක ලබා ගැනීම
exports.getUserProfile = async (req, res) => {
  try {
    // req.user.id ලැබෙන්නේ ඔයාගේ auth middleware එක හරහායි
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error fetching profile" });
  }
};

// 4. Address එක පමණක් Update කිරීම
exports.updateAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user) {
      user.address = req.body.address || user.address;
      const updatedUser = await user.save();
      res.json({ address: updatedUser.address });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error updating address" });
  }
};