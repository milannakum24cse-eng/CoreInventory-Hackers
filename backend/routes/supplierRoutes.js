const express = require("express");
const {
  getSuppliers,
  getSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} = require("../ims-app/controllers/supplierController");

const router = express.Router();

router.route("/").get(getSuppliers).post(createSupplier);
router.route("/:id").get(getSupplier).put(updateSupplier).delete(deleteSupplier);

module.exports = router;
