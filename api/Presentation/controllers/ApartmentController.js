const Apartment = require("../../DataAccess/models/Apartment");
const User = require("../../DataAccess/models/User");

const createNewApartment = async (req, res) => {
  const { number, firstName, lastName, buildingId } = req.body;

  if (
    !Array.isArray(firstName) ||
    !Array.isArray(lastName) ||
    firstName.length !== lastName.length
  ) {
    return res.status(400).json({
      error: "firstName and lastName must be arrays of equal length",
    });
  }

  try {
    const userIds = [];

    for (let i = 0; i < firstName.length; i++) {
      const user = await User.findOne({
        firstName: firstName[i],
        lastName: lastName[i],
        buildingId,
      });

      if (!user) {
        return res.status(404).json({
          error: `User not found: ${firstName[i]} ${lastName[i]}`,
        });
      }

      userIds.push(user._id);
    }

    if (userIds.length > 3) {
      return res
        .status(400)
        .json({ error: "An apartment can have a maximum of 3 users." });
    }

    const newApartment = new Apartment({
      number,
      userIds,
      buildingId,
    });

    await newApartment.save();

    res.status(200).json({
      message: `Apartment ${number} created with ${userIds.length} user(s).`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addTenant = async (req, res) => {
  const {firstName,lastName} = req.body;

  const userIds = [];

  for (let i = 0; i < firstName.length; i++) {
    const user = await User.findOne({
      firstName: firstName[i],
      lastName: lastName[i],
      buildingId,
    });

    if (!user) {
      return res.status(404).json({
        error: `User not found: ${firstName[i]} ${lastName[i]}`,
      });
    }

    userIds.push(user._id);
  }

};

module.exports = {
  createNewApartment,
};
