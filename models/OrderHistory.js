const mongoose = require("mongoose");

const orderHistorySchema = new mongoose.Schema({
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "WebUser",
    default: null,
  },
  product_name: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    default: null,
  },
  quantity: {
    type: String,
    required: true,
  },
  mrp: {
    type: Number,
    required: true,
  },
  sub_total: {
    type: Number,
    required: true,
  },
  orderId: {
    type: String,
  },
  status: {
    type: String,
    default: "pending",
  },
  payment_mode: {
    type: String,
    default: "COD",
  },
  payment_status: {
    type: String,
    default: "unpaid",
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

module.exports = mongoose.model("OrderHistory", orderHistorySchema);
