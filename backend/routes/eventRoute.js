const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const {
  createEvent,
  getEvents,
  deleteEvent
} = require("../controllers/eventController");

// Public
router.get("/", getEvents);

// Admin only
router.post("/", auth, admin, upload.single("image"), createEvent);
router.delete("/:id", auth, admin, deleteEvent);

module.exports = router;

