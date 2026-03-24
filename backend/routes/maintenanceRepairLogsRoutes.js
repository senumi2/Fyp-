const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const maintenanceController = require("../controllers/maintenanceRepairLogsController");

// --- Routes ---
// 🚀 මම Controller එක ඇතුළට addLog සහ getAllLogs දැම්මා. දැන් මේවා වැඩ!
router.post("/", authMiddleware, authMiddleware.admin, maintenanceController.addLog);
router.get("/", authMiddleware, authMiddleware.admin, maintenanceController.getAllLogs);

module.exports = router;