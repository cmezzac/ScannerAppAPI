const express = require("express");
const router = express.Router();
const User = require("../database/models/User");
const Role = require("../database/models/Role");
const Building = require("../database/models/Building");

router.post("/createUser", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      userName,
      password,
      buildingId,
      role,
      phoneNumber,
    } = req.body;

    const roleDocument = await Role.findOne({ name: role });
    if (!roleDocument) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const buildingDocument = await Building.findOne({ _id: buildingId });
    if (!buildingDocument) {
      return res.status(400).json({ error: "Invalid building Id" });
    }

    const userData = {
      firstName,
      lastName,
      buildingId,
      role: roleDocument._id,
    };

    if (role === "resident") {
      if (!phoneNumber) {
        return res
          .status(400)
          .json({ error: "Phone number is required for Residents" });
      }
      userData.phoneNumber = phoneNumber;
    } else {
      if (!userName || !password) {
        return res.status(400).json({
          error: "Username and password are required for non-Residents",
        });
      }
      userData.userName = userName;
      userData.password = password; //This needs to be hashed in the future
    }

    const newUser = new User(userData);

    await newUser.save();
    res.status(201).json({
      message: "User created successfully",
      userId: newUser._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add user" });
  }
});

module.exports = router;
