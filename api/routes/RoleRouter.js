const express = require("express");
const router = express.Router();
const Role = require("../database/models/Role");

router.post("/createNewRole", async (req, res) => {
  const { name, privileges } = req.body;

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
});

module.exports = router;
