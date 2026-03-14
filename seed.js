/**
 * Seed script — populates inventoryDB with sample data.
 * Usage:
 *   node seed.js          → seed data
 *   node seed.js --clear  → wipe all collections
 */

const mongoose = require("mongoose");
require("dotenv").config();

const Product = require("./models/Product");
const Category = require("./models/Category");
const Supplier = require("./models/Supplier");
const StockMovement = require("./models/StockMovement");

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected to MongoDB");

  // Clear all
  await Promise.all([
    Product.deleteMany(),
    Category.deleteMany(),
    Supplier.deleteMany(),
    StockMovement.deleteMany(),
  ]);

  if (process.argv.includes("--clear")) {
    console.log("🗑️  Database cleared");
    process.exit(0);
  }

  // Categories
  const cats = await Category.insertMany([
    { name: "Electronics", description: "Electronic components and devices" },
    { name: "Office Supplies", description: "Stationery and office items" },
    { name: "Raw Materials", description: "Manufacturing inputs" },
    { name: "Packaging", description: "Boxes, wrap, labels" },
  ]);
  console.log(`✅ ${cats.length} categories created`);

  // Suppliers
  const sups = await Supplier.insertMany([
    { name: "TechParts India", contactPerson: "Amit Shah", email: "amit@techparts.in", phone: "9876543210" },
    { name: "OfficeWorld", contactPerson: "Priya Nair", email: "priya@officeworld.in", phone: "9123456780" },
  ]);
  console.log(`✅ ${sups.length} suppliers created`);

  // Products
  const products = await Product.insertMany([
    {
      name: "Arduino Uno R3",
      sku: "ELEC-001",
      description: "Microcontroller board",
      category: cats[0]._id,
      supplier: sups[0]._id,
      price: 650,
      costPrice: 400,
      quantity: 150,
      lowStockThreshold: 20,
      unit: "pcs",
      location: "Shelf A1",
    },
    {
      name: "A4 Paper Ream",
      sku: "OFF-001",
      description: "500 sheets, 80gsm",
      category: cats[1]._id,
      supplier: sups[1]._id,
      price: 280,
      costPrice: 200,
      quantity: 8,
      lowStockThreshold: 10,
      unit: "ream",
      location: "Shelf B3",
    },
    {
      name: "Copper Wire 1mm",
      sku: "RAW-001",
      description: "99.9% pure copper wire, 100m roll",
      category: cats[2]._id,
      supplier: sups[0]._id,
      price: 1200,
      costPrice: 900,
      quantity: 0,
      lowStockThreshold: 5,
      unit: "roll",
      location: "Warehouse C",
    },
  ]);
  console.log(`✅ ${products.length} products created`);

  console.log("\n🎉 Seed complete!");
  process.exit(0);
};

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
