const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. User Register (Updated with First-User-is-Admin Logic)
exports.register = async (req, res) => {
  try {
    const { fullName, email, contact, jobRole, password } = req.body;
    
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    // --- NEW LOGIC: Check if this is the very first user ---
    const userCount = await User.countDocuments();
    const isFirstUser = userCount === 0;

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ 
      fullName, 
      email, 
      contact, 
      // Idirikala ayata "Pending" / Palaweniya "Approved"
      isApproved: isFirstUser ? true : false, 
      jobRole: isFirstUser ? "Admin" : jobRole, // Palaweniyawa auto "Admin" karanawa
      password: hashedPassword 
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.jobRole }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    res.status(201).json({ 
      token, 
      user: { 
        id: user._id, 
        fullName, 
        jobRole: user.jobRole,
        isApproved: user.isApproved 
      } 
    });
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

    // Check if approved
    if (!user.isApproved) {
      return res.status(403).json({ msg: "Your account is pending admin approval." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.jobRole }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    res.json({ 
      token, 
      user: { 
        id: user._id, 
        fullName: user.fullName, 
        jobRole: user.jobRole 
      } 
    });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

// 3. User Profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error fetching profile" });
  }
};

// 4. Update Address
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

// 5. Get All Drivers
exports.getAllDrivers = async (req, res) => {
  try {
    const drivers = await User.find({ jobRole: "Driver" }).select("fullName _id contact");
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching drivers" });
  }
};

// 6. Get Pending Users
exports.getPendingUsers = async (req, res) => {
  try {
    const users = await User.find({ isApproved: false }).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

// 7. Approve User
exports.approveUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
    res.json({ msg: "User approved successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};