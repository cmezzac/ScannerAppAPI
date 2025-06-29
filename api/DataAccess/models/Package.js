const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const packageSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    processedDate: {
      type: Date,
      required: true,
      default: Date.now,
    },

    confirmationDate: {
      type: Date,
    },
    trackingNumber: {
      type: String,
    },
    courrier: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Confirmed"],
      required: true,
      default: "Pending",
    },

    buildingId: {
      type: Schema.Types.ObjectId,
      ref: "Building",
      required: true,
    },

    urgent: {
      type: Boolean,
      default: false,
    },

    photo: {
      type: String, // base64 or a URL if using blob storage
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

module.exports = mongoose.model("Package", packageSchema);
