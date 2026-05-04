const express = require("express");
const router = express.Router();
const dispatcherController = require("../controllers/dispatcher.controller");
const dispatcherMiddleware = require("../middlewares/dispatcher.middleware");
const validate = require("../middlewares/validate.middleware");
const {
  registerSchema,
  loginSchema,
} = require("../validators/dispatcher.validator");

//register
router.post("/register", validate(registerSchema), dispatcherController.register);

//login
router.post("/login", validate(loginSchema), dispatcherController.login);

//profile
router.get("/profile", dispatcherMiddleware, dispatcherController.profile);

//get all requests (excludes cancelled)
router.get(
  "/get-all-requests",
  dispatcherMiddleware,
  dispatcherController.getAllRequests,
);

//get dispatcher assigned requests
router.get(
  "/get-my-requests",
  dispatcherMiddleware,
  dispatcherController.getMyRequests,
);

//get single request
router.get(
  "/requests/:id",
  dispatcherMiddleware,
  dispatcherController.getSingleRequest,
);

//status lifecycle
router.put(
  "/requests/:id/accept",
  dispatcherMiddleware,
  dispatcherController.acceptRequest,
);
router.put(
  "/requests/:id/pickup",
  dispatcherMiddleware,
  dispatcherController.pickupRequest,
);
router.put(
  "/requests/:id/deliver",
  dispatcherMiddleware,
  dispatcherController.deliverRequest,
);

//unassign (dispatcher cancels their own acceptance)
router.put(
  "/requests/:id/unassign",
  dispatcherMiddleware,
  dispatcherController.unassignRequest,
);

//location tracking
router.patch(
  "/location",
  dispatcherMiddleware,
  dispatcherController.updateLocation,
);

//get dispatcher location (public, no auth)
router.get("/:id/location", dispatcherController.getDispatcherLocation);

module.exports = router;
