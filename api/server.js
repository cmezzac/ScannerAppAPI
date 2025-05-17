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
const roleRouter = require("./routes/RoleRouter");
const userRouter = require("./routes/UserRouter");
const packageRouter = require("./routes/PackageRouter");
const apartmentRouter = require("./routes/ApartmentRouter");

//Register the endpoints
app.use("/api/shipping", openAiRouter);
app.use("/api/building", buildingRouter);
app.use("/api/role", roleRouter);
app.use("/api/user", userRouter);
app.use("/api/package", packageRouter);
app.use("/api/apartment", apartmentRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}/`);
});
