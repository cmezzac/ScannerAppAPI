const { getPresignedUrl } = require("../../Domain/services/s3ImageService");

const getImageUrl = async (req, res) => {
  const imageUrl = req.query.key;

  if (!imageUrl) {
    return res.status(400).json({ error: "Missing Key Parameter" });
  }

  const key = getKeyFromUrl(imageUrl);

  if (!key) {
    return res.status(400).json({ error: "Invalid key or URL format" });
  }

  try {
    const url = await getPresignedUrl(key);
    console.log("AWS S3 URL: ", url);
    return res.json({ url });
  } catch (error) {
    console.error("Error generating pre-signed URL:", error);
    return res.status(500).json({ error: "Failed to generate signed URL" });
  }
};

const getKeyFromUrl = (input) => {
  try {
    const u = new URL(input); // input is a full URL
    return u.pathname.slice(1);
  } catch {
    return input; // input was already just a key
  }
};

module.exports = {
  getImageUrl,
};
