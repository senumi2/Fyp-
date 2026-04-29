const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // මෙහිදී decoded.role සහ decoded.jobRole යන දෙකම පරීක්ෂා කරයි
    req.user = {
      id: decoded.id || decoded._id || decoded.userId,
      email: decoded.email,
      role: decoded.role || decoded.jobRole 
    };

    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Admin Role එක පරීක්ෂා කිරීමට
authMiddleware.admin = (req, res, next) => {
  // role එක lowercase කර "admin" ද කියා පරීක්ෂා කිරීම වඩාත් ආරක්ෂිතයි
  if (req.user && req.user.role && req.user.role.toLowerCase().trim() === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Admin only." });
  }
};

module.exports = authMiddleware;