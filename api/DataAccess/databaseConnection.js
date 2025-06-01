require("dotenv").config();

const mongoose = require("mongoose");

const connectDB = async (mongoUri) => {
  try {
    await mongoose.connect(mongoUri);
    console.log("✅ Successfully Connected To Database");
  } catch (err) {
    console.log("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
