const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const packageSchema = new Schema({
  trackingNumber: { type: String, required: true, unique: true }, // your own package identifier
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // who the package belongs to
  processedDate: { type: Date, required: true },
  confirmationDate: { type: Date }, // can be null until confirmed
  status: {
    type: String,
    enum: ["Pending", "Confirmed"],
    required: true,
  },
  buildingId: {
    type: Schema.Types.ObjectId,
    ref: "Building",
    required: true,
  },
});

module.exports = mongoose.model("Package", packageSchema);
