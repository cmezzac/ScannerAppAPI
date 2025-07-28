const express = require("express");
const router = express.Router();
const { createNewRole } = require("../controllers/RoleController");
const { authenticateToken } = require("../middleware/authenticationToken");

router.post("/createNewRole", authenticateToken, createNewRole);

module.exports = router;
