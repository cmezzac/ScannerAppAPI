const express = require("express");
const router = express.Router();
const { createUser } = require("../controllers/UserController");
const { authenticateToken } = require("../middleware/authenticationToken");

router.post("/createUser", authenticateToken, createUser);

module.exports = router;
