
// import express from "express";
// import upload from "../middleware/multer.js";

// import {
//   signup,
//   verifyOtp,
//   signin,
//   logout,
//   forgotPassword,
//   resetPassword,
//   resendOtp,
// } from "../controllers/authController.js";
// import { isAuthenticated } from "../middleware/authMiddleware.js";

// const router = express.Router();

// // Signup: accepts text fields and an optional profile picture[cite: 6]
// router.post("/signup", upload.single("profilePicture"), signup,isAuthenticated);

// // Verify OTP sent to the user's email[cite: 6]
// router.post("/verify-otp", verifyOtp,isAuthenticated);
// router.post("/resend-otp", resendOtp,isAuthenticated);
// // Sign in after successful registration[cite: 6]
// router.post("/signin", signin,isAuthenticated);

// // Forgot Password: send reset OTP to email
// router.post("/forgot-password", forgotPassword);

// // Reset Password: verify OTP and save new password
// router.post("/reset-password", resetPassword);

// // Logout in ecommerce web[cite: 6]
// router.post("/logout", logout);

// export default router;

import express from "express";
import upload from "../middleware/multer.js";

import {
  signup,
  verifyOtp,
  signin,
  logout,
  forgotPassword,
  resetPassword,
  resendOtp,
} from "../controllers/authController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public Auth Routes (No isAuthenticated middleware)
router.post("/signup", upload.single("profilePicture"), signup);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.post("/signin", signin);

// Password Management Routes
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Protected Routes (Keep isAuthenticated here)
router.post("/logout", isAuthenticated, logout);

export default router;