const mongoose = require("mongoose");

const STATUS = ["searching", "accepted", "in-transit", "delivered", "cancelled"];

const RequestSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Requester",
      required: true,
    },
    dispatcher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dispatcher",
      default: null,
    },

    type: { type: String, enum: ["blood", "oxygen"], required: true },
    bloodGroup: String,
    units: { type: Number, required: true },
    hospital: {
      name: { type: String, required: true },
      address: { type: String, required: true },
    },
    urgency: { type: String, enum: ["normal", "critical"], default: "normal" },

    location: {
      lat: Number,
      lng: Number,
    },

    status: { type: String, enum: STATUS, default: "searching" },

    deliveryPin: {
      type: String,
      default: () => Math.floor(1000 + Math.random() * 9000).toString(),
    },
    pinVerified: { type: Boolean, default: false },

    statusHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "StatusLog" }],
  },
  { timestamps: true },
);

const REQUEST = mongoose.model("Request", RequestSchema);

module.exports = REQUEST;
