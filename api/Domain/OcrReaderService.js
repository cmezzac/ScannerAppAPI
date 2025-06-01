const Tesseract = require("tesseract.js");

async function getShippingLabelAsString(base64Image) {
  const imageBuffer = Buffer.from(base64Image, "base64");

  try {
    const {
      data: { text },
    } = await Tesseract.recognize(imageBuffer, "eng", {});
    console.log("Extracted text:", text);
    return text;
  } catch (err) {
    console.error("OCR error:", err);
    return null;
  }
}

module.exports = { getShippingLabelAsString };
