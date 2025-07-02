const express = require("express");
const connectDB = require("./DataAccess/databaseConnection");
const config = require("./config");
const faker = require("faker");

const app = express();

connectDB(config.mongoUri);

//Increase body size limit
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

const User = require("./DataAccess/models/User");
const Role = require("./DataAccess/models/Role");
const Package = require("./DataAccess/models/Package");
const Building = require("./DataAccess/models/Building");
const Apartment = require("./DataAccess/models/Apartment");

const MAX_USERS_PER_APT = 3;
const NUM_APARTMENTS = 10;
const TOTAL_USERS = 20;
const shortBase64 = "";

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

app.listen(config.port, "0.0.0.0", () => {
  console.log(`🚀 Server running at http://0.0.0.0:${config.port}/`);
});

async function populateDatabase() {
  console.log("🧹 Clearing existing data...");
  await Promise.all([
    User.deleteMany({}),
    Role.deleteMany({}),
    Package.deleteMany({}),
    Building.deleteMany({}),
    Apartment.deleteMany({}),
  ]);

  const role = await Role.create({
    name: "Resident",
    privileges: ["viewPackages"],
  });

  const building = await Building.create({
    Name: "Grand Heights",
    Adress: "500 Demo Lane",
    numberOfApartment: NUM_APARTMENTS,
  });

  const apartments = [];

  for (let i = 0; i < NUM_APARTMENTS; i++) {
    const apt = await Apartment.create({
      number: `${100 + i}`,
      userIds: [],
      buildingId: building._id,
    });
    apartments.push(apt);
  }

  const users = [];

  for (let i = 0; i < TOTAL_USERS; i++) {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const username = `${firstName.toLowerCase()}${i}`;
    const email = `${username}@example.com`;

    let assignedApt = null;
    while (!assignedApt) {
      const candidate =
        apartments[Math.floor(Math.random() * apartments.length)];
      if (candidate.userIds.length < MAX_USERS_PER_APT) {
        assignedApt = candidate;
        break;
      }
    }

    const user = await User.create({
      firstName,
      lastName,
      username,
      email,
      password: "password123",
      phoneNumber: faker.phone.phoneNumber("(###) ###-####"),
      buildingId: building._id,
      apartmentId: assignedApt._id,
      role: role._id,
    });

    assignedApt.userIds.push(user._id);
    await assignedApt.save();
    users.push(user);
  }

  const courriers = ["Canada Post", "Purolator", "FedEx", "UPS", "Amazon"];

  for (const user of users) {
    const numPackages = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < numPackages; i++) {
      const status = Math.random() < 0.5 ? "Pending" : "Confirmed";
      const courrier = courriers[Math.floor(Math.random() * courriers.length)];

      await Package.create({
        userId: user._id,
        processedDate: faker.date.recent(10),
        confirmationDate:
          status === "Confirmed" ? faker.date.recent(10) : undefined,
        courrier,
        trackingNumber: `TRACK${faker.datatype.uuid().slice(0, 8)}`,
        status,
        buildingId: building._id,
        urgent: Math.random() < 0.3,
        photo: shortBase64,
      });
    }
  }

  console.log(`✅ Created:
  - 1 building
  - ${NUM_APARTMENTS} apartments
  - ${users.length} users
  - ${await Package.countDocuments()} packages`);
}

//populateDatabase();
