const express = require("express");
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  adjustStock,
  getStockMovements
} = require("../controllers/productController");
 
const router = express.Router();
 
router.route("/").get(getProducts).post(createProduct);
router.route("/:id").get(getProduct).put(updateProduct).delete(deleteProduct);
router.route("/:id/stock").post(adjustStock);
router.route("/:id/movements").get(getStockMovements);
 
module.exports = router;
 