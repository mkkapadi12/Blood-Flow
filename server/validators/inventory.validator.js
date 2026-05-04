const Joi = require("joi");

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const updateInventorySchema = Joi.object({
  bloodGroup: Joi.string()
    .valid(...BLOOD_GROUPS)
    .required(),
  units: Joi.number().integer().min(0).required(),
});

module.exports = { updateInventorySchema };
