const express = require("express");
const router = express.Router();
const dispatcherController = require("../controllers/dispatcher.controller");
const dispatcherMiddleware = require("../middlewares/dispatcher.middleware");

//register
router.post("/register", dispatcherController.register);

//login
router.post("/login", dispatcherController.login);

//profile
router.get("/profile", dispatcherMiddleware, dispatcherController.profile);

//get all requests
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

module.exports = router;
