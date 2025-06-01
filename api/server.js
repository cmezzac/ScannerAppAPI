const express = require("express");
const connectDB = require("./DataAccess/databaseConnection");
const config = require("./config");

const app = express();

connectDB(config.mongoUri);

//Increase body size limit
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

//Define Routers
const openAiRouter = require("./Presentation/routes/ShippingRouter");
const buildingRouter = require("./Presentation/routes/BuildingRouter");
const roleRouter = require("./Presentation/routes/RoleRouter");
const userRouter = require("./Presentation/routes/UserRouter");
const packageRouter = require("./Presentation/routes/PackageRouter");
const apartmentRouter = require("./Presentation/routes/ApartmentRouter");

//Register the endpoints
app.use("/api/shipping", openAiRouter);
app.use("/api/building", buildingRouter);
app.use("/api/role", roleRouter);
app.use("/api/user", userRouter);
app.use("/api/package", packageRouter);
app.use("/api/apartment", apartmentRouter);

app.listen(config.port, () => {
  console.log(`🚀 Server running at http://localhost:${config.port}/`);
});
