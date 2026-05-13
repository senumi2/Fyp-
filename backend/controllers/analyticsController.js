const Order = require("../models/Order");
const Harvest = require("../models/Harvest");
const Wage = require("../models/Wage");
const Transport = require("../models/Transport");
const Maintenance = require("../models/MaintenanceRepairLogs");
const Operational = require("../models/OperationalExpense");

exports.getFinancialStats = async (req, res) => {
    try {
        const { year, month } = req.query;
        let matchStage = {};

        if (year) {
            const startYear = parseInt(year);
            if (month && month !== "") {
                const m = parseInt(month);
                matchStage = {
                    $match: {
                        date: {
                            $gte: new Date(Date.UTC(startYear, m - 1, 1)),
                            $lt: new Date(Date.UTC(startYear, m, 1))
                        }
                    }
                };
            } else {
                matchStage = {
                    $match: {
                        date: {
                            $gte: new Date(Date.UTC(startYear, 0, 1)),
                            $lt: new Date(Date.UTC(startYear + 1, 0, 1))
                        }
                    }
                };
            }
        }

        const aggregateWithFilter = async (Model, sumField) => {
            const pipeline = [];
            if (Object.keys(matchStage).length > 0) pipeline.push(matchStage);
            pipeline.push({ $group: { _id: { $month: "$date" }, totalAmount: { $sum: `$${sumField}` } } });
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

exports.getProductionVsSalesStats = async (req, res) => {
    try {
        const requestedYear = parseInt(req.query.year) || 2026;
        const startOfYear = new Date(Date.UTC(requestedYear, 0, 1));
        const endOfYear = new Date(Date.UTC(requestedYear + 1, 0, 1));

        // Harvest Stats: Adding the values ​​inside the records array
        const harvestStats = await Harvest.aggregate([
            { $unwind: "$records" }, 
            {
                $match: {
                    "records.date": { $gte: startOfYear, $lt: endOfYear }
                }
            },
            {
                $group: {
                    _id: { $month: "$records.date" },
                    totalHarvest: { $sum: "$records.quantity" }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        
        const salesStats = await Order.aggregate([
            {
                $match: {
                    date: { $gte: startOfYear, $lt: endOfYear }
                }
            },
            {
                $group: {
                    _id: { $month: "$date" },
                    totalQuantity: { $sum: "$quantity" }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        res.json({ harvestStats, salesStats });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};