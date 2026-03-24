const Order = require("../models/Order");
const Harvest = require("../models/Harvest");
const Wage = require("../models/Wage");
const Transport = require("../models/Transport");
const Maintenance = require("../models/MaintenanceRepairLogs");

// 📊 1. Production vs Sales Stats
const getProductionVsSalesStats = async (req, res) => {
    try {
        const salesStats = await Order.aggregate([
            {
                $group: {
                    _id: { $month: "$date" },
                    totalSales: { $sum: "$amount" },
                    totalQuantity: { $sum: "$quantity" }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

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

// 💰 2. Financial Stats (Updated with Sorting)
const getFinancialStats = async (req, res) => {
    try {
        const wageStats = await Wage.aggregate([
            { $group: { _id: { $month: "$date" }, total: { $sum: "$total" } } },
            { $sort: { "_id": 1 } } // මාස පිළිවෙළට sort කරයි
        ]);

        const transportStats = await Transport.aggregate([
            { $group: { _id: { $month: "$date" }, total: { $sum: "$total" } } },
            { $sort: { "_id": 1 } }
        ]);

        const maintenanceStats = await Maintenance.aggregate([
            { $group: { _id: { $month: "$date" }, total: { $sum: "$cost" } } },
            { $sort: { "_id": 1 } }
        ]);

        res.json({ wageStats, transportStats, maintenanceStats });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 🚀 සියල්ල එකවර Export කිරීම
module.exports = {
    getProductionVsSalesStats,
    getFinancialStats
};