require("dotenv").config();

const env = process.env.NODE_ENV || "development";

const config = {
  env,
  port: process.env.PORT || 3000,
  openAiKey: process.env.OPEN_AI_API_KEY,
  mongoUri: process.env.MONGO_CONNECTION_STRING,
};

module.exports = config;
