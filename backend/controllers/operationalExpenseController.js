const OperationalExpense = require('../models/OperationalExpense');

// සියලුම වියදම් ලබා ගැනීම
exports.getOperationalExpenses = async (req, res) => {
    try {
        const expenses = await OperationalExpense.find().sort({ date: -1 });
        res.json(expenses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// අලුත් වියදමක් එකතු කිරීම
exports.addOperationalExpense = async (req, res) => {
    const expense = new OperationalExpense({
        description: req.body.description,
        category: req.body.category,
        amount: req.body.amount
    });

    try {
        const newExpense = await expense.save();
        res.status(201).json(newExpense);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// වියදමක් යාවත්කාලීන කිරීම (Update)
exports.updateOperationalExpense = async (req, res) => {
    try {
        const updatedExpense = await OperationalExpense.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true }
        );
        res.json(updatedExpense);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// වියදමක් මකා දැමීම (Delete)
exports.deleteOperationalExpense = async (req, res) => {
    try {
        await OperationalExpense.findByIdAndDelete(req.params.id);
        res.json({ message: "Expense deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};