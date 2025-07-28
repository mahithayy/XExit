const jwt = require("jsonwebtoken");
const User = require("../models/user");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Authenticate any valid user
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token missing" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.userId === "admin") {
      req.user = { role: "hr", _id: "admin", email: "admin" };
    } else {
      const user = await User.findById(decoded.userId);
      if (!user) return res.status(401).json({ message: "User not found" });
      req.user = user;
    }

    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
};


// Only for employees
const authenticateEmployee = async (req, res, next) => {
  await authenticateToken(req, res, () => {
    if (req.user.role === "admin") {
      return res.status(403).json({ message: "Admins are not allowed here" });
    }
    next();
  });
};

// Only for admin
const authenticateAdmin = async (req, res, next) => {
  await authenticateToken(req, res, () => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can access" });
    }
    next();
  });
};

module.exports = {
  authenticateToken,
  authenticateEmployee,
  authenticateAdmin,
};
