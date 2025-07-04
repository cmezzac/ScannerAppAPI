const Tesseract = require("tesseract.js");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

async function getShippingLabelAsString(base64Image) {
  const imageBuffer = Buffer.from(base64Image, "base64");

  const folderPath = path.join(__dirname, "saved_images");
  const filename = `image_${Date.now()}.jpg`;
  const filePath = path.join(folderPath, filename);

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }

  // Save original image for debugging
  fs.writeFileSync(filePath, imageBuffer);
  console.log("Image saved to:", filePath);

  try {
    // ✅ Preprocess the image
    const processedBuffer = await sharp(imageBuffer)
      .resize({ width: 1000 }) // Resize for better readability
      .grayscale() // Remove colors
      .normalize() // Improve contrast
      .toBuffer();

    // Run OCR on preprocessed image
    const {
      data: { text },
    } = await Tesseract.recognize(processedBuffer, "eng", {});

    console.log("\n--- EXTRACTED TEXT ---");
    console.log(text);
    return text;
  } catch (err) {
    console.error("OCR error:", err);
    return null;
  }
}

module.exports = { getShippingLabelAsString };
