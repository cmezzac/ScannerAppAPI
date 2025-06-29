require("dotenv").config();

const config = require("../config");

const mongoose = require("mongoose");
const connectDB = require("./databaseConnection");

const User = require("./models/User");
const Role = require("./models/Role");
const Package = require("./models/Package");
const Building = require("./models/Building");
const Apartment = require("./models/Apartment");

const faker = require("faker");

const MAX_USERS_PER_APT = 3;
const NUM_APARTMENTS = 10;
const TOTAL_USERS = 20;

const shortBase64 = "data:image/png;base64,iVBORw0KGgo=";

async function run() {
  await connectDB(config.mongoUri);

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

    // Assign to random apartment (with < 3 users)
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
      phoneNumber: faker.phone.phoneNumber(),
      buildingId: building._id,
      apartmentId: assignedApt._id,
      role: role._id,
    });

    // Push to apt
    assignedApt.userIds.push(user._id);
    await assignedApt.save();

    users.push(user);
  }

  // Create packages for users
  for (const user of users) {
    const numPackages = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < numPackages; i++) {
      await Package.create({
        userId: user._id,
        processedDate: faker.date.recent(10),
        courrier: `TRACK${faker.datatype.uuid().slice(0, 8)}`,
        status: Math.random() < 0.5 ? "Pending" : "Confirmed",
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
  process.exit(0);
}

run().catch((err) => {
  console.error("❌ Error populating database:", err);
  process.exit(1);
});
