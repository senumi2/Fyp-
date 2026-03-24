const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

// 🚀 අලුත් Middleware එක මෙතනට Import කළා. 
// දැන් 'authMiddleware' කියන නම පහළ හැම තැනකම පාවිච්චි කරන්න පුළුවන්.
const authMiddleware = require("../middleware/authMiddleware");

// --- GET Routes ---
router.get("/my-orders", authMiddleware, orderController.getMyOrders);
router.get("/invoice/:id", authMiddleware, orderController.getInvoiceById);
router.get("/dashboard-stats", authMiddleware, orderController.getUserDashboardStats);

// 🚀 Driver Dashboard සඳහා
router.get("/driver-tasks", authMiddleware, orderController.getDriverTasks);

// --- POST/DELETE Routes ---
router.post("/create", authMiddleware, orderController.createOrder);
router.delete("/:id", authMiddleware, orderController.deleteOrder);

// --- PUT Routes ---
router.put("/update-tracking/:id", authMiddleware, orderController.updateOrderTracking);

// 🚀 Driver විසින් Deliver කළ බව Mark කිරීමට
router.put("/mark-delivered/:id", authMiddleware, orderController.markAsDelivered);

module.exports = router;