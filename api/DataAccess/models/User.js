const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },

    username: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },

    email: {
      type: String,
      unique: true,
      sparse: true, // allows null but still ensures uniqueness
      lowercase: true,
      trim: true,
      match: /.+\@.+\..+/,
    },

    password: {
      type: String,
      required: true,
      minlength: 6, // adjust if needed
    },

    phoneNumber: {
      type: String,
      match: /^[0-9+\-()\s]*$/, // optional format check
    },

    buildingId: {
      type: Schema.Types.ObjectId,
      ref: "Building",
      required: true,
    },

    apartmentId: {
      type: Schema.Types.ObjectId,
      ref: "Apartment",
    },

    role: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
  },
  { timestamps: true } // createdAt and updatedAt
);

module.exports = mongoose.model("User", userSchema);
