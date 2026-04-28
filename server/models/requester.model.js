const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { Schema } = mongoose;

const requesterSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },

  email: {
    type: String,
    required: [true, "Email is required"],
    unique: [true, "Email already exists"],
  },

  password: {
    type: String,
    required: [true, "Password is required"],
  },
});

requesterSchema.pre("save", async function () {
  const requester = this;

  try {
    const saltRound = await bcrypt.genSalt(10);
    const hash_password = await bcrypt.hash(requester.password, saltRound);
    requester.password = hash_password;
  } catch (error) {
    console.log(error);
  }
});

//generate token
requesterSchema.methods.generateToken = async function () {
  try {
    const token = jwt.sign(
      {
        requesterId: this._id.toString(),
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

requesterSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};
    
const REQUESTER = mongoose.model("Requester", requesterSchema);

module.exports = REQUESTER;
