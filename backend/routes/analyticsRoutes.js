const express = require("express");
const router = express.Router();
const { getProductionVsSalesStats, getFinancialStats } = require("../controllers/analyticsController");
const { protect, admin } = require("../middleware/authMiddleware");

router.get("/production-vs-sales", protect, admin, getProductionVsSalesStats);
router.get("/financial-stats", protect, admin, getFinancialStats);

module.exports = router;