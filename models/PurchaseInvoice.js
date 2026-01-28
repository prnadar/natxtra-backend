const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    customer_name: {
      type: String,
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    billing_address: {
      address: { type: String },
      city: { type: String },
      state: { type: String },
      pincode: { type: String },
    },
    shipping_address: {
      address: { type: String },
      city: { type: String },
      state: { type: String },
      pincode: { type: String },
    },
    invoice_number: {
      type: String,
      required: true,
      unique: true,
    },
    gst_num: {
      type: String,
    },
    invoice_date: {
      type: Date,
      required: true,
    },
    due_date: {
      type: Date,
      required: true,
    },
    payment_mode: {
      type: String,
      required: true,
    },
    payment_status: {
      type: String,
      required: true,
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    rate: {
      type: Number,
      required: true,
    },
    hsn_code: {
      type: String,
    },
    sgst: {
      type: Number,
    },
    cgst: {
      type: Number,
    },
    igst: {
      type: Number,
    },
    total_tax: {
      type: Number,
    },
    subtotal: {
      type: Number,
    },
    discount: {
      type: Number,
      min: 0,
    },
    discount_type: {
      type: String,
    },
    total: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["due", "sent", "paid", "overdue", "cancelled"],
      default: "due",
    },
    created_at: {
      type: String,
      default: Date.now,
    },
    updated_at: {
      type: String,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PurchaseInvoice", schema);
