const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const apartmentSchema = new Schema({
  number: { type: String, required: true },

  buildingId: {
    type: Schema.Types.ObjectId,
    ref: "Building",
    required: true,
  },
});

module.exports = mongoose.model("Apartment", apartmentSchema);
