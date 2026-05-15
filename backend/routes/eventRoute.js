const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/authMiddleware");

const {
  createEvent,
  getEvents,
  deleteEvent
} = require("../controllers/eventController");

// Public
router.get("/", getEvents);


router.post("/", authMiddleware, authMiddleware.admin, upload.single("image"), createEvent);
router.delete("/:id", authMiddleware, authMiddleware.admin, deleteEvent);

module.exports = router;