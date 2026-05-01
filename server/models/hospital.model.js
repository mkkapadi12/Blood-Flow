const mongoose = require("mongoose");

const HospitalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      default: "Ahmedabad",
      trim: true,
    },

    address: {
      type: String,
      trim: true,
    },

    rohiniCode: {
      type: String,
      trim: true,
      default: null,
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
      },
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

HospitalSchema.index({ location: "2dsphere" }, { sparse: true });

HospitalSchema.index({ name: "text", address: "text" });

module.exports = mongoose.model("Hospital", HospitalSchema);
