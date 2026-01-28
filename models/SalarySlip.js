const mongoose = require("mongoose");

const SalarySlipSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  month: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  payroll_type: {
    type: String,
    enum: ["Hourly", "Monthly"],
    required: true,
  },
  salary: {
    type: Number,
    required: true,
  },
  net_salary: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["Paid", "Unpaid"],
    default: "Unpaid",
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

module.exports = mongoose.model("SalarySlip", SalarySlipSchema);
