const Order = require("../models/Order");
const Harvest = require("../models/Harvest");
const Wage = require("../models/Wage");
const Transport = require("../models/Transport");
const Maintenance = require("../models/MaintenanceRepairLogs");

// 📊 1. Production vs Sales Stats (අස්වැන්න සහ විකුණුම් සංසන්දනය)
const getProductionVsSalesStats = async (req, res) => {
    try {
        // ඇණවුම් වලින් විකුණුම් ප්‍රමාණය (Quantity) සහ මුදල (Amount) ලබා ගැනීම
        const salesStats = await Order.aggregate([
            {
                $group: {
                    _id: { $month: "$date" },
                    totalSales: { $sum: "$amount" }, // මුළු මුදල
                    totalQuantity: { $sum: "$quantity" } // මුළු කිලෝ ගණන
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        // අස්වැන්න (Harvest) දත්ත ලබා ගැනීම
        const harvestStats = await Harvest.aggregate([
            { $unwind: "$records" },
            {
                $group: {
                    _id: { $month: "$records.date" },
                    totalHarvest: { $sum: "$records.quantity" }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        res.json({ salesStats, harvestStats });
    } catch (err) {
        res.status(500).json({ message: "Error fetching analytics", error: err.message });
    }
};

// 💰 2. Financial Stats (වියදම් දත්ත ලබා ගැනීම)
const getFinancialStats = async (req, res) => {
    try {
        // වැටුප් වියදම්
        const wageStats = await Wage.aggregate([
            { $group: { _id: { $month: "$date" }, total: { $sum: "$total" } } },
            { $sort: { "_id": 1 } }
        ]);

        // ප්‍රවාහන වියදම්
        const transportStats = await Transport.aggregate([
            { $group: { _id: { $month: "$date" }, total: { $sum: "$total" } } },
            { $sort: { "_id": 1 } }
        ]);

        // නඩත්තු වියදම්
        const maintenanceStats = await Maintenance.aggregate([
            { $group: { _id: { $month: "$date" }, total: { $sum: "$cost" } } },
            { $sort: { "_id": 1 } }
        ]);

        res.json({ wageStats, transportStats, maintenanceStats });
    } catch (err) {
        res.status(500).json({ message: "Error fetching financial stats", error: err.message });
    }
};

module.exports = {
    getProductionVsSalesStats,
    getFinancialStats
};