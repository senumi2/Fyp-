const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const maintenanceController = require("../controllers/maintenanceRepairLogsController");


router.post("/", authMiddleware, maintenanceController.addLog);
router.get("/", authMiddleware,  maintenanceController.getAllLogs);

router.put("/:id", authMiddleware, maintenanceController.updateLog); 
router.delete("/:id", authMiddleware, maintenanceController.deleteLog); 

module.exports = router;