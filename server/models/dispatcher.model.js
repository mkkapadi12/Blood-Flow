const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { Schema } = mongoose;

const dispatcherSchema = new Schema({
  name: {
    type: String,
  },

  email: {
    type: String,
    required: [true, "email is required!"],
    unique: [true, "dispatcher already exist!"],
  },

  password: {
    type: String,
    required: [true, "password is required!"],
  },
});

dispatcherSchema.pre("save", async function () {
  const user = this;

  try {
    const saltRound = await bcrypt.genSalt(10);
    const hash_password = await bcrypt.hash(user.password, saltRound);
    user.password = hash_password;
  } catch (error) {
    console.log(error);
  }
});

//generate token
dispatcherSchema.methods.generateToken = async function () {
  try {
    const token = jwt.sign(
      {
        dispatcherId: this._id.toString(),
        email: this.email,
        name: this.name,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "24h",
      },
    );
    return token;
  } catch (error) {
    console.error("Error generating token:", error);
    throw new Error("Failed to generate token");
  }
};

dispatcherSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const DISPATCHER = mongoose.model("Dispatcher", dispatcherSchema);

module.exports = DISPATCHER;
