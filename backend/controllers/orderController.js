const Order = require("../models/Order");
const mongoose = require("mongoose");
const sendEmail = require("../utils/sendEmail");

// --- 1. නව ඇණවුමක් සෑදීම ---
exports.createOrder = async (req, res) => {
  try {
    const { items, quantity, amount, paymentMethod, status, shippingAddress } = req.body;
    if (!req.user || !req.user.id) return res.status(401).json({ message: "User not authenticated" });

    const newOrder = new Order({
      userId: req.user.id, 
      items,
      quantity,
      amount,
      paymentMethod,
      status: status || "Pending",
      shippingAddress, 
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json({ message: "Failed to create order", error: err.message });
  }
};

// --- 2. පරිශීලකයාගේ සියලු ඇණවුම් ලබා ගැනීම ---
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).populate("shippingAddress").sort({ date: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders", error: err.message });
  }
};

// --- 3. Invoice ලබා ගැනීම ---
exports.getInvoiceById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("shippingAddress").populate("userId", "fullName email");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Error fetching invoice", error: err.message });
  }
};

// --- 4. ඇණවුමක් මකා දැමීම ---
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.userId.toString() !== req.user.id) return res.status(403).json({ message: "Unauthorized" });
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting order", error: err.message });
  }
};

// --- 5. Dashboard Stats ---
exports.getUserDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const totalOrders = await Order.countDocuments({ userId });
    const pendingPayments = await Order.countDocuments({ userId, status: "Pending" });
    const activeShipments = await Order.countDocuments({ userId, status: { $in: ["Shipped", "Processing"] } });
    const orders = await Order.find({ userId });
    const totalSpent = orders.reduce((sum, order) => sum + (order.amount || 0), 0);
    const monthlyStats = await Order.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: { $month: "$date" }, totalAmount: { $sum: "$amount" } } },
      { $sort: { "_id": 1 } }
    ]);
    res.json({ totalOrders, pendingPayments, activeShipments, totalSpent, monthlyStats });
  } catch (err) {
    res.status(500).json({ message: "Error fetching stats", error: err.message });
  }
};

// --- 6. ඇඩ්මින් Tracking Update (Update with assignedDriver) ---
exports.updateOrderTracking = async (req, res) => {
  try {
    const { status, truckNumber, driverName, estimatedDelivery, assignedDriver } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: { status, truckNumber, driverName, estimatedDelivery, assignedDriver } },
      { new: true } 
    ).populate("shippingAddress");
    res.status(200).json({ message: "Order tracking updated!", order: updatedOrder });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// --- 🚀 7. රියදුරුට අදාළ Tasks ලබා ගැනීම (Driver Dashboard සඳහා) ---
exports.getDriverTasks = async (req, res) => {
  try {
    // Driver ට Assign කරපු සහ තවම Deliver නොකරපු දේවල්
    const tasks = await Order.find({ 
      assignedDriver: req.user.id,
      status: { $ne: "Delivered" }
    }).populate("shippingAddress");
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Error fetching driver tasks", error: err.message });
  }
};

// --- 🚀 8. රියදුරු විසින් භාණ්ඩ භාරදුන් බව Mark කිරීම ---
exports.markAsDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // ආරක්ෂාව සඳහා: Assign කරපු Driver ටම විතරයි මේක කරන්න පුළුවන්
    if (order.assignedDriver.toString() !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized: You are not assigned to this order" });
    }

    order.status = "Delivered";
    order.deliveredAt = Date.now();
    await order.save();

    res.json({ message: "Success! Order marked as delivered.", order });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};