const mongoose = require("mongoose");

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const InventorySchema = new mongoose.Schema(
  {
    bloodGroup: {
      type: String,
      enum: BLOOD_GROUPS,
      required: true,
    },
    units: {
      type: Number,
      default: 0,
      min: 0,
    },
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
    },
  },
  { timestamps: true },
);

// Compound unique index — one record per blood group per hospital
InventorySchema.index({ bloodGroup: 1, hospitalId: 1 }, { unique: true });

const INVENTORY = mongoose.model("Inventory", InventorySchema);

module.exports = INVENTORY;
