const Role = require("../../DataAccess/models/Role");

const createNewRole = async (req, res) => {
  const { name, privileges } = req.body;

  if (!name || !Array.isArray(privileges)) {
    return res.status(400).json({
      error: "Role name and privileges (as an array) are required.",
    });
  }

  try {
    const newRole = new Role({
      name,
      privileges,
    });

    await newRole.save();

    res.status(200).json({
      message: `Role successfully created with name: ${name} and privileges: ${privileges.join(
        ", "
      )}`,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  createNewRole,
};
