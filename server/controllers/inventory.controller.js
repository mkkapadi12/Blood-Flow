const INVENTORY = require("../models/inventory.model");
const HOSPITAL = require("../models/hospital.model");

/**
 * GET /api/inventory?bloodGroup=A+&city=Ahmedabad
 * Public — returns all hospitals with stock > 0 for the given blood group.
 */
const getInventory = async (req, res, next) => {
  try {
    const { bloodGroup, city } = req.query;

    const filter = { units: { $gt: 0 } };
    if (bloodGroup) filter.bloodGroup = bloodGroup;

    // If city is provided we need to filter by hospital city
    let hospitalIds = null;
    if (city) {
      const hospitals = await HOSPITAL.find({
        city: { $regex: new RegExp(city, "i") },
      }).select("_id");
      hospitalIds = hospitals.map((h) => h._id);
      filter.hospitalId = { $in: hospitalIds };
    }

    const inventory = await INVENTORY.find(filter)
      .populate("hospitalId", "name city address")
      .sort({ updatedAt: -1 });

    return res.status(200).json({
      msg: "Inventory retrieved successfully!",
      inventory,
      count: inventory.length,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * PATCH /api/inventory/:hospitalId
 * Dispatcher auth — upserts inventory record for a blood group at a hospital.
 */
const updateInventory = async (req, res, next) => {
  try {
    const { hospitalId } = req.params;
    const { bloodGroup, units } = req.body;

    const hospital = await HOSPITAL.findById(hospitalId);
    if (!hospital) {
      const error = new Error("Hospital not found");
      error.statusCode = 404;
      return next(error);
    }

    const inventory = await INVENTORY.findOneAndUpdate(
      { bloodGroup, hospitalId },
      { bloodGroup, units, hospitalId },
      { upsert: true, new: true, runValidators: true },
    );

    return res.status(200).json({
      msg: "Inventory updated successfully!",
      inventory,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * GET /api/inventory/hospital/:hospitalId
 * Public — returns full inventory breakdown for one hospital.
 */
const getHospitalInventory = async (req, res, next) => {
  try {
    const { hospitalId } = req.params;

    const hospital = await HOSPITAL.findById(hospitalId).select("name city address");
    if (!hospital) {
      const error = new Error("Hospital not found");
      error.statusCode = 404;
      return next(error);
    }

    const inventory = await INVENTORY.find({ hospitalId }).sort({
      bloodGroup: 1,
    });

    return res.status(200).json({
      msg: "Hospital inventory retrieved successfully!",
      hospital,
      inventory,
      count: inventory.length,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getInventory,
  updateInventory,
  getHospitalInventory,
};
