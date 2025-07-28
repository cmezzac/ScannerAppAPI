const express = require("express");
const router = express.Router();
const { createNewApartment } = require("../controllers/ApartmentController");
const { authenticateToken } = require("../middleware/authenticationToken");

router.post("/createNewApartment", authenticateToken, createNewApartment);

module.exports = router;
