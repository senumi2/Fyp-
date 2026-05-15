const express = require('express');
const router = express.Router();
const { addStock, getStocks,updateStock,deleteStock } = require('../controllers/stockController');

router.post('/add', addStock);
router.get('/', getStocks);
router.put('/:id', updateStock);    
router.delete('/:id', deleteStock);



module.exports = router;