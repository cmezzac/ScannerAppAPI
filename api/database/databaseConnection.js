require("dotenv").config();

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connectionString = process.env.MONGO_CONNECTION_STRING;
    await mongoose.connect(connectionString);
    console.log("✅ Successfully Connected To Database");
  } catch (err) {
    console.log("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
