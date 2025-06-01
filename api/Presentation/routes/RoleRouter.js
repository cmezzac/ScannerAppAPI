const express = require("express");
const router = express.Router();
const { createNewRole } = require("../controllers/RoleController");

router.post("/createNewRole", createNewRole);

module.exports = router;
