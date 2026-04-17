const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      default: "Admin",
      trim: true,
    },
    emailAlert: {
      type: Boolean,
      default: true,
    },
    lowStockAlert: {
      type: Boolean,
      default: true,
    },
    theme: {
      type: String,
      enum: ["light", "dark"],
      default: "light",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.Setting || mongoose.model("Setting", settingSchema);
