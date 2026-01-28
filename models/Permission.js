const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema({
  module: {
    type: String,
    required: true,
  },
  permissions: {
    manage: {
      type: Boolean,
      default: false,
    },
    create: {
      type: Boolean,
      default: false,
    },
    edit: {
      type: Boolean,
      default: false,
    },
    delete: {
      type: Boolean,
      default: false,
    },
  },
});

module.exports = mongoose.model("Permission", permissionSchema);
