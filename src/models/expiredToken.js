const mongoose = require("mongoose");

const expired = new mongoose.Schema(
  {
    token: { type: String, required: true },
    user: { type: mongoose.Schema.ObjectId, required: true, ref: "user" },
  },
  { timestamps: true }
);

const expiredDB = mongoose.model("expired tokens", expired);

module.exports = { expiredDB };
