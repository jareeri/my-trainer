const jwt = require("jsonwebtoken");

const verifyRole = (requiredRole) => (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      req.user = decoded;

      // Check user role
      if (req.user.role === requiredRole) {
        // User has the required role, allow access
        next();
      } else {
        // User does not have the required role, deny access
        return res
          .status(403)
          .json({ success: false, message: "Permission denied" });
      }
    } catch (error) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
  } else {
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });
  }
};

module.exports = {
    verifyRole,
};
