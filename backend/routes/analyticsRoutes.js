const express = require("express");
const router = express.Router();

// 🚀 අලුත් Middleware එක Import කිරීම
const authMiddleware = require("../middleware/authMiddleware");

// 📊 Controller එකෙන් Functions ටික වෙන් කරලා ගැනීම
const { getProductionVsSalesStats, getFinancialStats } = require("../controllers/analyticsController");

// --- Routes ---
// මෙතන protect වෙනුවට 'authMiddleware' පාවිච්චි කරන්න
// admin වෙනුවට 'authMiddleware.admin' පාවිච්චි කරන්න
router.get("/production-vs-sales", authMiddleware, authMiddleware.admin, getProductionVsSalesStats);
router.get("/financial-stats", authMiddleware, authMiddleware.admin, getFinancialStats);

module.exports = router;