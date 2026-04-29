const REQUESTER = require("../models/requester.model");
const REQUEST = require("../models/request.model");
const STATUSLOG = require("../models/status.model");
const { notifyNewRequest, notifyRequestUpdate } = require("../socket/socket");

const register = async (req, res, next) => {
  try {
    const { email, name, password } = req.body;

    const newUser = await REQUESTER.create({ name, email, password });

    return res.status(201).json({
      msg: "Registration successfully!",
      token: await newUser.generateToken(),
      userId: newUser._id.toString(),
    });
  } catch (error) {
    return next(error);
  }
};
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await REQUESTER.findOne({ email });

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      const error = new Error("Invalid credentials");
      error.statusCode = 401;
      return next(error);
    }

    return res.status(200).json({
      msg: "Login successful!",
      token: await user.generateToken(),
      userId: user._id.toString(),
    });
  } catch (error) {
    return next(error);
  }
};

const profile = async (req, res, next) => {
  try {
    const requester = req.requester;
    return res.status(200).json({
      msg: "Profile retrieved successfully!",
      requester,
    });
  } catch (error) {
    return next(error);
  }
};

//Form: Blood type, units required, hospital address, and "Urgency Level" (Normal vs. Critical).
const createRequest = async (req, res, next) => {
  try {
    const requester = req.requester;
    const {
      bloodType,
      unitsRequired,
      hospitalAddress,
      urgencyLevel,
      type,
      location,
      lat,
      lng,
    } = req.body;

    const parsedUnits = Number(unitsRequired);
    if (!Number.isFinite(parsedUnits) || parsedUnits <= 0) {
      const error = new Error("Units required must be a positive number");
      error.statusCode = 400;
      return next(error);
    }

    if (!hospitalAddress || !String(hospitalAddress).trim()) {
      const error = new Error("Hospital address is required");
      error.statusCode = 400;
      return next(error);
    }

    const normalizedType = (type || "blood").toString().toLowerCase();
    if (!["blood", "oxygen"].includes(normalizedType)) {
      const error = new Error("Type must be either blood or oxygen");
      error.statusCode = 400;
      return next(error);
    }

    if (
      normalizedType === "blood" &&
      (!bloodType || !String(bloodType).trim())
    ) {
      const error = new Error("Blood type is required for blood requests");
      error.statusCode = 400;
      return next(error);
    }

    const normalizedUrgency = (urgencyLevel || "normal")
      .toString()
      .toLowerCase();
    if (!["normal", "critical"].includes(normalizedUrgency)) {
      const error = new Error("Urgency level must be normal or critical");
      error.statusCode = 400;
      return next(error);
    }

    const latitude = location?.lat ?? lat;
    const longitude = location?.lng ?? lng;
    const parsedLat = latitude !== undefined ? Number(latitude) : undefined;
    const parsedLng = longitude !== undefined ? Number(longitude) : undefined;

    const hasCoordinates =
      Number.isFinite(parsedLat) && Number.isFinite(parsedLng);

    const newRequest = await REQUEST.create({
      requester: requester._id,
      type: normalizedType,
      bloodGroup:
        normalizedType === "blood" ? String(bloodType).trim() : undefined,
      units: parsedUnits,
      hospital: String(hospitalAddress).trim(),
      urgency: normalizedUrgency,
      location: hasCoordinates ? { lat: parsedLat, lng: parsedLng } : undefined,
    });

    const statusLog = await STATUSLOG.create({
      request: newRequest._id,
      changedBy: requester._id,
      changedByRole: "requester",
      newStatus: "searching",
    });

    newRequest.statusHistory.push(statusLog._id);
    await newRequest.save();
    notifyNewRequest(newRequest);

    return res.status(201).json({
      msg: "Request created successfully!",
      request: newRequest,
    });
  } catch (error) {
    return next(error);
  }
};

const getMyRequests = async (req, res, next) => {
  try {
    const requests = await REQUEST.find({ requester: req.requester._id })
      .populate("dispatcher", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      msg: "My requests retrieved successfully!",
      requests,
      count: requests.length,
    });
  } catch (error) {
    return next(error);
  }
};

const getSingleRequest = async (req, res, next) => {
  try {
    const request = await REQUEST.findById(req.params.id)
      .populate("requester", "name email")
      .populate("dispatcher", "name email")
      .populate("statusHistory");

    if (!request) {
      const error = new Error("Request not found");
      error.statusCode = 404;
      return next(error);
    }

    if (
      String(request.requester?._id || request.requester) !==
      String(req.requester._id)
    ) {
      const error = new Error("You are not authorized to access this request");
      error.statusCode = 403;
      return next(error);
    }

    return res.status(200).json({
      msg: "Request retrieved successfully!",
      request,
    });
  } catch (error) {
    return next(error);
  }
};

const verifyDeliveryPin = async (req, res, next) => {
  try {
    const { pin } = req.body;

    if (!pin) {
      const error = new Error("PIN is required");
      error.statusCode = 400;
      return next(error);
    }

    const request = await REQUEST.findById(req.params.id);

    if (!request) {
      const error = new Error("Request not found");
      error.statusCode = 404;
      return next(error);
    }

    if (String(request.requester) !== String(req.requester._id)) {
      const error = new Error("You are not authorized to verify this request");
      error.statusCode = 403;
      return next(error);
    }

    if (request.status !== "in-transit") {
      const error = new Error(
        "PIN can be verified only when request is in-transit",
      );
      error.statusCode = 400;
      return next(error);
    }

    if (request.deliveryPin !== String(pin).trim()) {
      const error = new Error("Invalid PIN");
      error.statusCode = 400;
      return next(error);
    }

    request.pinVerified = true;
    request.status = "delivered";

    const statusLog = await STATUSLOG.create({
      request: request._id,
      changedBy: req.requester._id,
      changedByRole: "requester",
      newStatus: "delivered",
    });

    request.statusHistory.push(statusLog._id);
    await request.save();
    notifyRequestUpdate(request);

    return res.status(200).json({
      msg: "Delivery confirmed successfully!",
      request,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  login,
  register,
  profile,
  createRequest,
  getMyRequests,
  getSingleRequest,
  verifyDeliveryPin,
};
