const AuthUser = require("../../DataAccess/models/AuthenticatedUser");
const bcrypt = require("bcryptjs");

const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../../Domain/services/tokenService");

const signup = async (req, res) => {
  try {
    const { username, password, buildingId, role } = req.body;

    const existing = await AuthUser.findOne({ username });

    if (existing) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await AuthUser.create({
      username,
      password: hashed,
      buildingId,
      role,
    });

    res.status(201).json({ message: "User Sucessfully Signed Up!" });
  } catch (error) {
    res.status(500).json({ message: "Signup failed", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await AuthUser.findOne({ username })
      .populate("buildingId")
      .populate("role");

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        buildingId: user.buildingId,
        role: user.role,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: "Missing refresh token" });
    }

    const decoded = verifyRefreshToken(refreshToken);

    const user = await AuthUser.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const newAccessToken = generateAccessToken(user._id);

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    console.error("Refresh token error:", error);
    return res
      .status(401)
      .json({ message: "Invalid or expired refresh token" });
  }
};

module.exports = { signup, login, refresh };
