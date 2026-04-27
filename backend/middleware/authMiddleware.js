const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    console.log("❌ No token provided in headers");
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // බහුලව භාවිතා වන ID වර්ග සියල්ලම මෙතන පරීක්ෂා කරනවා
    const userId = decoded.id || decoded._id || decoded.userId;

    if (!userId) {
      console.log("❌ Token verified but no User ID found in payload");
      return res.status(401).json({ message: "Invalid token payload" });
    }

    req.user = {
      id: userId,
      email: decoded.email,
      role: decoded.role
    };
    
    next();
  } catch (err) {
    console.log("❌ JWT Verification Failed:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

authMiddleware.admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Admin only." });
  }
};

module.exports = authMiddleware;