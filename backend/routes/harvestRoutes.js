const express = require('express');
const router = express.Router();
const harvestController = require('../controllers/harvestController');

router.get('/', harvestController.getAllHarvests);
router.post('/add', harvestController.addHarvestRecord);
router.put('/update/:category/:recordId', harvestController.updateHarvestRecord);
router.delete('/delete/:category/:recordId', harvestController.deleteHarvestRecord);

module.exports = router;