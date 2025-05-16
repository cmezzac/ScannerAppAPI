const express = require("express");
const router = express.Router();
const Building = require("../database/models/Building");

router.post("/insertNewBuilding", async (req, res) => {
  const { Name, Adress, buildingId } = req.body;

  try {
    const newBuilding = new Building({
      Name,
      Adress,
      buildingId,
    });

    await newBuilding.save();

    res.status(200).json({
      message: `Building successfully created with Name: ${Name} and Address: ${Adress}`,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
module.exports = router;
