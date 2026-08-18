import jwt from "jsonwebtoken";
import User from "../Model/User.js"; // adjust path to your actual User model

// ---------------------------------------------
// requireAuth: verifies the JWT sent by the client
// Attaches the logged-in user to req.user
// ---------------------------------------------
export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // decoded should contain the user id, e.g. { id: "..." }
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({
      success: false,
      message: "Not authorized, invalid token",
    });
  }
};

// ---------------------------------------------
// requireAdmin: use AFTER requireAuth on admin-only routes
// e.g. router.post("/", requireAuth, requireAdmin, createProduct)
// ---------------------------------------------
export const requireAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({
      success: false,
      message: "Admin access only",
    });
  }
  next();
};