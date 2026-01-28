const mongoose = require("mongoose");
const { dateToString } = require("../utils/dateHelper");

const Schema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    default: null,
  },
  notice_date: {
    type: String,
    default: dateToString(new Date()),
    required: true,
  },
  termination_date: {
    type: String,
    default: dateToString(new Date()),
    required: true,
  },
  description: {
    type: String,
    required: true,
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

module.exports = mongoose.model("Termination", Schema);
