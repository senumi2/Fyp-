const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const maintenanceController = require("../controllers/maintenanceRepairLogsController");

// --- Routes ---
// 🚀 මම Controller එක ඇතුළට addLog සහ getAllLogs දැම්මා. දැන් මේවා වැඩ!
router.post("/", authMiddleware, maintenanceController.addLog);
router.get("/", authMiddleware,  maintenanceController.getAllLogs);

router.put("/:id", authMiddleware, maintenanceController.updateLog); // Update සඳහා
router.delete("/:id", authMiddleware, maintenanceController.deleteLog); // Delete සඳහා

module.exports = router;