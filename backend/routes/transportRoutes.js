const express = require("express");
const router = express.Router(); // 🚀 මෙන්න මේ පේළිය අඩුවෙලයි තිබුණේ
const { addTransport, getAllTransports } = require("../controllers/TransportController");
const authMiddleware = require("../middleware/authMiddleware");

// --- Routes ---
router.post("/", authMiddleware, authMiddleware.admin, addTransport);
router.get("/", authMiddleware, authMiddleware.admin, getAllTransports);

module.exports = router;