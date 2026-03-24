const authMiddleware = require("../middleware/authMiddleware");
const { addLog, getAllLogs } = require("../controllers/MaintenanceController");

router.post("/", authMiddleware, authMiddleware.admin, addLog);
router.get("/", authMiddleware, authMiddleware.admin, getAllLogs);

module.exports = router;