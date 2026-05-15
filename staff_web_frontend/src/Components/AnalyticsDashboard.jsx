import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; // නිවැරදි path එක පරීක්ෂා කරන්න
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import "./AnalyticsDashboard.css";

const AnalyticsDashboard = ({ year = 2026 }) => {
  const { token } = useAuth();
  const [productionData, setProductionData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        const [prodRes, finRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/analytics/production-vs-sales?year=${year}`, config),
          axios.get(`http://localhost:5000/api/analytics/financial-stats?year=${year}`, config)
        ]);

        // --- 1. Production vs Sales Data Parsing ---
        const formattedProd = monthNames.map((month) => ({
          name: month,
          harvest: 0,
          sales: 0
        }));

        if (prodRes.data.harvestStats) {
          prodRes.data.harvestStats.forEach(item => {
            if (item._id >= 1 && item._id <= 12) {
              formattedProd[item._id - 1].harvest = Math.max(0, item.totalHarvest || 0);
            }
          });
        }

        if (prodRes.data.salesStats) {
          prodRes.data.salesStats.forEach(item => {
            if (item._id >= 1 && item._id <= 12) {
              formattedProd[item._id - 1].sales = Math.max(0, item.totalQuantity || 0);
            }
          });
        }
        setProductionData(formattedProd);

        // --- 2. Financial Stats Data Parsing (FIXED LOGIC) ---
        const { incomeStats, wageStats, transportStats, maintenanceStats, operationalStats } = finRes.data;
        
        // Backend එකෙන් එන array එකේ තියෙන 'totalAmount' field එකේ අගයන් එකතු කිරීමේ නිවැරදි ශ්‍රිතය
        const calcTotal = (arr) => {
          if (!arr || !Array.isArray(arr)) return 0;
          return arr.reduce((acc, curr) => acc + Math.max(0, curr.totalAmount || 0), 0);
        };

        const pieData = [
          { name: "Wages", value: calcTotal(wageStats) },
          { name: "Transport", value: calcTotal(transportStats) },
          { name: "Maintenance", value: calcTotal(maintenanceStats) },
          { name: "Operational", value: calcTotal(operationalStats) }
        ].filter(item => item.value > 0); // 0 ට වඩා වැඩි දේවල් විතරක් පෙන්වන්න

        setExpenseData(pieData);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
        if (error.response && error.response.status === 401) {
          setError("You are not authorized. Please login again.");
        } else {
          setError("Failed to load dashboard data.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    } else {
      setError("No authentication token found. Please login.");
      setLoading(false);
    }
  }, [year, token]);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  if (loading) return <div className="loading">Loading Analytics...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="dashboard-container">
      <h2 className="view-title">Production & Operational Analytics {year} </h2>

      <div className="charts-grid">
        {/* Production vs Sales Chart */}
        <div className="chart-card">
          <h3>Harvest vs Sales (kg)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={productionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="harvest" stroke="#82ca9d" name="Harvest (kg)" strokeWidth={2} />
              <Line type="monotone" dataKey="sales" stroke="#8884d8" name="Sales (kg)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Expense Pie Chart (FIXED RESPONSIVE CONTAINER ISSUE) */}
        <div className="chart-card pie-card">
          <h3>Operational Cost Distribution (LKR)</h3>
          {expenseData.length > 0 ? (
            <div className="pie-chart-wrapper">
              <PieChart width={350} height={300}>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="45%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={75}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `Rs. ${value.toLocaleString()}`} />
                <Legend layout="horizontal" align="center" verticalAlign="bottom" />
              </PieChart>
            </div>
          ) : (
            <div className="no-data">No expense data available for {year}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;