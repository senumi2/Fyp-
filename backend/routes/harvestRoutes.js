const express = require('express');
const router = express.Router();
const harvestController = require('../controllers/harvestController');

router.get('/', harvestController.getAllHarvests);
router.post('/add', harvestController.addHarvestRecord);

module.exports = router;