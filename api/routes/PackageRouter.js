const express = require("express");
const router = express.Router();
const Package = require("../database/models/Package");

router.post("/addPackage", async (req, res) => {
  //Request needs. Tracking Number and Name. Then we can infer all other properties from the DB in this function.
});

module.exports = router;
