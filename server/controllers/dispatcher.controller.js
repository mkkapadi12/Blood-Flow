const DISPATCHER = require("../models/dispatcher.model");
const REQUEST = require("../models/request.model");
const STATUSLOG = require("../models/status.model");
const { notifyRequestUpdate, notifyArrived } = require("../socket/socket");

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
    const requests = await REQUEST.find({ status: "searching" })
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
    const request = await REQUEST.findById(req.params.id);

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
    const request = await REQUEST.findById(req.params.id);

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
    const request = await REQUEST.findById(req.params.id);

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

    notifyArrived(request);

    return res.status(200).json({
      msg: "Arrived at destination. Ask requester for PIN verification.",
      request,
      deliveryPin: request.deliveryPin,
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
};
