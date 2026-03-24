const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/my-orders", authMiddleware, orderController.getMyOrders);
router.get("/invoice/:id", authMiddleware, orderController.getInvoiceById);
router.get("/dashboard-stats", authMiddleware, orderController.getUserDashboardStats);
router.get("/driver-tasks", authMiddleware, orderController.getDriverTasks);

router.post("/create", authMiddleware, orderController.createOrder);
router.delete("/:id", authMiddleware, orderController.deleteOrder);

router.put("/update-tracking/:id", authMiddleware, orderController.updateOrderTracking);
router.put("/mark-delivered/:id", authMiddleware, orderController.markAsDelivered);

module.exports = router;