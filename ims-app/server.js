const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("../middleware/errorHandler");

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/dashboard", require("../routes/dashboardRoutes"));
app.use("/api/products",  require("../routes/productRoutes"));
app.use("/api/categories",require("../routes/categoryRoutes"));
app.use("/api/suppliers", require("../routes/supplierRoutes"));

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅  Server running → http://localhost:${PORT}`));