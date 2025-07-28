const express = require("express");
const router = express.Router();
const { getImageUrl } = require("../controllers/S3Controller");
const { authenticateToken } = require("../middleware/authenticationToken");

router.get("/presignedUrl", authenticateToken, getImageUrl);

module.exports = router;
