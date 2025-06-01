const express = require("express");
const router = express.Router();
const { insertNewBuilding } = require("../controllers/BuildingController");

router.post("/insertNewBuilding", insertNewBuilding);

module.exports = router;
