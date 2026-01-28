const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  key_id: {
    type: String,
    required: true,
  },
  key_secret: {
    type: String,
    required: true,
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

module.exports = mongoose.model("RazorpayConfig", schema);
