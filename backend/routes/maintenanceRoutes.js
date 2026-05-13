const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const { 
    createMaintenance, 
    getMaintenance, 
    updateMaintenance, 
    deleteMaintenance 
} = require("../controllers/maintenanceController");


router.post("/", authMiddleware, authMiddleware.admin, createMaintenance);
router.get("/", authMiddleware, getMaintenance);
router.put("/:id", authMiddleware, authMiddleware.admin, updateMaintenance);
router.delete("/:id", authMiddleware, authMiddleware.admin, deleteMaintenance);

module.exports = router;