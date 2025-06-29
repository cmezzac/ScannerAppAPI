const express = require("express");
const router = express.Router();
const {
  addPackage,
  getPendingPackages,
} = require("../controllers/PackageController");

router.get("/pendingPackages", getPendingPackages);

router.post("/addPackage", addPackage);

module.exports = router;
