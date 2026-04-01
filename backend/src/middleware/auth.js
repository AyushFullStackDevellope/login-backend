const jwt = require("jsonwebtoken");
const { errorResponse } = require("../utils/response");

const SECRET = process.env.JWT_SECRET || "secret";

// Generic verify for both pre-context and access token
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return errorResponse(res, 401, "Missing Authorization header");
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return errorResponse(res, 401, "Invalid token format");
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return errorResponse(res, 401, "Invalid or expired token");
  }
}

// Only for routes that require final scoped access token
function verifyAccessToken(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user && req.user.token_type === "access") {
      next();
    } else {
      return errorResponse(res, 403, "Access token required");
    }
  });
}

module.exports = {
  verifyToken,
  verifyAccessToken,
};