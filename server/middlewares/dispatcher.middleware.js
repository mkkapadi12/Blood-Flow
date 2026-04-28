const jwt = require("jsonwebtoken");
const DISPATCHER = require("../models/dispatcher.model");

const dispatcherMiddleware = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    const error = new Error("Unauthorized HTTP, Token not provided !");
    error.statusCode = 401;
    return next(error);
  }

  const jwtToken = token.replace("Bearer", "").trim();

  try {
    const isVerified = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);

    const dispatcherData = await DISPATCHER.findOne({
      email: isVerified.email,
    }).select({
      password: 0,
    });

    req.dispatcher = dispatcherData;
    req.token = token;
    req.dispatcherId = dispatcherData._id;
    next();
  } catch (error) {
    const errorObj = new Error("Unauthorized ! Invalid Token");
    errorObj.statusCode = 401;
    return next(errorObj);
  }
};

module.exports = dispatcherMiddleware;
