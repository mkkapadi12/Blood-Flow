const Joi = require("joi");

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  email: Joi.string().email().trim().lowercase().required(),
  password: Joi.string().min(6).max(128).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().trim().lowercase().required(),
  password: Joi.string().required(),
});

const createRequestSchema = Joi.object({
  bloodType: Joi.string().valid(...BLOOD_TYPES),
  unitsRequired: Joi.number().positive().max(20).required(),
  hospitalName: Joi.string().trim().min(2).allow("", null),
  hospitalAddress: Joi.string().trim().min(5).required(),
  urgencyLevel: Joi.string().valid("normal", "critical").default("normal"),
  type: Joi.string().valid("blood", "oxygen").required(),
  location: Joi.object({
    lat: Joi.number(),
    lng: Joi.number(),
  }).allow(null),
  lat: Joi.number().allow(null),
  lng: Joi.number().allow(null),
});

module.exports = { registerSchema, loginSchema, createRequestSchema };
