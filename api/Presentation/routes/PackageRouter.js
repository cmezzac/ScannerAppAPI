const express = require("express");
const router = express.Router();
const {
  addPackage,
  getPendingPackages,
  getConfirmedPackages,
} = require("../controllers/PackageController");

router.get("/pendingPackages", getPendingPackages);

router.get("/confirmedPackages", getConfirmedPackages);

router.post("/addPackage", addPackage);

module.exports = router;
