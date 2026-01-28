const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  // door_code removed - redundant with sku
  size: [
    {
      type: String,
      default: null,
    },
  ],
  sku: {
    type: String,
    default: null,
  },
  // thickness removed
  // pannel_thickness removed
  sale_price: {
    type: Number,
    required: true,
  },
  // purchase_price: {
  //   type: Number,
  //   required: true,
  // },
  distributor_price: {
    type: Number,
    default: 0,
  },
  dealer_price: {
    type: Number,
    default: 0,
  },
  mrp: {
    type: Number,
    default: 0,
  },
  // production_cost: {
  //   type: Number,
  //   default: 0,
  // },
  quantity: {
    type: Number,
    default: 0,
    required: true,
  },
  unit_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Unit",
    required: true,
  },
  tax: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
    // Supports both old format (String: "CGST" or "SGST") 
    // and new format (Object: { cgst: { percentage: 9 }, sgst: { percentage: 9 }, igst: { percentage: 18 } })
  },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  brand_name: {
    type: String,
    default: "",
  },
  // type: {
  //   type: String,
  //   default: "",
  // },
  description: {
    type: String,
    default: null,
  },
  image: {
    type: String,
    default: null,
  },
  product_images: [
    {
      type: String,
      default: null,
    },
  ],
  status: {
    type: String,
    default: "In Stock",
  },
  visibility_status: {
    type: String,
    default: "show",
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

module.exports = mongoose.model("Product", Schema);
