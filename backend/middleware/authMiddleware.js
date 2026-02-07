const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  // ❌ No token
  if (!token) {
    return res.status(401).json({ message: "No token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    /*
      decoded object eka mehema wenna puluwan:
      {
        id: "userId",
        email: "...",
        role: "...",
        iat: ...
      }
    */

    // 🔥 normalize user data (old + new processes friendly)
    req.user = {
      id: decoded.id || decoded._id || decoded.userId,
      email: decoded.email,
      role: decoded.role
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
