const express = require("express");
const router = express.Router();
const { readImageLabel } = require("../services/LabelReaderService");
const { getShippingLabelAsString } = require("../services/OcrReaderService");

router.post("/readShippingLabel", async (req, res) => {
  try {
    const image = req.body.image;
    const ocrText = await getShippingLabelAsString(image);

    const result = await readImageLabel(ocrText);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to process label" });
  }
});

module.exports = router;
