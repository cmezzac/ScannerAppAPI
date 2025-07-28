const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const authenticatedUser = new Schema({
  username: { type: String, required: true },

  password: { type: String, required: true },

  buildingId: {
    type: Schema.Types.ObjectId,
    ref: "Building",
    required: true,
  },

  role: {
    type: Schema.Types.ObjectId,
    ref: "Role",
    required: true,
  },
});

module.exports = mongoose.model("Authenticated_User", authenticatedUser);
