const Order = require("../models/Order");
const sendEmail = require("../utils/sendEmail"); // 👈 අපි හදපු Utility එක Import කරන්න

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

    // --- 📧 Email එක යැවීමේ කොටස ---
    const emailHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
        <h2 style="color: #2c3e50; text-align: center;">Order Confirmed! 📦</h2>
        <p>Hi <b>${req.user.fullName || 'Valued Customer'}</b>,</p>
        <p>Thank you for shopping with <b>Senumi Furniture</b>. Your order has been placed successfully.</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 5px 0;"><b>Order ID:</b> #${savedOrder._id}</p>
          <p style="margin: 5px 0;"><b>Items:</b> ${items}</p>
          <p style="margin: 5px 0;"><b>Total Amount:</b> LKR ${amount.toLocaleString()}</p>
          <p style="margin: 5px 0;"><b>Status:</b> ${savedOrder.status}</p>
        </div>

        <p>We will notify you once your furniture is dispatched for delivery.</p>
        <hr style="border: 0; border-top: 1px solid #eee;" />
        <p style="font-size: 12px; color: #777; text-align: center;">© 2026 Senumi Furniture. All rights reserved.</p>
      </div>
    `;

    try {
      await sendEmail({
        email: req.user.email, // 👈 Login වෙලා ඉන්න user ගේ email එක
        subject: `Order Confirmation - #${savedOrder._id}`,
        html: emailHtml,
      });
      console.log("📧 Confirmation email sent to:", req.user.email);
    } catch (emailErr) {
      // Email එක යැවීමට බැරි වුණත් order එක create වෙලා තියෙන නිසා error response එකක් යවන්නේ නැහැ.
      console.error("❌ Email sending failed (but order saved):", emailErr.message);
    }

    // සාර්ථක ප්‍රතිචාරය යැවීම
    res.status(201).json(savedOrder);

  } catch (err) {
    console.error("❌ ERROR IN CREATE ORDER:", err);
    res.status(500).json({ 
      message: "Failed to create order", 
      error: err.message 
    });
  }
};

// --- 2. පරිශීලකයාගේ සියලු ඇණවුම් ලබා ගැනීම (වෙනසක් නැත) ---
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

// --- 3. විශේෂිත ඇණවුමක් ලබා ගැනීම (Invoice) (වෙනසක් නැත) ---
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

// --- 4. ඇණවුමක් මකා දැමීම (වෙනසක් නැත) ---
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