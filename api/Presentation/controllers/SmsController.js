const Package = require("../../DataAccess/models/Package");
const User = require("../../DataAccess/models/User");

const { sendSMS } = require("../../Domain/services/textMessageService");

const notifyUsers = async (req, res) => {
  try {
    const data = req.packageIds;

    // Validate request body
    if (!data || typeof data !== "object" || Object.keys(data).length === 0) {
      return res
        .status(400)
        .json({ error: "Invalid or empty packageIds payload." });
    }

    const failed = [];
    const successful = [];

    for (const [name, trackingIds] of Object.entries(data)) {
      if (!Array.isArray(trackingIds)) continue;

      for (const trackingId of trackingIds) {
        try {
          const pkg = await Package.findOne({ trackingId });

          if (!pkg) {
            console.warn(
              `❗ Package with tracking ID ${trackingId} not found.`
            );
            failed.push({ trackingId, reason: "Package not found" });
            continue;
          }

          const {
            name: firstName,
            phone,
            building,
          } = await getUserAndBuildingInfo(pkg._id);

          const webAppUrl = process.env.WEB_APP_URL;
          const link = `${webAppUrl}/${pkg._id}`;
          const message = `${building}\n📦 Hey ${firstName}, we have your package (Tracking ID: ${trackingId}).\nPlease confirm pickup with the doorman:\n${link}`;

          await sendSMS(phone, message);
          successful.push(trackingId);
        } catch (innerErr) {
          console.error(
            `❌ Failed to send SMS for ${trackingId}:`,
            innerErr.message
          );
          failed.push({ trackingId, reason: innerErr.message });
        }
      }
    }

    return res.status(200).json({
      message: "Notification process complete.",
      successfulCount: successful.length,
      failedCount: failed.length,
      failed,
    });
  } catch (err) {
    console.error("❌ notifyUsers failed:", err.message);
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: err.message });
  }
};

async function getUserAndBuildingInfo(packageId) {
  const pkg = await Package.findById(packageId).populate({
    path: "userId",
    select: "firstName phoneNumber buildingId",
    populate: {
      path: "buildingId",
      select: "name",
    },
  });

  if (!pkg) {
    throw new Error("Package not found");
  }

  const user = pkg.userId;
  const building = user.buildingId;

  return {
    name: user.firstName,
    phone: user.phoneNumber,
    building: building.name,
  };
}

module.exports = {
  notifyUsers,
};
