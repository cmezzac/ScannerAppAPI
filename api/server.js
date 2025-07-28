const express = require("express");
const connectDB = require("./DataAccess/databaseConnection");
const config = require("./config");
const cors = require("cors");

const app = express();

connectDB(config.mongoUri);

app.use(cors());

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
const smsRouter = require("./Presentation/routes/SmsRouter");
const s3Router = require("./Presentation/routes/S3Router");
const authenticationRouter = require("./Presentation/routes/AuthenticationRouter");

//Register the endpoints
app.use("/api/reader", openAiRouter);
app.use("/api/building", buildingRouter);
app.use("/api/role", roleRouter);
app.use("/api/user", userRouter);
app.use("/api/package", packageRouter);
app.use("/api/apartment", apartmentRouter);
app.use("/api/sms", smsRouter);
app.use("/api/s3", s3Router);
app.use("/api/auth", authenticationRouter);

app.listen(config.port, "0.0.0.0", () => {
  console.log(`🚀 Server running at http://0.0.0.0:${config.port}/`);
});
