const express = require("express");
const router = express.Router();
const { getImageUrl } = require("../controllers/S3Controller");

router.get("/presignedUrl", getImageUrl);

module.exports = router;
