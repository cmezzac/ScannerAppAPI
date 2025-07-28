const express = require("express");
const router = express.Router();
const { insertNewBuilding } = require("../controllers/BuildingController");
const { authenticateToken } = require("../middleware/authenticationToken");

router.post("/insertNewBuilding", authenticateToken, insertNewBuilding);

module.exports = router;
