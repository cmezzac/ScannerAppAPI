const express = require("express");
const router = express.Router();
const { addPackage } = require("../controllers/PackageController");

router.post("/addPackage", addPackage);

module.exports = router;
