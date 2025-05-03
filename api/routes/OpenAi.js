const express = require("express");
const router = express.Router();
const { readImageLabel } = require("../services/LabelReaderService");

router.get("/readShippingLabel", async (req, res) => {
  try {
    const result = await readImageLabel();
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to process label" });
  }
});

module.exports = router;
