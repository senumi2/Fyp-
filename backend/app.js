const express = require("express");
const path = require("path");
const cors = require("cors");

const productRoutes = require("./routes/productRoute");
const eventRoutes = require("./routes/eventRoute");
const directorRoutes = require("./routes/directorRoute");
const authRoutes = require("./routes/authRoute");
const profileRoutes = require("./routes/profileRoute");
const reportRoutes = require("./routes/reportRoutes");

const app = express();

// ✅ CORS – allow frontend requests
app.use(cors({
  origin: [
    "http://localhost:3000", // React (CRA)
    "http://localhost:5173", // Vite
    "http://localhost:4000"  // if frontend runs here
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// ✅ Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Static folder (for images/files)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/uploads", express.static("uploads"));


// ✅ API routes
app.use("/api/products", productRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/directors", directorRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/reports", reportRoutes);
app.use("/api/shipping-address", require("./routes/shippingAddressRoute"));


// ✅ Test route
app.get("/", (req, res) => {
  res.status(200).json({ message: "API is running 🚀" });
});

module.exports = app;
