const Role = require("../../DataAccess/models/Role");

const createNewRole = async (req, res) => {
  const { name, role_id, privileges } = req.body;

  if (!name || typeof role_id !== "number" || !Array.isArray(privileges)) {
    return res.status(400).json({
      error:
        "Role name, numeric role_id, and privileges (as an array) are required.",
    });
  }

  try {
    const newRole = new Role({
      name,
      role_id,
      privileges,
    });

    await newRole.save();

    res.status(200).json({
      message: `Role successfully created with name: ${name}, role_id: ${role_id}, and privileges: ${privileges.join(
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
