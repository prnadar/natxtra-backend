const mongoose = require("mongoose");
const { dateToString } = require("../utils/dateHelper");

const schema = new mongoose.Schema({
  subject: {
    type: String,
    max: 50,
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  priority: {
    type: String,
  },
  images: [
    {
      type: String,
    },
  ],
  end_date: {
    type: String,
    default: dateToString(new Date()),
    required: true,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    default: "pending",
  },
  replies: [
    {
      comment: String,
      user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
      admin_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Adminauth",
        default: null,
      },
      created_at: { type: Date, default: Date },
    },
  ],
  assign_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
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

module.exports = mongoose.model("SupportTicket", schema);
