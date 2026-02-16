const express = require("express");
const router = express.Router();
const { createInventory, getInventory, updateInventory, deleteInventory } = require("../controllers/inventoryController");

router.post("/", createInventory);
router.get("/", getInventory);
router.put("/:id", updateInventory);
router.delete("/:id", deleteInventory);

module.exports = router;