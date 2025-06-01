const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const apartmentSchema = new Schema({
  number: { type: String, required: true },

  userIds: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  buildingId: {
    type: Schema.Types.ObjectId,
    ref: "Building",
    required: true,
  },
});

// Limit userIds to max 3 users
apartmentSchema.path("userIds").validate(function (val) {
  return val.length <= 3;
}, "An apartment can have at most 3 users.");

module.exports = mongoose.model("Apartment", apartmentSchema);
