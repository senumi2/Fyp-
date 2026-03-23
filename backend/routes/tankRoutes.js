const express = require('express');
const router = express.Router();
const tankController = require('../controllers/tankController');

router.get('/', tankController.getAllTanks);

// අලුතින් Tank එකක් ඇතුළත් කිරීමට (Postman එකෙන් Test කිරීමට)
router.post('/', tankController.createTank);


router.post('/:id/salinity', tankController.addSalinity);

router.put('/:tankId/salinity/:recordId', tankController.updateSalinity);

router.post('/:id/weather', tankController.addOrUpdateWeather);

module.exports = router;


