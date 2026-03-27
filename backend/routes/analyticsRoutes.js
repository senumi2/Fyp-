const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getProductionVsSalesStats, getFinancialStats } = require("../controllers/analyticsController");

// Admin හට පමණක් දත්ත ලබා ගත හැකි පරිදි Routes සකසා ඇත
router.get("/production-vs-sales", authMiddleware, authMiddleware.admin, getProductionVsSalesStats);
router.get("/financial-stats", authMiddleware, authMiddleware.admin, getFinancialStats);

module.exports = router;