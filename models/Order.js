const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "WebUser",
    required: true,
  },
  status: {
    type: String,
    default: "pending",
  },
  order_total_amount: {
    type: Number,
  },
  order_subtotal_amount: {
    type: Number,
  },
  payment_mode: {
    type: String,
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

module.exports = mongoose.model("Order", orderSchema);
