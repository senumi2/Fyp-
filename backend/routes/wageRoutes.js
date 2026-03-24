const express = require("express");
const router = express.Router();
const { addWage, getAllWages } = require("../controllers/wageController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, authMiddleware.admin, addWage);
router.get("/", authMiddleware, authMiddleware.admin, getAllWages);

module.exports = router;