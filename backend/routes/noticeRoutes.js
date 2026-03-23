const express = require("express");
const router = express.Router();
const { getPublicNotices } = require("../controllers/noticeController");

router.get("/all", getPublicNotices);

module.exports = router;