const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // This is hashed.
  buildingId: { type: String, ref: "Building", required: true },
  roles: [
    {
      type: Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
  ],
});
module.exports = mongoose.model("User", userSchema);
