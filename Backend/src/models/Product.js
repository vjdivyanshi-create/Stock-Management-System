const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    ownerEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    sku: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["in", "low", "out"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({ ownerEmail: 1, sku: 1 }, { unique: true });

module.exports = mongoose.models.Product || mongoose.model("Product", productSchema);
