const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    publicId: {
      type: String,
      required: true,
      unique: true,
    },
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    plan: {
      type: String,
      enum: ["basic", "silver", "gold"],
      required: true,
      validate: function (value) {
        return ["basic", "silver", "gold"].includes(value);
      },
      message: "Invalid plan. Must be either one of basic, silver or gold.",
    },
    total_balance: {
      type: Number,
    },
    prev_deposit: {
      type: Number,
    },
    new_deposit: {
      type: Number,
    },
    profit: {
      type: Number,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);
module.exports = User;
