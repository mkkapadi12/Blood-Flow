const mongoose = require("mongoose");

const StatusLogSchema = new mongoose.Schema({
  request: { type: mongoose.Schema.Types.ObjectId, ref: "Request" },
  changedBy: { type: mongoose.Schema.Types.ObjectId, required: true },
  changedByRole: {
    type: String,
    enum: ["requester", "dispatcher"],
    required: true,
  },
  newStatus: String,
  timestamp: { type: Date, default: Date.now },
});

const STATUSLOG = mongoose.model("StatusLog", StatusLogSchema);

module.exports = STATUSLOG;
