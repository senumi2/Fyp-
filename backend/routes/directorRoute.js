const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const {
  createDirector,
  getDirectors,
} = require("../controllers/directorController");

router.post("/", upload.single("image"), createDirector);
router.get("/", getDirectors);

module.exports = router;
