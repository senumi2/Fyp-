const Order = require("../models/Order");
const Harvest = require("../models/Harvest");
const Wage = require("../models/Wage");
const Transport = require("../models/Transport");
const Maintenance = require("../models/MaintenanceRepairLogs");
const Operational = require("../models/OperationalExpense");

// 📊 1. Production vs Sales Stats (පැරණි පරිදිම)
const getProductionVsSalesStats = async (req, res) => {
    try {
        const salesStats = await Order.aggregate([
            { $group: { _id: { $month: "$date" }, totalSales: { $sum: "$amount" }, totalQuantity: { $sum: "$quantity" } } },
            { $sort: { "_id": 1 } }
        ]);
        const harvestStats = await Harvest.aggregate([
            { $unwind: "$records" },
            { $group: { _id: { $month: "$records.date" }, totalHarvest: { $sum: "$records.quantity" } } },
            { $sort: { "_id": 1 } }
        ]);
        res.json({ salesStats, harvestStats });
    } catch (err) {
        res.status(500).json({ message: "Error fetching analytics", error: err.message });
    }
};

// 💰 2. Financial Stats (පෙරහන් සහිතව යාවත්කාලීන කරන ලදී)
const getFinancialStats = async (req, res) => {
    try {
        const { year, month } = req.query;
        let matchStage = {};

        // වර්ෂය සහ මාසය අනුව පෙරීමට අවශ්‍ය logic එක
        if (year) {
            const startYear = parseInt(year);
            if (month && month !== "") {
                const m = parseInt(month);
                matchStage = {
                    $match: {
                        date: {
                            $gte: new Date(startYear, m - 1, 1),
                            $lt: new Date(startYear, m, 1)
                        }
                    }
                };
            } else {
                matchStage = {
                    $match: {
                        date: {
                            $gte: new Date(startYear, 0, 1),
                            $lt: new Date(startYear + 1, 0, 1)
                        }
                    }
                };
            }
        }

        const aggregateWithFilter = async (Model, sumField) => {
            const pipeline = [];
            if (year) pipeline.push(matchStage);
            pipeline.push({ $group: { _id: { $month: "$date" }, total: { $sum: `$${sumField}` } } });
            pipeline.push({ $sort: { "_id": 1 } });
            return await Model.aggregate(pipeline);
        };

        const incomeStats = await aggregateWithFilter(Order, "amount");
        const wageStats = await aggregateWithFilter(Wage, "total");
        const transportStats = await aggregateWithFilter(Transport, "total");
        const maintenanceStats = await aggregateWithFilter(Maintenance, "cost");
        const operationalStats = await aggregateWithFilter(Operational, "amount");

        res.json({ incomeStats, wageStats, transportStats, maintenanceStats, operationalStats });
    } catch (err) {
        res.status(500).json({ message: "Error fetching financial stats", error: err.message });
    }
};

module.exports = { getProductionVsSalesStats, getFinancialStats };