const express = require("express");
const router = express.Router();

const { notifyUsers } = require("../controllers/SmsController");
const { authenticateToken } = require("../middleware/authenticationToken");

router.post("/notifyTenants", authenticateToken, notifyUsers);

module.exports = router;
