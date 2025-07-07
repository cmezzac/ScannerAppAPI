const express = require("express");
const router = express.Router();
const {
  addPackage,
  getPendingPackages,
  getConfirmedPackages,
  getPackageDetails,
  confirmPackage,
} = require("../controllers/PackageController");

//GET REQUESTS
router.get("/pendingPackages", getPendingPackages);

router.get("/confirmedPackages", getConfirmedPackages);

router.get("/getPackageDetails/:packageId", getPackageDetails);

//POST REQUESTS
router.post("/addPackage", addPackage);

router.post("/confirmPackage", confirmPackage);

module.exports = router;
