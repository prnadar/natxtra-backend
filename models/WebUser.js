const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      unique: true,
      type: String,
    },
    address: {
      type: String,
    },
    state: {
      type: String,
    },
    city: {
      type: String,
    },
    pincode: {
      type: String,
    },
    password: {
      type: String,
      min: 6,
      max: 255,
      required: true,
    },
    image: {
      type: String,
    },
    created_at: {
      type: String,
      default: Date.now,
    },
    updated_at: {
      type: String,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WebUser", schema);
