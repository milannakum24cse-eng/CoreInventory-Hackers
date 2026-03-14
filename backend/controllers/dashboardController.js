const Product = require("../models/Product");
const Category = require("../models/Category");
const Supplier = require("../models/Supplier");
const StockMovement = require("../models/StockMovement");
const { asyncHandler } = require("../middleware/errorHandler");

// GET /api/dashboard
const getDashboard = asyncHandler(async (req, res) => {
  const [
    totalProducts,
    totalCategories,
    totalSuppliers,
    lowStockProducts,
    outOfStockProducts,
    recentMovements,
    topProducts,
  ] = await Promise.all([
    Product.countDocuments({ isActive: true }),
    Category.countDocuments(),
    Supplier.countDocuments({ isActive: true }),
    // Low stock: quantity <= lowStockThreshold but > 0
    Product.countDocuments({
      isActive: true,
      $expr: { $and: [{ $lte: ["$quantity", "$lowStockThreshold"] }, { $gt: ["$quantity", 0] }] },
    }),
    Product.countDocuments({ isActive: true, quantity: 0 }),
    StockMovement.find()
      .populate("product", "name sku")
      .sort({ createdAt: -1 })
      .limit(10),
    // Top 5 products by quantity value
    Product.find({ isActive: true })
      .select("name sku quantity price")
      .sort({ quantity: -1 })
      .limit(5),
  ]);

  // Total inventory value
  const valueAgg = await Product.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: null, totalValue: { $sum: { $multiply: ["$quantity", "$costPrice"] } } } },
  ]);
  const totalInventoryValue = valueAgg[0]?.totalValue || 0;

  res.json({
    success: true,
    data: {
      totalProducts,
      totalCategories,
      totalSuppliers,
      lowStockProducts,
      outOfStockProducts,
      totalInventoryValue,
      recentMovements,
      topProducts,
    },
  });
});

module.exports = { getDashboard };
