const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventory.controller");
const dispatcherMiddleware = require("../middlewares/dispatcher.middleware");
const validate = require("../middlewares/validate.middleware");
const {
  updateInventorySchema,
} = require("../validators/inventory.validator");

// GET /api/inventory?bloodGroup=A+&city=Ahmedabad (public)
router.get("/", inventoryController.getInventory);

// GET /api/inventory/hospital/:hospitalId (public)
router.get("/hospital/:hospitalId", inventoryController.getHospitalInventory);

// PATCH /api/inventory/:hospitalId (dispatcher auth)
router.patch(
  "/:hospitalId",
  dispatcherMiddleware,
  validate(updateInventorySchema),
  inventoryController.updateInventory,
);

module.exports = router;
