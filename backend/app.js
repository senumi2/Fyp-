const express = require("express");
const path = require("path");
const cors = require("cors");

// --- Routes Import ---
const productRoutes = require("./routes/productRoutes");
const eventRoutes = require("./routes/eventRoute");
const directorRoutes = require("./routes/directorRoutes");
const authRoutes = require("./routes/authRoute");
const profileRoutes = require("./routes/profileRoute");
const reportRoutes = require("./routes/reportRoutes");
const orderRoutes = require("./routes/orderRoutes");
const shippingAddressRoute = require("./routes/shippingAddressRoute");
const contactRoutes = require("./routes/contactRoutes");
const stockRoutes = require('./routes/stockRoutes');

const inventoryRoutes = require("./routes/inventoryRoutes");
const issueRoutes = require("./routes/issueRoutes"); 
const maintenanceRoutes = require("./routes/maintenanceRoutes");
const tankRoutes = require("./routes/tankRoutes");
const harvestRoutes = require("./routes/harvestRoutes");

const wageRoutes = require("./routes/wageRoutes");
const transportRoutes = require("./routes/transportRoutes");
const maintenanceRepairLogsRoutes = require("./routes/maintenanceRepairLogsRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const operationalExpenseRoutes = require("./routes/operationalExpenseRoutes");

const noticeRoutes = require("./routes/noticeRoutes");

const payhereRoutes = require("./routes/payhereRoute");

const weatherRoutes = require("./routes/weatherRoutes");
const predictionRoute = require("./routes/predictionRoute");

const productDetailsRoutes = require("./routes/productDetailRoute");

const emailRoute = require("./routes/emailRoute");

// Finance/Expenses Route
const financeRoutes = require("./routes/financeRoutes"); 

console.log("✅ All routes files loaded successfully");

const app = express();

// ✅ CORS Config
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:4000",
    "http://localhost:5173",
    "http://localhost:5174"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// ✅ Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.urlencoded({ extended: true })); 
app.use("/api/payhere", payhereRoutes);

// ✅ Static folders
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ API Routes Mount
app.use("/api/products", productRoutes);
app.use("/api/productdetail", productDetailsRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/directors", directorRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/shipping-address", shippingAddressRoute);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/issues", issueRoutes); 
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/contact", contactRoutes);
app.use('/api/stocks', stockRoutes);
app.use("/api/tanks", tankRoutes);
app.use("/api/harvest", harvestRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/wages", wageRoutes);
app.use("/api/transport", transportRoutes);
app.use("/api/maintenance-repair-logs", maintenanceRepairLogsRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/weather", weatherRoutes);
app.use("/api/prediction", predictionRoute);
app.use("/api/operational-expenses", operationalExpenseRoutes);
app.use("/api/email", emailRoute);

// Finance API
app.use("/api/finance", financeRoutes); 

// ✅ Test route
app.get("/", (req, res) => {
  res.json({ message: "API is running 🚀" });
});

module.exports = app;