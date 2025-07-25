const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const dotenv = require("dotenv");

dotenv.config();

const s3 = new S3Client({
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const uploadBase64ImageToS3 = async (base64Image) => {
  // Remove base64 prefix if it exists
  const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64Data, "base64");

  const contentTypeMatch = base64Image.match(/^data:(image\/\w+);base64,/);
  const contentType = contentTypeMatch ? contentTypeMatch[1] : "image/jpeg";

  const key = `${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 10)}.jpg`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    ContentEncoding: "base64",
  });

  await s3.send(command);

  return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_BUCKET_REGION}.amazonaws.com/${key}`;
};

const deleteFromS3 = async (fileKeyOrUrl) => {
  let key = fileKeyOrUrl;

  // If a full URL is passed, extract the key
  if (fileKeyOrUrl.startsWith("http")) {
    const urlParts = fileKeyOrUrl.split("/");
    key = urlParts.slice(3).join("/"); // removes https://bucket.s3.region.amazonaws.com/
  }

  const command = new DeleteObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  });

  await s3.send(command);
  console.log(`Deleted from S3: ${key}`);
};

const getPresignedUrl = async (key, expiresIn = 300) => {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  });

  const url = await getSignedUrl(s3, command, { expiresIn });
  return url;
};

module.exports = {
  uploadBase64ImageToS3,
  deleteFromS3,
  getPresignedUrl,
};
