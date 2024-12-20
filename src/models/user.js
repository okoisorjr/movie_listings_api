const mongoose = require("mongoose");

const user_schema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minLength: 16 },
  },
  { timestamps: true }
);

const userDB = mongoose.model("users", user_schema);

module.exports = { userDB };
