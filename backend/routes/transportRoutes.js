const authMiddleware = require("../middleware/authMiddleware");
const { addTransport, getAllTransports } = require("../controllers/TransportController");

router.post("/", authMiddleware, authMiddleware.admin, addTransport);
router.get("/", authMiddleware, authMiddleware.admin, getAllTransports);

module.exports = router;