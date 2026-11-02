import User from "../models/authModel.js";

export const isAdmin = async (req, res, next) => {
  try {
    // Get user ID from your existing authentication middleware
    const userId = req.id || req.user?._id;
    const user = await User.findById(userId);

    // Check if the logged-in user's email matches your admin email
    if (!user || user.email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({ 
        success: false, 
        message: "Access denied." 
      });
    }

    next();
  } catch (error) {
    console.error("Admin security error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};