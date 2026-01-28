const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  home_banner_1: {
    image: { type: String, required: true },
    title: { type: String },
    description: { type: String },
  },
  home_banner_2: {
    image: { type: String, required: true },
    title: { type: String },
    description: { type: String },
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

module.exports = mongoose.model("Banner", schema);
