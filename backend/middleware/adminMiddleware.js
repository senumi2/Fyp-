module.exports = (req, res, next) => {
  // req.user එක authMiddleware එකෙන් කලින්ම set කරලා තියෙන්න ඕනේ
  if (req.user && req.user.role === "admin") {
      next();
  } else {
      return res.status(403).json({ message: "Forbidden: Admin access only" });
  }
};