const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  company_name: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  zip: {
    type: String,
  },
  toll_number: {
    type: String,
  },
  copyright: {
    type: String,
  },
  gst_registration_no: {
    type: String,
  },
  twitter: {
    type: String,
  },
  facebook: {
    type: String,
  },
  instagram: {
    type: String,
  },
  footer_text: {
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

module.exports = mongoose.model("WebSetting", schema);
