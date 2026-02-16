const express = require("express");
const router = express.Router();
const { createIssue, getIssues, updateIssue, deleteIssue } = require("../controllers/issueController");

router.post("/", createIssue);
router.get("/", getIssues);
router.put("/:id", updateIssue);
router.delete("/:id", deleteIssue);

module.exports = router;