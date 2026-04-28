const jwt = require("jsonwebtoken");
const REQUESTER = require("../models/requester.model");

const requesterAuth = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    const error = new Error("Unauthorized HTTP, Token not provided !");
    error.statusCode = 401;
    return next(error);
  }

  const jwtToken = token.replace("Bearer", "").trim();

  try {
    const isVerified = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);

    const reqData = await REQUESTER.findOne({ email: isVerified.email }).select({
      password: 0,
    });

    req.requester = reqData;
    req.token = token;
    req.requesterId = reqData._id;
    next();
  } catch (error) {
    const errorObj = new Error("Unauthorized ! Invalid Token");
    errorObj.statusCode = 401;
    return next(errorObj);
  }
};

module.exports = requesterAuth;
