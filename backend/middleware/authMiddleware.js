const jwt = require("jsonwebtoken");

// ප්‍රධාන Middleware function එක
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // User දත්ත Normalize කිරීම
    req.user = {
      id: decoded.id || decoded._id || decoded.userId,
      email: decoded.email,
      role: decoded.role
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};

// Admin චෙක් එක මෙතනට අමුණනවා (පරණ routes බේරගන්න කරන උපක්‍රමය)
authMiddleware.admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Admins only." });
  }
};

module.exports = authMiddleware;