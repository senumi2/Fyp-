const Order = require("../models/Order");
const Harvest = require("../models/Harvest");
const Wage = require("../models/Wage");
const Transport = require("../models/Transport");
const Maintenance = require("../models/MaintenanceRepairLogs");
const Operational = require("../models/OperationalExpense");

const getFinancialStats = async (req, res) => {
    try {
        const { year, month } = req.query;
        let matchStage = {};

        if (year) {
            const startYear = parseInt(year);
            if (month && month !== "") {
                const m = parseInt(month);
                // Javascript months are 0-indexed, but Mongo $month is 1-indexed
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
            
            pipeline.push({ 
                $group: { 
                    _id: { $month: "$date" }, 
                    totalAmount: { $sum: `$${sumField}` } 
                } 
            });
            pipeline.push({ $sort: { "_id": 1 } });
            return await Model.aggregate(pipeline);
        };

        // Models වල තිබෙන නිවැරදි Field Names මෙහි ඇතුළත් කර ඇත
        const incomeStats = await aggregateWithFilter(Order, "amount");
        const wageStats = await aggregateWithFilter(Wage, "total");
        const transportStats = await aggregateWithFilter(Transport, "total");
        const maintenanceStats = await aggregateWithFilter(Maintenance, "cost"); // Schema එකේ 'cost' ලෙස තිබිය යුතුය
        const operationalStats = await aggregateWithFilter(Operational, "amount");

        res.json({ incomeStats, wageStats, transportStats, maintenanceStats, operationalStats });
    } catch (err) {
        res.status(500).json({ message: "Error fetching financial stats", error: err.message });
    }
};

const getProductionVsSalesStats = async (req, res) => {
    try {
        // ඔබගේ logic එක මෙහි ලියන්න
        res.json({ message: "Production vs Sales Stats" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// analyticsController.js අවසානයට මෙය යොදන්න
module.exports = {  getFinancialStats,  getProductionVsSalesStats };