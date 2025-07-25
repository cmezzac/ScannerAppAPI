const Package = require("../../DataAccess/models/Package");
const User = require("../../DataAccess/models/User");
const Apartment = require("../../DataAccess/models/Apartment");
const Building = require("../../DataAccess/models/Building");

const addPackage = async (req, res) => {
  const { trackingNumber, name } = req.body;

  if (!trackingNumber || !name) {
    return res.status(400).json({ error: "Missing trackingNumber or name." });
  }

  try {
    // Find user by name (assume full name string or split as needed)
    const [firstName, lastName] = name.split(" ");
    const user = await User.findOne({ firstName, lastName });

    if (!user) {
      return res.status(404).json({ error: `User ${name} not found.` });
    }

    const newPackage = new Package({
      trackingNumber,
      userId: user._id,
      apartmentId: user.apartmentId,
      buildingId: user.buildingId,
      status: "Pending",
      receivedAt: new Date(),
    });

    await newPackage.save();

    res.status(201).json({
      message: `Package ${trackingNumber} saved for ${name}`,
      packageId: newPackage._id,
    });
  } catch (err) {
    console.error("Failed to add package:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getPendingPackages = async (req, res) => {
  console.log("Trying to get packages!");
  try {
    const pendingPackages = await Package.find({ status: "Pending" })
      .populate({
        path: "userId",
        populate: {
          path: "apartmentId",
        },
      })
      .populate("buildingId");

    // Group by apartment number
    const grouped = {};

    for (const pkg of pendingPackages) {
      const apartmentNumber = pkg.userId?.apartmentId?.number || "Unknown";

      if (!grouped[apartmentNumber]) {
        grouped[apartmentNumber] = {
          apartmentNumber,
          packages: [],
        };
      }

      grouped[apartmentNumber].packages.push({
        trackingNumber: pkg.trackingNumber,
        name: `${pkg.userId.firstName} ${pkg.userId.lastName}`,
        scannedDate: pkg.processedDate,
        urgent: pkg.urgent,
        courrier: pkg.courrier,
        photo: pkg.photo,
      });
    }

    // Convert grouped object into an array
    const result = Object.values(grouped);

    res.status(200).json(result);
  } catch (err) {
    console.error("Failed to retrieve and group pending packages:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getConfirmedPackages = async (req, res) => {
  console.log("Trying to get Confirmed Packages");

  try {
    const confirmedPackages = await Package.find({ status: "Confirmed" })
      .populate({
        path: "userId",
        populate: {
          path: "apartmentId",
        },
      })
      .populate("buildingId");

    const grouped = {};

    for (const pkg of confirmedPackages) {
      console.log(pkg);
      const apartmentNumber = pkg.userId?.apartmentId?.number || "Unknown";

      if (!grouped[apartmentNumber]) {
        grouped[apartmentNumber] = {
          apartmentNumber,
          packages: [],
        };
      }

      grouped[apartmentNumber].packages.push({
        trackingNumber: pkg.trackingNumber,
        name: `${pkg.userId.firstName} ${pkg.userId.lastName}`,
        scannedDate: pkg.processedDate,
        confirmedDate: pkg.confirmationDate,
        urgent: pkg.urgent,
        courrier: pkg.courrier,
        photo: pkg.photo,
      });
    }
    const result = Object.values(grouped);

    res.status(200).json(result);
  } catch (error) {
    console.error("Failed to retrieve and group pending packages:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getPackageDetails = async (req, res) => {
  const { packageId } = req.params;

  if (!packageId) {
    return res.status(400).json({ error: "Missing package ID" });
  }

  try {
    const pkg = await Package.findById(packageId)
      .populate({
        path: "userId",
        populate: [
          { path: "apartmentId", model: "Apartment" },
          { path: "buildingId", model: "Building" },
          { path: "role" },
        ],
      })
      .populate("buildingId");

    if (!pkg || !pkg.userId) {
      return res.status(404).json({ error: "Package not found" });
    }

    const apartmentNumber = pkg.userId.apartmentId?.number || "Unknown";
    const buildingName =
      pkg.buildingId?.name || pkg.userId.buildingId?.name || "Unknown";
    const userFullName = `${pkg.userId.firstName} ${pkg.userId.lastName}`;

    res.status(200).json({
      building: buildingName,
      apartment: apartmentNumber,
      name: userFullName,
      trackingNumber: pkg.trackingNumber,
      imageUrl: pkg.photo || "/webappimage.jpg",
      status: pkg.status,
    });
  } catch (err) {
    console.error("❌ Failed to get package details:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const confirmPackage = async (req, res) => {
  console.log("Confirming");
  const { packageId, confirmationDate } = req.body;

  if (!packageId) {
    return res.status(400).json({ error: "Missing package ID" });
  }

  try {
    const pkg = await Package.findById(packageId);

    if (!pkg) {
      return res.status(404).json({ error: "Package not found" });
    }

    pkg.status = "Confirmed";
    pkg.confirmationDate = confirmationDate
      ? new Date(confirmationDate)
      : new Date();
    await pkg.save();

    res.status(200).json({ message: "Package confirmed", packageId });
  } catch (error) {
    console.error("❌ Error confirming package:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  addPackage,
  getPendingPackages,
  getConfirmedPackages,
  getPackageDetails,
  confirmPackage,
};
