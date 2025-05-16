const dotenv = require("dotenv");
const express = require("express");
const connectDB = require("./database/databaseConnection");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

connectDB();

//Increase body size limit
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

//Define Routers
const openAiRouter = require("./routes/ShippingRouter");
const buildingRouter = require("./routes/BuildingRouter");

//Register the endpoints
app.use("/api/shipping", openAiRouter);
app.use("/api/building", buildingRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}/`);
});
