const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    min: 4,
    max: 30,
    required: true,
  },
  email: {
    type: String,
    max: 50,
    required: true,
  },
  phone: {
    type: String,
    max: 255,
  },
  subject: {
    type: String,
    max: 50,
  },
  message: {
    type: String,
    max: 50,
  },
  privacy_policy: {
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

module.exports = mongoose.model("Contactus", schema);
