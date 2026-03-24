const Order = require("../models/Order");
const Harvest = require("../models/Harvest");

exports.getProductionVsSalesStats = async (req, res) => {
    try {
        // 1. මාසික විකුණුම් (Sales) ලබා ගැනීම
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

        // 2. මාසික අස්වැන්න (Harvest) ලබා ගැනීම
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

const Wage = require("../models/Wage");
const Transport = require("../models/Transport");
const Maintenance = require("../models/MaintenanceRepairLogs");

exports.getFinancialStats = async (req, res) => {
    try {
        // 1. මාසික වැටුප් වියදම
        const wageStats = await Wage.aggregate([
            { $group: { _id: { $month: "$date" }, total: { $sum: "$total" } } }
        ]);

        // 2. මාසික ප්‍රවාහන වියදම
        const transportStats = await Transport.aggregate([
            { $group: { _id: { $month: "$date" }, total: { $sum: "$total" } } }
        ]);

        // 3. මාසික නඩත්තු වියදම
        const maintenanceStats = await Maintenance.aggregate([
            { $group: { _id: { $month: "$date" }, total: { $sum: "$cost" } } }
        ]);

        res.json({ wageStats, transportStats, maintenanceStats });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};