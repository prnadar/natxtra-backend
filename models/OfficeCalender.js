const mongoose = require("mongoose");
const { dateToString } = require("../utils/dateHelper");

const Schema = new mongoose.Schema({
  date: {
    type: String,
    default: dateToString(new Date()),
  },
  end_date: {
    type: String,
    default: dateToString(new Date()),
  },
  event: {
    type: String,
  },
  color: {
    type: String,
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

module.exports = mongoose.model("OfficeCalender", Schema);
