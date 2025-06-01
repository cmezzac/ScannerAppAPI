const express = require("express");
const router = express.Router();
const { readShippingLabel } = require("../controllers/ShippingController");

router.post("/readShippingLabel", readShippingLabel);

module.exports = router;
