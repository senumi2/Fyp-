const Order = require("../models/Order");
const mongoose = require("mongoose");
const sendEmail = require("../utils/sendEmail");


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


exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).populate("shippingAddress").sort({ date: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders", error: err.message });
  }
};

// ---   get Invoice  ---
exports.getInvoiceById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("shippingAddress").populate("userId", "fullName email");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Error fetching invoice", error: err.message });
  }
};

// --- Deleting an order ---
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

// ---  Dashboard Stats ---
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

// ---  Admin Tracking Update (Update with assignedDriver) ---
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

// ---   Getting Tasks Related to the Driver (For Driver Dashboard)) ---
exports.getDriverTasks = async (req, res) => {
  try {
    // Items assigned to the driver but not yet delivered
    const tasks = await Order.find({ 
      assignedDriver: req.user.id,
      status: { $ne: "Delivered" }
    }).populate("shippingAddress");
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Error fetching driver tasks", error: err.message });
  }
};

// ---  Marking that the driver has delivered the goods ---
exports.markAsDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // For security reasons: Only the assigned driver can do this.
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


exports.getAllOrdersForAdmin = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "fullName email") 
      .populate("shippingAddress")
      .sort({ date: -1 }); 
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching payment history" });
  }
};