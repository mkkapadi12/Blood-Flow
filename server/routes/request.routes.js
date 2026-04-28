const express = require("express");
const router = express.Router();
const requesterController = require("../controllers/requester.controller");
const dispatcherController = require("../controllers/dispatcher.controller");
const requesterAuth = require("../middlewares/requester.middleware");
const dispatcherAuth = require("../middlewares/dispatcher.middleware");

// README contract routes
router.post("/", requesterAuth, requesterController.createRequest);
router.get("/", dispatcherAuth, dispatcherController.getAllRequests);
router.get("/my", requesterAuth, requesterController.getMyRequests);
router.get("/:id", requesterAuth, requesterController.getSingleRequest);
router.post(
  "/:id/verify-pin",
  requesterAuth,
  requesterController.verifyDeliveryPin,
);

module.exports = router;
