const express = require("express");
const router = express.Router();
const {
  addPackage,
  getPendingPackages,
  getConfirmedPackages,
  getPackageDetails,
  confirmPackage,
} = require("../controllers/PackageController");
const { authenticateToken } = require("../middleware/authenticationToken");

//GET REQUESTS
router.get("/pendingPackages", authenticateToken, getPendingPackages);

router.get("/confirmedPackages", authenticateToken, getConfirmedPackages);

router.get(
  "/getPackageDetails/:packageId",
  authenticateToken,
  getPackageDetails
);

//POST REQUESTS
router.post("/addPackage", authenticateToken, addPackage);

router.post("/confirmPackage", authenticateToken, confirmPackage);

module.exports = router;
