const express = require("express");
const router = express.Router();
const requesterController = require("../controllers/requester.controller");
const requesterAuth = require("../middlewares/requester.middleware");

//register
router.post("/register", requesterController.register);

//login
router.post("/login", requesterController.login);

//profile
router.get("/profile", requesterAuth, requesterController.profile);

//create request
router.post(
  "/create-request",
  requesterAuth,
  requesterController.createRequest,
);

//requester's own requests
router.get("/requests/my", requesterAuth, requesterController.getMyRequests);

//single request by id
router.get(
  "/requests/:id",
  requesterAuth,
  requesterController.getSingleRequest,
);

//verify delivery pin
router.post(
  "/requests/:id/verify-pin",
  requesterAuth,
  requesterController.verifyDeliveryPin,
);

module.exports = router;
