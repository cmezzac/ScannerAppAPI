const { Schema, model } = require("mongoose");

const buildingSchema = new Schema({
  name: { type: String, required: true },
  adress: { type: String, required: true },
});

module.exports = model("Building", buildingSchema);
