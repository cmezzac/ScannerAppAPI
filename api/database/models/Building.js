const { Schema, model } = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const buildingSchema = new Schema({
  buildingId: { type: String, default: uuidv4, unique: true },
  Name: { type: String, required: true },
  Adress: { type: String, required: true },
});

module.exports = model("Building", buildingSchema);
