const { verifyAccessToken } = require("../../Domain/services/tokenService"); // adjust path as needed

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied! Access Token Missing" });
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token Invalid Or Expired" });
  }
}

module.exports = {
  authenticateToken,
};
