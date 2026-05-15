const express = require("express");
const router = express.Router(); 
const { addTransport, getAllTransports } = require("../controllers/TransportController");
const authMiddleware = require("../middleware/authMiddleware");

// --- Routes ---
router.post("/", authMiddleware, authMiddleware.admin, addTransport);
router.get("/", authMiddleware, authMiddleware.admin, getAllTransports);

module.exports = router;