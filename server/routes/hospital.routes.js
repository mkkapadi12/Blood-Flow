const express = require("express");
const router = express.Router();
const hospitalController = require("../controllers/hospital.controller");

// Public routes — both requester & dispatcher can call these
router.get("/", hospitalController.getAllHospitals);
router.get("/nearby", hospitalController.getNearbyHospitals);
router.get("/search", hospitalController.searchHospitals);
router.get("/:id", hospitalController.getSingleHospital);

module.exports = router;
