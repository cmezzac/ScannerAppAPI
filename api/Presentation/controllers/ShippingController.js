const { readImageLabel } = require("../../Domain/LabelReaderService");
const { getShippingLabelAsString } = require("../../Domain/OcrReaderService");

const readShippingLabel = async (req, res) => {
  try {
    const image = req.body.image;

    if (!image) {
      return res.status(400).json({ error: "Missing image in request body" });
    }

    const ocrText = await getShippingLabelAsString(image);
    const result = await readImageLabel(ocrText);

    res.status(200).json(result);
  } catch (error) {
    console.error("❌ Failed to process label:", error);
    res.status(500).json({ error: "Failed to process label" });
  }
};

module.exports = {
  readShippingLabel,
};
