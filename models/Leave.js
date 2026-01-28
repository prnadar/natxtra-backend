const mongoose = require("mongoose");
const { dateToString } = require("../utils/dateHelper");

const Schema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  leave_type: {
    type: String,
  },
  start_date: {
    type: String,
    default: dateToString(new Date()),
    required: true,
  },
  end_date: {
    type: String,
    default: dateToString(new Date()),
    required: true,
  },
  reason: {
    type: String,
    default: "",
    required: true,
  },
  remarks: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    default: "pending",
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

module.exports = mongoose.model("Leave", Schema);
