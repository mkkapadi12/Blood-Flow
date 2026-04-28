const express = require("express");
const router = express.Router();
const dispatcherController = require("../controllers/dispatcher.controller");
const dispatcherAuth = require("../middlewares/dispatcher.middleware");

router.put("/:id/accept", dispatcherAuth, dispatcherController.acceptRequest);
router.put("/:id/pickup", dispatcherAuth, dispatcherController.pickupRequest);
router.put("/:id/deliver", dispatcherAuth, dispatcherController.deliverRequest);

module.exports = router;
