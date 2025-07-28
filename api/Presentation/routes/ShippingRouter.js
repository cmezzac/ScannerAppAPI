const express = require("express");
const router = express.Router();
const { readShippingLabel } = require("../controllers/ShippingController");
const { authenticateToken } = require("../middleware/authenticationToken");

router.post("/readShippingLabel", authenticateToken, readShippingLabel);

module.exports = router;
