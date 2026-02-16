const express = require("express");
const router = express.Router();

const { 
    createMaintenance, 
    getMaintenance, 
    updateMaintenance, 
    deleteMaintenance 
} = require("../controllers/maintenanceController");


router.post("/", createMaintenance);
router.get("/", getMaintenance);
router.put("/:id", updateMaintenance);
router.delete("/:id", deleteMaintenance);

module.exports = router;