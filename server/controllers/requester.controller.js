const REQUESTER = require("../models/requester.model");
const REQUEST = require("../models/request.model");
const STATUSLOG = require("../models/status.model");
const INVENTORY = require("../models/inventory.model");
const HOSPITAL = require("../models/hospital.model");
const { notifyNewRequest, notifyRequestUpdate, getIO } = require("../socket/socket");
const { sendMail } = require("../utils/mailer");
const {
  requestCreated,
  requestDelivered,
} = require("../utils/emailTemplates");

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

    // ── Duplicate active-request guard ──
    const activeRequest = await REQUEST.findOne({
      requester: requester._id,
      status: { $in: ["searching", "accepted", "in-transit"] },
    });
    if (activeRequest) {
      const error = new Error(
        "You already have an active request. Cancel or wait for it to complete.",
      );
      error.statusCode = 400;
      return next(error);
    }

    const {
      bloodType,
      unitsRequired,
      hospitalName,
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
      hospital: {
        name: String(hospitalName).trim(),
        address: String(hospitalAddress).trim(),
      },
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

    // ── Low-stock inventory check (warn only, don't block) ──
    let lowStock = false;
    if (normalizedType === "blood" && bloodType) {
      try {
        // Find the hospital by name to get its _id
        const hospital = await HOSPITAL.findOne({
          name: { $regex: new RegExp(`^${String(hospitalName).trim()}$`, "i") },
        });
        if (hospital) {
          const inventory = await INVENTORY.findOne({
            hospitalId: hospital._id,
            bloodGroup: String(bloodType).trim(),
          });
          if (!inventory || inventory.units < parsedUnits) {
            lowStock = true;
          }
        }
      } catch (inventoryErr) {
        // Inventory check is non-critical — don't fail the request
        console.error("[Inventory check]", inventoryErr.message);
      }
    }

    // Fire-and-forget email to requester
    if (requester.email) {
      sendMail(
        requester.email,
        "BloodFlow — Request Created",
        requestCreated(
          requester.name || "Requester",
          newRequest.bloodGroup,
          newRequest.hospital?.name || hospitalAddress,
        ),
      );
    }

    return res.status(201).json({
      msg: "Request created successfully!",
      request: newRequest,
      ...(lowStock && { lowStock: true }),
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

    const request = await REQUEST.findById(req.params.id).populate(
      "dispatcher",
      "name email",
    );

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

    // The dispatcher marks the request as "delivered" first (deliverRequest),
    // then the requester confirms with PIN — so we check for "delivered" status.
    if (request.status !== "delivered") {
      const error = new Error(
        "PIN can be verified only when request is delivered",
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

    const statusLog = await STATUSLOG.create({
      request: request._id,
      changedBy: req.requester._id,
      changedByRole: "requester",
      newStatus: "delivered",
    });

    request.statusHistory.push(statusLog._id);
    await request.save();
    notifyRequestUpdate(request);

    // Fire-and-forget email to both requester and dispatcher
    const requesterEmail = req.requester.email;
    const dispatcherEmail = request.dispatcher?.email;
    if (requesterEmail) {
      sendMail(
        requesterEmail,
        "BloodFlow — Delivery Confirmed",
        requestDelivered(req.requester.name || "Requester"),
      );
    }
    if (dispatcherEmail) {
      sendMail(
        dispatcherEmail,
        "BloodFlow — Delivery Confirmed",
        requestDelivered(request.dispatcher.name || "Dispatcher"),
      );
    }

    return res.status(200).json({
      msg: "Delivery confirmed successfully!",
      request,
    });
  } catch (error) {
    return next(error);
  }
};

// ── Cancel request (requester) ──
const cancelRequest = async (req, res, next) => {
  try {
    const request = await REQUEST.findById(req.params.id);

    if (!request) {
      const error = new Error("Request not found");
      error.statusCode = 404;
      return next(error);
    }

    if (String(request.requester) !== String(req.requester._id)) {
      const error = new Error("You are not authorized to cancel this request");
      error.statusCode = 403;
      return next(error);
    }

    if (!["searching", "accepted"].includes(request.status)) {
      const error = new Error(
        "Only searching or accepted requests can be cancelled",
      );
      error.statusCode = 400;
      return next(error);
    }

    // If a dispatcher was already assigned, notify them
    if (request.status === "accepted" && request.dispatcher) {
      try {
        const io = getIO();
        io.to(`dispatcher_${request.dispatcher}`).emit("request_cancelled", {
          requestId: request._id,
          message: "The requester has cancelled this request.",
        });
      } catch (_) {
        // Socket notification failure is non-critical
      }
    }

    request.status = "cancelled";

    const statusLog = await STATUSLOG.create({
      request: request._id,
      changedBy: req.requester._id,
      changedByRole: "requester",
      newStatus: "cancelled",
    });

    request.statusHistory.push(statusLog._id);
    await request.save();
    notifyRequestUpdate(request);

    return res.status(200).json({
      msg: "Request cancelled successfully.",
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
  cancelRequest,
};
