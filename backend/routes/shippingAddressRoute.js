const express = require("express");
const router = express.Router();
const { 
  getShippingAddresses, 
  saveShippingAddress, 
  deleteShippingAddress 
} = require("../controllers/shippingAddressController");
const auth = require("../middleware/authMiddleware");

router.get("/", auth, getShippingAddresses);
router.post("/", auth, saveShippingAddress);
router.delete("/:id", auth, deleteShippingAddress); // ID එකෙන් Delete කිරීමට

module.exports = router;