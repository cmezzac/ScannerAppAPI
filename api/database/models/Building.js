const { Schema, model } = require("mongoose");

const buildingSchema = new Schema({
  Name: { type: String, required: true },
  Adress: { type: String, required: true },
  numberOfAppartment: { type: Number, required: true },
});

module.exports = model("Building", buildingSchema);
