const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: String },
  username: { type: String, unique: true },
  password: { type: String },
  buildingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Building",
    required: true,
  },
  role: {
    type: Schema.Types.ObjectId,
    ref: "Role",
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
