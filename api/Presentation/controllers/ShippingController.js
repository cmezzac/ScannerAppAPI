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

const {
  uploadBase64ImageToS3,
  deleteFromS3,
} = require("../../Domain/services/s3ImageService");

const readShippingLabel = async (req, res) => {
  let s3Image;
  try {
    const { detailsImage, fullPackageImage, isUrgent } = req.body;
    const moneySwitch = false;

    if (!detailsImage || !fullPackageImage) {
      return res.status(400).json({ error: "Missing image in request body" });
    }

    //base 64 -> S3 url.
    s3Image = await uploadBase64ImageToS3(fullPackageImage);

    let result;

    if (moneySwitch) {
      console.log("MONEYSWITCH = true");
      const aiText = await readShippingLabelWithOpenAI(detailsImage);
      console.log(aiText);
      const cleaned = aiText.replace(/```json|```/g, "").trim();

      let parsed;
      try {
        parsed = JSON.parse(cleaned);
      } catch (err) {
        console.error("Failed to parse JSON from GPT:", err);
        return res.status(500).json({ error: "Invalid JSON from AI response" });
      }

      result = parsed;
      console.log(result);
    } else {
      console.log("MONEYSWITCH = false");

      const shippingLabel = generateFakeShippingLabel();
      result = shippingLabel;
    }
    const data = await createPackageForUser(
      result.Name,
      result.TrackingNumber,
      result.Courier,
      s3Image,
      isUrgent
    );

    res.status(200).json(data);
  } catch (error) {
    console.error("❌ Failed to process label:", error);
    await deleteFromS3(s3Image);
    res.status(500).json({ error: "Failed to process label" });
  }
};

module.exports = {
  readShippingLabel,
};
