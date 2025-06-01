const Package = require("../../DataAccess/models/Package");
const User = require("../../DataAccess/models/User");

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
      apartmentId: user.apartmentId, // assuming your User model has this
      buildingId: user.buildingId,
      status: "Pending", // or Delivered, depending on your logic
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

module.exports = { addPackage };
