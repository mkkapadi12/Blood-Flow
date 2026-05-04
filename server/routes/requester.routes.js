const express = require("express");
const router = express.Router();
const requesterController = require("../controllers/requester.controller");
const requesterAuth = require("../middlewares/requester.middleware");
const validate = require("../middlewares/validate.middleware");
const {
  registerSchema,
  loginSchema,
  createRequestSchema,
} = require("../validators/requester.validator");

//register
router.post("/register", validate(registerSchema), requesterController.register);

//login
router.post("/login", validate(loginSchema), requesterController.login);

//profile
router.get("/profile", requesterAuth, requesterController.profile);

//create request
router.post(
  "/create-request",
  requesterAuth,
  validate(createRequestSchema),
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

//cancel request
router.patch(
  "/requests/:id/cancel",
  requesterAuth,
  requesterController.cancelRequest,
);

module.exports = router;
