const express = require("express");
const path = require("path");
const cors = require("cors");

const productRoutes = require("./routes/productRoutes");
console.log("✅ Product routes file loaded successfully"); // 👈 STEP 4 DEBUG

const eventRoutes = require("./routes/eventRoute");
const directorRoutes = require("./routes/directorRoutes");
const authRoutes = require("./routes/authRoute");
const profileRoutes = require("./routes/profileRoute");
const reportRoutes = require("./routes/reportRoutes");
const orderRoutes = require("./routes/orderRoutes");
const shippingAddressRoute = require("./routes/shippingAddressRoute");
const contactRoutes = require("./routes/contactRoutes");

const inventoryRoutes = require("./routes/inventoryRoutes");
const issueRoutes = require("./routes/issueRoutes");
const maintenanceRoutes = require("./routes/maintenanceRoutes");

 

const app = express();

// ✅ CORS – allow frontend requests
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

// ✅ Static folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/uploads", express.static("uploads"));

// 👇 Debug mount check
app.use("/api/products", (req, res, next) => {
  console.log("📦 /api/products route accessed");
  next();
}, productRoutes);

app.get("/api/test-product/:id", (req, res) => {
  res.json({ id: req.params.id });
});


// ✅ Other API routes
app.use("/api/events", eventRoutes);
app.use("/api/directors", directorRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/reports", reportRoutes);
app.use("/api/shipping-address", require("./routes/shippingAddressRoute"));

app.use("/api/inventory", inventoryRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/maintenance", maintenanceRoutes);

app.use("/api/contact", contactRoutes);




// ✅ Test route
app.get("/", (req, res) => {
  res.json({ message: "API is running 🚀" });
});

module.exports = app;
