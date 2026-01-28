const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  gallery_category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GalleryCategory",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  created_at: {
    type: String,
    default: Date.now,
  },
  updated_at: {
    type: String,
    default: Date.now,
  },
});

module.exports = mongoose.model("Gallery", Schema);
