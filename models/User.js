const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    employee_id: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      default: null,
    },
    designation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Designation",
      default: null,
    },
    reporting_to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    mobile_number: {
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
    status: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Status",
      default: null,
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

module.exports = mongoose.model("User", schema);
