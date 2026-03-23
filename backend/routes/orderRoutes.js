const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");

// --- GET Routes ---
router.get("/my-orders", authMiddleware, orderController.getMyOrders);
router.get("/invoice/:id", authMiddleware, orderController.getInvoiceById);

// 🚀 අලුතින් එක් කළ Dashboard Stats Route එක
router.get("/dashboard-stats", authMiddleware, orderController.getUserDashboardStats);

// --- POST/DELETE Routes ---
router.post("/create", authMiddleware, orderController.createOrder);
router.delete("/:id", authMiddleware, orderController.deleteOrder);

// ඇඩ්මින් විසින් ඇණවුමේ තත්ත්වය සහ ට්‍රැකින් විස්තර update කිරීමට
router.put("/update-tracking/:id", authMiddleware, orderController.updateOrderTracking);

module.exports = router;