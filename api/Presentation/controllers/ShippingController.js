const fs = require("fs");
const path = require("path");

const { readImageLabel } = require("../../Domain/services/LabelReaderService");
const {
  getShippingLabelAsString,
} = require("../../Domain/services/OcrReaderService");

const {
  readShippingLabelWithOpenAI,
} = require("../../Domain/services/aiService");

const {
  generateFakeShippingLabel,
} = require("../../Domain/services/fakeDataService");
const {
  createPackageForUser,
} = require("../../DataAccess/services/packageService");

const readShippingLabel = async (req, res) => {
  try {
    const { detailsImage, fullPackageImage, isUrgent } = req.body;
    const moneySwitch = false;

    if (!detailsImage || !fullPackageImage) {
      return res.status(400).json({ error: "Missing image in request body" });
    }

    let result;

    if (moneySwitch) {
      console.log("MONEYSWITCH = true");
      const aiText = await readShippingLabelWithOpenAI(detailsImage);
      console.log(aiText);
      const cleaned = aiText.replace(/```json|```/g, "").trim();

      let parsed;
      try {
        parsed = JSON.parse(cleaned); // ✅ Final usable object
      } catch (err) {
        console.error("Failed to parse JSON from GPT:", err);
        return res.status(500).json({ error: "Invalid JSON from AI response" });
      }

      result = parsed; // your final structured result
      console.log(result);
    } else {
      console.log("MONEYSWITCH = false");

      const shippingLabel = generateFakeShippingLabel();
      result = shippingLabel;
      //COMMENTED OCR FOR FAKE DATA FOR NOW
      //const ocrText = await getShippingLabelAsString(image);
      //result = await readImageLabel(ocrText);
    }
    const data = await createPackageForUser(
      result.Name,
      result.TrackingNumber,
      result.Courier,
      fullPackageImage,
      isUrgent
    );

    console.log(data);

    res.status(200).json(data);
  } catch (error) {
    console.error("❌ Failed to process label:", error);
    res.status(500).json({ error: "Failed to process label" });
  }
};

module.exports = {
  readShippingLabel,
};
