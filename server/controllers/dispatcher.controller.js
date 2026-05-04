const DISPATCHER = require("../models/dispatcher.model");
const REQUEST = require("../models/request.model");
const STATUSLOG = require("../models/status.model");
const {
  notifyRequestUpdate,
  notifyArrived,
  notifyLocationUpdate,
} = require("../socket/socket");
const { sendMail } = require("../utils/mailer");
const {
  requestAccepted,
  requestInTransit,
  pinRequired,
} = require("../utils/emailTemplates");

const register = async (req, res, next) => {
  try {
    const { email, name, password } = req.body;

    const existingDispatcher = await DISPATCHER.findOne({ email });
    if (existingDispatcher) {
      const error = new Error("Dispatcher already exists");
      error.statusCode = 400;
      return next(error);
    }

    const newDispatcher = await DISPATCHER.create({ name, email, password });

    return res.status(201).json({
      msg: "Registration successfully!",
      token: await newDispatcher.generateToken(),
      userId: newDispatcher._id.toString(),
    });
  } catch (error) {
    return next(error);
  }
};
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const dispatcher = await DISPATCHER.findOne({ email });

    if (!dispatcher) {
      const error = new Error("Dispatcher not found");
      error.statusCode = 404;
      return next(error);
    }

    const isMatch = await dispatcher.comparePassword(password);

    if (!isMatch) {
      const error = new Error("Invalid credentials");
      error.statusCode = 401;
      return next(error);
    }

    return res.status(200).json({
      msg: "Login successful!",
      token: await dispatcher.generateToken(),
      dispatcherId: dispatcher._id.toString(),
    });
  } catch (error) {
    return next(error);
  }
};

const profile = async (req, res, next) => {
  try {
    const dispatcher = req.dispatcher;
    return res.status(200).json({
      msg: "Profile retrieved successfully!",
      dispatcher,
    });
  } catch (error) {
    return next(error);
  }
};

const getAllRequests = async (req, res, next) => {
  try {
    const requests = await REQUEST.find({ status: { $ne: "cancelled" } })
      .populate("requester", "name email")
      .populate("dispatcher", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      msg: "Requests retrieved successfully!",
      requests,
      count: requests.length,
    });
  } catch (error) {
    return next(error);
  }
};

const getMyRequests = async (req, res, next) => {
  try {
    const requests = await REQUEST.find({ dispatcher: req.dispatcher._id })
      .populate("requester", "name email")
      .populate("dispatcher", "name email")
      .sort({ updatedAt: -1, createdAt: -1 });

    return res.status(200).json({
      msg: "Assigned requests retrieved successfully!",
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

    return res.status(200).json({
      msg: "Request retrieved successfully!",
      request,
    });
  } catch (error) {
    return next(error);
  }
};

const changeRequestStatus = async ({
  request,
  dispatcherId,
  nextStatus,
  savePin,
}) => {
  request.status = nextStatus;
  if (savePin !== undefined) {
    request.pinVerified = false;
  }

  const statusLog = await STATUSLOG.create({
    request: request._id,
    changedBy: dispatcherId,
    changedByRole: "dispatcher",
    newStatus: nextStatus,
  });

  request.statusHistory.push(statusLog._id);
  await request.save();
  notifyRequestUpdate(request);
};

const acceptRequest = async (req, res, next) => {
  try {
    const request = await REQUEST.findById(req.params.id).populate(
      "requester",
      "name email",
    );

    if (!request) {
      const error = new Error("Request not found");
      error.statusCode = 404;
      return next(error);
    }

    if (request.status !== "searching") {
      const error = new Error("Only searching requests can be accepted");
      error.statusCode = 400;
      return next(error);
    }

    request.dispatcher = req.dispatcher._id;
    await changeRequestStatus({
      request,
      dispatcherId: req.dispatcher._id,
      nextStatus: "accepted",
    });

    // Fire-and-forget email to requester
    if (request.requester?.email) {
      sendMail(
        request.requester.email,
        "BloodFlow — Your request has been accepted",
        requestAccepted(
          request.requester.name || "Requester",
          req.dispatcher.name || "A dispatcher",
        ),
      );
    }

    return res.status(200).json({
      msg: "Request accepted successfully!",
      request,
    });
  } catch (error) {
    return next(error);
  }
};

const pickupRequest = async (req, res, next) => {
  try {
    const request = await REQUEST.findById(req.params.id).populate(
      "requester",
      "name email",
    );

    if (!request) {
      const error = new Error("Request not found");
      error.statusCode = 404;
      return next(error);
    }

    if (String(request.dispatcher || "") !== String(req.dispatcher._id)) {
      const error = new Error("You can only pickup your assigned requests");
      error.statusCode = 403;
      return next(error);
    }

    if (request.status !== "accepted") {
      const error = new Error(
        "Only accepted requests can be marked in-transit",
      );
      error.statusCode = 400;
      return next(error);
    }

    await changeRequestStatus({
      request,
      dispatcherId: req.dispatcher._id,
      nextStatus: "in-transit",
    });

    // Fire-and-forget email to requester
    if (request.requester?.email) {
      sendMail(
        request.requester.email,
        "BloodFlow — Blood is on its way!",
        requestInTransit(request.requester.name || "Requester"),
      );
    }

    return res.status(200).json({
      msg: "Request marked as in-transit!",
      request,
    });
  } catch (error) {
    return next(error);
  }
};

const deliverRequest = async (req, res, next) => {
  try {
    const request = await REQUEST.findById(req.params.id).populate(
      "requester",
      "name email",
    );

    if (!request) {
      const error = new Error("Request not found");
      error.statusCode = 404;
      return next(error);
    }

    if (String(request.dispatcher || "") !== String(req.dispatcher._id)) {
      const error = new Error("You can only deliver your assigned requests");
      error.statusCode = 403;
      return next(error);
    }

    if (request.status !== "in-transit") {
      const error = new Error("Only in-transit requests can be delivered");
      error.statusCode = 400;
      return next(error);
    }

    await changeRequestStatus({
      request,
      dispatcherId: req.dispatcher._id,
      nextStatus: "delivered",
    });

    notifyArrived(request);

    // Fire-and-forget email with delivery PIN to requester only
    if (request.requester?.email) {
      sendMail(
        request.requester.email,
        "BloodFlow — Delivery PIN",
        pinRequired(
          request.requester.name || "Requester",
          request.deliveryPin,
        ),
      );
    }

    // deliveryPin is NOT included in the HTTP response — it goes to
    // the requester only via socket (notifyArrived) and email
    return res.status(200).json({
      msg: "Delivered! Ask requester for PIN verification.",
      request: {
        _id: request._id,
        status: request.status,
        requester: request.requester,
        dispatcher: request.dispatcher,
      },
    });
  } catch (error) {
    return next(error);
  }
};

// ── Dispatcher unassign (not a full cancel — returns request to "searching") ──
const unassignRequest = async (req, res, next) => {
  try {
    const request = await REQUEST.findById(req.params.id);

    if (!request) {
      const error = new Error("Request not found");
      error.statusCode = 404;
      return next(error);
    }

    if (String(request.dispatcher || "") !== String(req.dispatcher._id)) {
      const error = new Error("You can only unassign your own requests");
      error.statusCode = 403;
      return next(error);
    }

    if (request.status !== "accepted") {
      const error = new Error(
        "Only accepted requests can be unassigned",
      );
      error.statusCode = 400;
      return next(error);
    }

    request.dispatcher = null;
    await changeRequestStatus({
      request,
      dispatcherId: req.dispatcher._id,
      nextStatus: "searching",
    });

    return res.status(200).json({
      msg: "Request unassigned — it is now available for other dispatchers.",
      request,
    });
  } catch (error) {
    return next(error);
  }
};

// ── Dispatcher location tracking ──
const updateLocation = async (req, res, next) => {
  try {
    const { lat, lng } = req.body;

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      const error = new Error("lat and lng must be finite numbers");
      error.statusCode = 400;
      return next(error);
    }

    await DISPATCHER.findByIdAndUpdate(req.dispatcher._id, { lat, lng });
    notifyLocationUpdate(req.dispatcher._id, lat, lng);

    return res.status(200).json({
      msg: "Location updated successfully!",
      lat,
      lng,
    });
  } catch (error) {
    return next(error);
  }
};

const getDispatcherLocation = async (req, res, next) => {
  try {
    const dispatcher = await DISPATCHER.findById(req.params.id).select(
      "lat lng name",
    );

    if (!dispatcher) {
      const error = new Error("Dispatcher not found");
      error.statusCode = 404;
      return next(error);
    }

    return res.status(200).json({
      msg: "Location retrieved successfully!",
      dispatcherId: dispatcher._id,
      name: dispatcher.name,
      lat: dispatcher.lat,
      lng: dispatcher.lng,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  register,
  login,
  profile,
  getAllRequests,
  getMyRequests,
  getSingleRequest,
  acceptRequest,
  pickupRequest,
  deliverRequest,
  unassignRequest,
  updateLocation,
  getDispatcherLocation,
};
