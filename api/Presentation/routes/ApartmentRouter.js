const express = require("express");
const router = express.Router();
const { createNewApartment } = require("../controllers/ApartmentController");

router.post("/createNewApartment", createNewApartment);

module.exports = router;
