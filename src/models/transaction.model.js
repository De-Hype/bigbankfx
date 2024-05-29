const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["deposit", "withdrawal"],
      required: true,
      validate: function (value) {
        return ["deposit", "withdrawal"].includes(value);
      },
      message: "Invalid plan. Must be either one of basic, withdrawal or gold.",
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
    isPending: {
      type: Boolean,
      required: true,
    },
    reference:{
        type:String,
        required:true
    }
  },
  { timestamps: true }
);

const Transaction = mongoose.model("transaction", transactionSchema);
module.exports = Transaction;
