const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    report_type: {
      type: String,
      enum: [
        "sales",
        "distributor",
        "user",
        "hrms_leave",
        "hrms_attendance",
        "hrms_office_calender",
        "hrms_salary",
        "hrms_resignation",
        "inventory",
        "accounts_purchase",
        "accounts_sales",
        "accounts_estimation",
      ],
      required: true,
    },

    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, // in case of user report

    //#region for inventory report
    inventory_type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    type: {
      type: String,
      default: null,
    },
    //#endregion

    //#region for distributor report
    distributor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Distributor",
      default: null,
    },
    state: {
      type: String,
      default: null,
    },
    zone: {
      type: String,
      default: null,
    },
    distributor_type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      default: null,
    },
    //#endregion

    //#region for sales report
    firm: {
      type: String,
      default: null,
    },
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    all: {
      type: String,
      default: null,
    },
    //#endregion

    date_range_from: {
      type: String,
      required: true,
    },
    date_range_to: {
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", schema);
