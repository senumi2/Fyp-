const Order = require("../models/Order");
const mongoose = require("mongoose"); // 👈 Chart logic එකට මෙයාව ඕනේ
const sendEmail = require("../utils/sendEmail");

// --- 1. නව ඇණවුමක් සෑදීම සහ Email එකක් යැවීම ---
exports.createOrder = async (req, res) => {
  try {
    const { items, quantity, amount, paymentMethod, status, shippingAddress } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

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
    console.log("✅ Order created successfully:", savedOrder._id);

    const emailHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
        <h2 style="color: #2c3e50; text-align: center;">Order Confirmed! 📦</h2>
        <p>Hi <b>${req.user.fullName || 'Valued Customer'}</b>,</p>
        <p>Thank you for shopping with <b>Senumi Salterns</b>. Your order has been placed successfully.</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 5px 0;"><b>Order ID:</b> #${savedOrder._id}</p>
          <p style="margin: 5px 0;"><b>Items:</b> ${items}</p>
          <p style="margin: 5px 0;"><b>Total Amount:</b> LKR ${amount.toLocaleString()}</p>
          <p style="margin: 5px 0;"><b>Status:</b> ${savedOrder.status}</p>
        </div>

        <p>We will notify you once your order is dispatched for delivery.</p>
        <hr style="border: 0; border-top: 1px solid #eee;" />
        <p style="font-size: 12px; color: #777; text-align: center;">© 2026 Senumi Salterns. All rights reserved.</p>
      </div>
    `;

    try {
      await sendEmail({
        email: req.user.email,
        subject: `Order Confirmation - #${savedOrder._id}`,
        html: emailHtml,
      });
      console.log("📧 Confirmation email sent to:", req.user.email);
    } catch (emailErr) {
      console.error("❌ Email sending failed (but order saved):", emailErr.message);
    }

    res.status(201).json(savedOrder);

  } catch (err) {
    console.error("❌ ERROR IN CREATE ORDER:", err);
    res.status(500).json({ message: "Failed to create order", error: err.message });
  }
};

// --- 2. පරිශීලකයාගේ සියලු ඇණවුම් ලබා ගැනීම ---
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate("shippingAddress")
      .sort({ date: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders", error: err.message });
  }
};

// --- 3. විශේෂිත ඇණවුමක් ලබා ගැනීම (Invoice) ---
exports.getInvoiceById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("shippingAddress")
      .populate("userId", "fullName email");

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

    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting order", error: err.message });
  }
};

// --- 🚀 5. නව Dashboard Stats Function (අලුතින් එක් කළා) ---
exports.getUserDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Total Orders
    const totalOrders = await Order.countDocuments({ userId });

    // 2. Pending Payments (Status එක Pending වන ඇණවුම්)
    const pendingPayments = await Order.countDocuments({ userId, status: "Pending" });

    // 3. Active Shipments (Shipping වෙමින් පවතින ඒවා)
    const activeShipments = await Order.countDocuments({ 
      userId, 
      status: { $in: ["Shipped", "Processing"] } 
    });

    // 4. Total Spent (Amount එකේ එකතුව)
    const orders = await Order.find({ userId });
    const totalSpent = orders.reduce((sum, order) => sum + (order.amount || 0), 0);

    // 5. Monthly Stats for Bar Chart (මාස 6ක දත්ත)
    const monthlyStats = await Order.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: { $month: "$date" },
          totalAmount: { $sum: "$amount" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    res.json({
      totalOrders,
      pendingPayments,
      activeShipments,
      totalSpent,
      monthlyStats
    });

  } catch (err) {
    console.error("❌ Stats error:", err);
    res.status(500).json({ message: "Error fetching stats", error: err.message });
  }
};

// --- 🚀 6. ඇඩ්මින් විසින් ඇණවුමක ට්‍රැකින් විස්තර Update කිරීම (Updated with Populate) ---
exports.updateOrderTracking = async (req, res) => {
  try {
    const { status, truckNumber, driverName, estimatedDelivery } = req.body;
    const { id } = req.params;

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { 
        $set: { 
          status, 
          truckNumber, 
          driverName, 
          estimatedDelivery 
        } 
      },
      { new: true } 
    ).populate("shippingAddress"); // 👈 මේ කොටස එකතු කරන්න, එතකොටයි ලිපිනය ලැබෙන්නේ

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ 
      message: "Order tracking updated successfully!", 
      order: updatedOrder 
    });
  } catch (err) {
    console.error("❌ Update Tracking Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};