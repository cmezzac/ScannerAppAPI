const Package = require("../models/Package");
const User = require("../models/User");

async function createPackageForUser(
  fullName,
  userTrackingNumber,
  shippingCourrier,
  image,
  isUrgent
) {
  try {
    if (!fullName || !userTrackingNumber || !shippingCourrier || !image) {
      throw new Error("Missing required fields.");
    }

    const nameParts = fullName.trim().split(" ");
    if (nameParts.length < 2) {
      throw new Error("Full name must include both first and last names.");
    }

    const [firstName, lastName] = nameParts;

    const user = await User.findOne({ firstName, lastName });
    if (!user) {
      throw new Error(`User "${fullName}" not found.`);
    }

    const newPackage = new Package({
      userId: user._id,
      trackingNumber: userTrackingNumber,
      courrier: shippingCourrier,
      buildingId: user.buildingId,
      urgent: isUrgent,
      photo: image,
    });

    console.log("📦 New package to be saved:", {
      userId: newPackage.userId,
      trackingNumber: newPackage.trackingNumber,
      courrier: newPackage.courrier,
      buildingId: newPackage.buildingId,
      urgent: newPackage.urgent,
      photo: newPackage.photo ? "[image included]" : "No image",
    });

    await newPackage.save().catch((err) => {
      console.error("❌ Mongoose Save Error:", err);
      throw err;
    });
    console.log("📦 Package successfully saved for user:", fullName);
    return { success: true, message: "Package created successfully." };
  } catch (error) {
    console.error("❌ Failed to create package:", error.message);
    return { success: false, error: error.message };
  }
}

module.exports = {
  createPackageForUser,
};
