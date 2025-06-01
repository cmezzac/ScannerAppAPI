const Building = require("../../DataAccess/models/Building");

const insertNewBuilding = async (req, res) => {
  const { Name, Adress, numberOfApartment } = req.body;

  try {
    const newBuilding = new Building({
      Name,
      Adress,
      numberOfApartment,
    });

    await newBuilding.save();

    res.status(200).json({
      message: `Building successfully created with Name: ${Name} and Address: ${Adress}`,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  insertNewBuilding,
};
