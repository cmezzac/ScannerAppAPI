const express = require("express");
const router = express.Router();

const { notifyUsers } = require("../controllers/SmsController");

router.post("/notifyTenants", notifyUsers);

module.exports = router;
