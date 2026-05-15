const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
 
    req.user = {
      id: decoded.id || decoded._id || decoded.userId,
      email: decoded.email,
      role: (decoded.role || decoded.jobRole || "").toLowerCase().trim() 
    };

    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};


authMiddleware.admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    console.log("Forbidden: User role is", req.user ? req.user.role : "none");
    return res.status(403).json({ message: "Access denied. Admin only." });
  }
};

module.exports = authMiddleware;