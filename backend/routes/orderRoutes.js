const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/my-orders", authMiddleware, orderController.getMyOrders);
router.get("/invoice/:id", authMiddleware, orderController.getInvoiceById);

router.post("/create", authMiddleware, orderController.createOrder);
router.delete("/:id", authMiddleware, orderController.deleteOrder);

module.exports = router;