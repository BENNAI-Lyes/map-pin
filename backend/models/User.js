const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      min: 3,
      max: 15,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      max: 30,
    },
    password: {
      type: String,
      required: true,
      min: 6,
      max: 30,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
