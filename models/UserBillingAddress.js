const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "WebUser",
  },
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
  },
  name: {
    type: String,
  },
  phone: {
    type: String,
    max: 255,
  },
  address: {
    type: String,
    max: 255,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  pincode: {
    type: String,
  },
  address_type: {
    type: String,
  },
  is_default: {
    type: Boolean,
    default: false,
  },
  created_at: {
    type: String,
    default: Date,
  },
  updated_at: {
    type: String,
    default: Date,
  },
});

module.exports = mongoose.model("UserBillingAddress", Schema);
