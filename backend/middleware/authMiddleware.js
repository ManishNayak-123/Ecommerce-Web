
import jwt from "jsonwebtoken";
import User from "../models/authModel.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    let token = null;

    // 1. Check Authorization Header first (Bearer token)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // 2. Fallback to check cookies if header is missing
    if (!token && req.cookies) {
      token = req.cookies.token || req.cookies.jwt || req.cookies.accessToken;
    }

    if (!token) {
      return res.status(401).json({ message: "Authentication token is missing. Please log in." });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user by id (handling different payload naming conventions: id, _id, userId)
    const userId = decoded.id || decoded._id || decoded.userId;
    req.user = await User.findById(userId).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found." });
    }

    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};