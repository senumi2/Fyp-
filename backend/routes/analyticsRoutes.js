const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getProductionVsSalesStats, getFinancialStats } = require("../controllers/analyticsController");


router.get("/production-vs-sales", authMiddleware, authMiddleware.admin, getProductionVsSalesStats);
router.get("/financial-stats", authMiddleware, getFinancialStats);

module.exports = router;