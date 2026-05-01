const HOSPITAL = require("../models/hospital.model");

// GET /api/hospitals — all hospitals (with optional city filter & text search)
const getAllHospitals = async (req, res, next) => {
  try {
    const { city, search, page = 1, limit = 50 } = req.query;

    const query = { isActive: true };
    if (city) query.city = new RegExp(city.trim(), "i");

    if (search) {
      query.$text = { $search: search.trim() };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [hospitals, total] = await Promise.all([
      HOSPITAL.find(query).skip(skip).limit(Number(limit)).sort({ name: 1 }),
      HOSPITAL.countDocuments(query),
    ]);

    return res.status(200).json({
      msg: "Hospitals retrieved successfully!",
      hospitals,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    return next(error);
  }
};

// GET /api/hospitals/nearby?lat=X&lng=Y&radius=5000
// Returns hospitals sorted by distance (requires coordinates seeded)
const getNearbyHospitals = async (req, res, next) => {
  try {
    const { lat, lng, radius = 5000 } = req.query;

    if (!lat || !lng) {
      const error = new Error("lat and lng query params are required");
      error.statusCode = 400;
      return next(error);
    }

    const hospitals = await HOSPITAL.find({
      isActive: true,
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [Number(lng), Number(lat)],
          },
          $maxDistance: Number(radius),
        },
      },
    }).limit(20);

    return res.status(200).json({
      msg: "Nearby hospitals retrieved successfully!",
      hospitals,
      count: hospitals.length,
    });
  } catch (error) {
    return next(error);
  }
};

// GET /api/hospitals/search?q=apollo
const searchHospitals = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q || !q.trim()) {
      const error = new Error("Search query 'q' is required");
      error.statusCode = 400;
      return next(error);
    }

    const hospitals = await HOSPITAL.find({
      isActive: true,
      $or: [
        { name: new RegExp(q.trim(), "i") },
        { address: new RegExp(q.trim(), "i") },
        { city: new RegExp(q.trim(), "i") },
      ],
    })
      .limit(20)
      .sort({ name: 1 });

    return res.status(200).json({
      msg: "Search results",
      hospitals,
      count: hospitals.length,
    });
  } catch (error) {
    return next(error);
  }
};

// GET /api/hospitals/:id
const getSingleHospital = async (req, res, next) => {
  try {
    const hospital = await HOSPITAL.findById(req.params.id);

    if (!hospital) {
      const error = new Error("Hospital not found");
      error.statusCode = 404;
      return next(error);
    }

    return res.status(200).json({
      msg: "Hospital retrieved successfully!",
      hospital,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getAllHospitals,
  getNearbyHospitals,
  searchHospitals,
  getSingleHospital,
};
