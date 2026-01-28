const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    firm_name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    distributor_type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
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
    region: {
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

module.exports = mongoose.model("Distributor", schema);
