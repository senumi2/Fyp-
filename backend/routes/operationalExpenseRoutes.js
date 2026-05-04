const express = require('express');
const router = express.Router();
const financeController = require('../controllers/operationalExpenseController');

// දැනට තිබෙන routes වලට පහළින් මේවා එකතු කරන්න
router.get('/operational', financeController.getOperationalExpenses);
router.post('/operational', financeController.addOperationalExpense);
router.put('/operational/:id', financeController.updateOperationalExpense);
router.delete('/operational/:id', financeController.deleteOperationalExpense);

module.exports = router;