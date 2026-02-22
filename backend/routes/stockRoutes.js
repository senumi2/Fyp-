const express = require('express');
const router = express.Router();
const { addStock, getStocks } = require('../controllers/stockController');

router.post('/add', addStock);
router.get('/', getStocks);


module.exports = router;