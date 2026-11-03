

// import jwt from "jsonwebtoken";
// import bcrypt from "bcryptjs";
// import crypto from "node:crypto";
// import axios from "axios";

// import User from "../models/authModel.js";
// import PendingRegistration from "../models/pendingRegistrationModel.js";
// import sendOtpEmail from "../Utils/sendEmail.js";

// // Generate JWT
// const generateToken = (userId) => {
//   if (!process.env.JWT_SECRET) {
//     throw new Error("JWT_SECRET is missing in backend .env");
//   }

//   return jwt.sign(
//     { userId },
//     process.env.JWT_SECRET,
//     { expiresIn: "1d" }
//   );
// };

// // Generate a six-digit OTP
// const generateOtp = () => {
//   return crypto.randomInt(0, 1000000)
//     .toString()
//     .padStart(6, "0");
// };

// // Store only a hash of the OTP
// const hashOtp = (otp) => {
//   return crypto
//     .createHash("sha256")
//     .update(otp)
//     .digest("hex");
// };

// // Validate email
// const isValidEmail = (email) => {
//   return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
// };

// // Verify Google reCAPTCHA on the backend
// const verifyCaptcha = async (captchaToken) => {
//   if (!process.env.RECAPTCHA_SECRET_KEY) {
//     throw new Error("RECAPTCHA_SECRET_KEY is missing");
//   }

//   const response = await axios.post(
//     "https://www.google.com/recaptcha/api/siteverify",
//     new URLSearchParams({
//       secret: process.env.RECAPTCHA_SECRET_KEY,
//       response: captchaToken,
//     }),
//     {
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//       timeout: 10000,
//     }
//   );

//   return response.data;
// };

// // ----------------------------------
// // SIGNUP
// // POST /api/v1/user/signup
// // ----------------------------------
// export const signup = async (req, res) => {
//   try {
//     const { name, email, password, captchaToken } = req.body ?? {};

//     if (typeof name !== "string" || name.trim().length < 2) {
//       return res.status(400).json({
//         success: false,
//         message: "Please enter your full name.",
//       });
//     }

//     if (
//       typeof email !== "string" ||
//       !isValidEmail(email.trim())
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "Enter a valid email address.",
//       });
//     }

//     if (
//       typeof password !== "string" ||
//       password.length < 8
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "Password must be at least 8 characters.",
//       });
//     }

//     if (
//       typeof captchaToken !== "string" ||
//       !captchaToken.trim()
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "Please complete CAPTCHA.",
//       });
//     }

//     // Verify CAPTCHA
//     let captchaResult;

//     try {
//       captchaResult = await verifyCaptcha(captchaToken);
//     } catch (error) {
//       console.error("CAPTCHA verification error:", error.message);

//       return res.status(502).json({
//         success: false,
//         message: "Unable to verify CAPTCHA. Check your backend configuration.",
//       });
//     }

//     if (!captchaResult.success) {
//       console.error(
//         "CAPTCHA error codes:",
//         captchaResult["error-codes"]
//       );

//       return res.status(400).json({
//         success: false,
//         message: "CAPTCHA verification failed. Please try again.",
//       });
//     }

//     const normalizedEmail = email.trim().toLowerCase();
//     const normalizedName = name.trim();

//     // Check if account already exists
//     const existingUser = await User.findOne({
//       email: normalizedEmail,
//     });

//     if (existingUser) {
//       return res.status(409).json({
//         success: false,
//         message: "Email already registered. Please sign in.",
//       });
//     }

//     // Capture uploaded file filename
//     const profilePicture = req.file ? req.file.filename : "";

//     // Hash password and generate OTP
//     const passwordHash = await bcrypt.hash(password, 12);
//     const otp = generateOtp();
//     const otpHash = hashOtp(otp);

//     // Create or replace pending registration with profilePicture filename
//     await PendingRegistration.findOneAndUpdate(
//       { email: normalizedEmail },
//       {
//         $set: {
//           name: normalizedName,
//           email: normalizedEmail,
//           passwordHash,
//           otpHash,
//           profilePicture,
//           expiresAt: new Date(Date.now() + 5 * 60 * 1000),
//           attempts: 0,
//         },
//       },
//       {
//         upsert: true,
//         new: true,
//         runValidators: true,
//         setDefaultsOnInsert: true,
//       }
//     );

//     // Send OTP to the user's email
//     try {
//       await sendOtpEmail(normalizedEmail, otp);
//     } catch (error) {
//       console.error("OTP email error:", error.message);

//       await PendingRegistration.deleteOne({
//         email: normalizedEmail,
//         otpHash,
//       });

//       return res.status(502).json({
//         success: false,
//         message: "Unable to send OTP. Check your email service configuration.",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "OTP sent successfully. Check your email.",
//       email: normalizedEmail,
//     });
//   } catch (error) {
//     console.error("Signup error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Internal server error during signup.",
//     });
//   }
// };

// // ----------------------------------
// // RESEND OTP
// // POST /api/v1/user/resend-otp
// // ----------------------------------
// export const resendOtp = async (req, res) => {
//   try {
//     const { email } = req.body ?? {};

//     if (typeof email !== "string" || !isValidEmail(email.trim())) {
//       return res.status(400).json({
//         success: false,
//         message: "Enter a valid email address.",
//       });
//     }

//     const normalizedEmail = email.trim().toLowerCase();

//     const pending = await PendingRegistration.findOne({ email: normalizedEmail });

//     if (!pending) {
//       return res.status(400).json({
//         success: false,
//         message: "No pending registration found. Please sign up again.",
//       });
//     }

//     const otp = generateOtp();
//     const otpHash = hashOtp(otp);

//     pending.otpHash = otpHash;
//     pending.expiresAt = new Date(Date.now() + 5 * 60 * 1000);
//     pending.attempts = 0;
//     await pending.save();

//     try {
//       await sendOtpEmail(normalizedEmail, otp);
//     } catch (error) {
//       console.error("Resend OTP email error:", error.message);
//       return res.status(502).json({
//         success: false,
//         message: "Unable to resend OTP. Check email configuration.",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "A new OTP has been sent to your email.",
//     });
//   } catch (error) {
//     console.error("Resend OTP error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error during resend OTP.",
//     });
//   }
// };

// // ----------------------------------
// // VERIFY OTP
// // POST /api/v1/user/verify-otp
// // ----------------------------------
// export const verifyOtp = async (req, res) => {
//   try {
//     const { email, otp } = req.body ?? {};

//     if (
//       typeof email !== "string" ||
//       !isValidEmail(email.trim()) ||
//       typeof otp !== "string" ||
//       !/^\d{6}$/.test(otp)
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "Enter a valid email and six-digit OTP.",
//       });
//     }

//     const normalizedEmail = email.trim().toLowerCase();

//     const pending = await PendingRegistration.findOne({
//       email: normalizedEmail,
//     }).select("+otpHash");

//     if (!pending) {
//       return res.status(400).json({
//         success: false,
//         message: "Registration not found. Please sign up again.",
//       });
//     }

//     if (
//       !pending.expiresAt ||
//       pending.expiresAt.getTime() <= Date.now()
//     ) {
//       await pending.deleteOne();

//       return res.status(400).json({
//         success: false,
//         message: "OTP expired. Please sign up again.",
//       });
//     }

//     if (pending.attempts >= 5) {
//       await pending.deleteOne();

//       return res.status(429).json({
//         success: false,
//         message: "Too many attempts. Please sign up again.",
//       });
//     }

//     const submittedHash = hashOtp(otp);

//     const isOtpCorrect =
//       typeof pending.otpHash === "string" &&
//       /^[a-f0-9]{64}$/i.test(pending.otpHash) &&
//       crypto.timingSafeEqual(
//         Buffer.from(submittedHash, "hex"),
//         Buffer.from(pending.otpHash, "hex")
//       );

//     if (!isOtpCorrect) {
//       pending.attempts += 1;
//       await pending.save();

//       return res.status(400).json({
//         success: false,
//         message: "Invalid OTP.",
//       });
//     }

//     // Check again before creating account
//     const existingUser = await User.findOne({
//       email: normalizedEmail,
//     });

//     if (existingUser) {
//       await pending.deleteOne();

//       return res.status(409).json({
//         success: false,
//         message: "Email already registered. Please sign in.",
//       });
//     }

//     // Create permanent user including profilePicture from pending registration
//     const user = await User.create({
//       name: pending.name,
//       email: pending.email,
//       password: pending.passwordHash,
//       profilePicture: pending.profilePicture || "",
//     });

//     await pending.deleteOne();

//     const token = generateToken(user._id.toString());

//     return res.status(201).json({
//       success: true,
//       message: "Email verified and registration successful.",
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         profilePicture: user.profilePicture,
//       },
//     });
//   } catch (error) {
//     console.error("OTP verification error:", error);

//     if (error.code === 11000) {
//       return res.status(409).json({
//         success: false,
//         message: "Email already registered.",
//       });
//     }

//     return res.status(500).json({
//       success: false,
//       message: "Internal server error during OTP verification.",
//     });
//   }
// };

// // ----------------------------------
// // SIGNIN
// // POST /api/v1/user/signin
// // ----------------------------------
// export const signin = async (req, res) => {
//   try {
//     const { email, password } = req.body ?? {};

//     if (
//       typeof email !== "string" ||
//       !isValidEmail(email.trim()) ||
//       typeof password !== "string" ||
//       !password
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "Enter a valid email and password.",
//       });
//     }

//     const normalizedEmail = email.trim().toLowerCase();

//     const user = await User.findOne({
//       email: normalizedEmail,
//     }).select("+password");

//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid email or password.",
//       });
//     }

//     const isPasswordCorrect = await bcrypt.compare(
//       password,
//       user.password
//     );

//     if (!isPasswordCorrect) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid email or password.",
//       });
//     }

//     const token = generateToken(user._id.toString());

//     return res.status(200).json({
//       success: true,
//       message: "Signin successful.",
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         profilePicture: user.profilePicture,
//       },
//     });
//   } catch (error) {
//     console.error("Signin error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Internal server error during signin.",
//     });
//   }
// };

// // ----------------------------------
// // FORGOT PASSWORD
// // POST /api/v1/user/forgot-password
// // ----------------------------------
// export const forgotPassword = async (req, res) => {
//   try {
//     const { email } = req.body ?? {};

//     if (typeof email !== "string" || !isValidEmail(email.trim())) {
//       return res.status(400).json({
//         success: false,
//         message: "Enter a valid email address.",
//       });
//     }

//     const normalizedEmail = email.trim().toLowerCase();

//     const user = await User.findOne({ email: normalizedEmail });

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "No user found with this email address.",
//       });
//     }

//     const otp = generateOtp();
//     const otpHash = hashOtp(otp);

//     // Attach temporary reset fields to user
//     user.resetPasswordOtpHash = otpHash;
//     user.resetPasswordExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins expiry
//     user.resetPasswordAttempts = 0;
//     await user.save();

//     // Send OTP email
//     try {
//       await sendOtpEmail(normalizedEmail, otp);
//     } catch (error) {
//       console.error("Forgot password OTP email error:", error.message);
//       return res.status(502).json({
//         success: false,
//         message: "Unable to send password reset OTP. Check email configuration.",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Password reset OTP sent to your email.",
//     });
//   } catch (error) {
//     console.error("Forgot password error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error during forgot password process.",
//     });
//   }
// };

// // ----------------------------------
// // RESET PASSWORD
// // POST /api/v1/user/reset-password
// // ----------------------------------
// export const resetPassword = async (req, res) => {
//   try {
//     const { email, otp, newPassword } = req.body ?? {};

//     if (
//       typeof email !== "string" ||
//       !isValidEmail(email.trim()) ||
//       typeof otp !== "string" ||
//       !/^\d{6}$/.test(otp) ||
//       typeof newPassword !== "string" ||
//       newPassword.length < 6
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "Provide a valid email, 6-digit OTP, and a new password (at least 6 characters).",
//       });
//     }

//     const normalizedEmail = email.trim().toLowerCase();

//     const user = await User.findOne({ email: normalizedEmail }).select("+resetPasswordOtpHash");

//     if (!user) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid request or user not found.",
//       });
//     }

//     if (
//       !user.resetPasswordExpiresAt ||
//       user.resetPasswordExpiresAt.getTime() <= Date.now()
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "OTP expired. Please request a new password reset.",
//       });
//     }

//     if (user.resetPasswordAttempts >= 5) {
//       return res.status(429).json({
//         success: false,
//         message: "Too many failed attempts. Please request a new password reset.",
//       });
//     }

//     const submittedHash = hashOtp(otp);

//     const isOtpCorrect =
//       typeof user.resetPasswordOtpHash === "string" &&
//       /^[a-f0-9]{64}$/i.test(user.resetPasswordOtpHash) &&
//       crypto.timingSafeEqual(
//         Buffer.from(submittedHash, "hex"),
//         Buffer.from(user.resetPasswordOtpHash, "hex")
//       );

//     if (!isOtpCorrect) {
//       user.resetPasswordAttempts = (user.resetPasswordAttempts || 0) + 1;
//       await user.save();

//       return res.status(400).json({
//         success: false,
//         message: "Invalid verification code.",
//       });
//     }

//     const passwordHash = await bcrypt.hash(newPassword, 12);
//     user.password = passwordHash;
//     user.resetPasswordOtpHash = undefined;
//     user.resetPasswordExpiresAt = undefined;
//     user.resetPasswordAttempts = undefined;
//     await user.save();

//     return res.status(200).json({
//       success: true,
//       message: "Password changed successfully! You can now log in.",
//     });
//   } catch (error) {
//     console.error("Reset password error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error during password reset.",
//     });
//   }
// };

// // ----------------------------------
// // LOGOUT
// // POST /api/v1/user/logout
// // ----------------------------------
// export const logout = async (req, res) => {
//   try {
//     return res.status(200).json({
//       success: true,
//       message: "Logged out successfully.",
//     });
//   } catch (error) {
//     console.error("Logout error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Internal server error during logout.",
//     });
//   }
// };

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import axios from "axios";

import User from "../models/authModel.js";
import PendingRegistration from "../models/pendingRegistrationModel.js";
import sendOtpEmail from "../Utils/sendEmail.js";

// Generate JWT
const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing in backend .env");
  }

  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

// Generate a six-digit OTP
const generateOtp = () => {
  return crypto.randomInt(0, 1000000)
    .toString()
    .padStart(6, "0");
};

// Store only a hash of the OTP
const hashOtp = (otp) => {
  return crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");
};

// Validate email
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Verify Google reCAPTCHA on the backend
const verifyCaptcha = async (captchaToken) => {
  if (!process.env.RECAPTCHA_SECRET_KEY) {
    throw new Error("RECAPTCHA_SECRET_KEY is missing");
  }

  const response = await axios.post(
    "https://www.google.com/recaptcha/api/siteverify",
    new URLSearchParams({
      secret: process.env.RECAPTCHA_SECRET_KEY,
      response: captchaToken,
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      timeout: 10000,
    }
  );

  return response.data;
};

// ----------------------------------
// SIGNUP
// POST /api/v1/user/signup
// ----------------------------------
export const signup = async (req, res) => {
  try {
    const { name, email, password, captchaToken } = req.body ?? {};

    if (typeof name !== "string" || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Please enter your full name.",
      });
    }

    if (
      typeof email !== "string" ||
      !isValidEmail(email.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid email address.",
      });
    }

    if (
      typeof password !== "string" ||
      password.length < 8
    ) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters.",
      });
    }

    if (
      typeof captchaToken !== "string" ||
      !captchaToken.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Please complete CAPTCHA.",
      });
    }

    // Verify CAPTCHA
    let captchaResult;

    try {
      captchaResult = await verifyCaptcha(captchaToken);
    } catch (error) {
      console.error("CAPTCHA verification error:", error.message);

      return res.status(502).json({
        success: false,
        message: "Unable to verify CAPTCHA. Check your backend configuration.",
      });
    }

    if (!captchaResult.success) {
      console.error(
        "CAPTCHA error codes:",
        captchaResult["error-codes"]
      );

      return res.status(400).json({
        success: false,
        message: "CAPTCHA verification failed. Please try again.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedName = name.trim();

    // Check if account already exists
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered. Please sign in.",
      });
    }

    // ✅ Capture Cloudinary HTTPS URL from req.file.path instead of local filename
    const profilePicture = req.file ? req.file.path : "";

    // Hash password and generate OTP
    const passwordHash = await bcrypt.hash(password, 12);
    const otp = generateOtp();
    const otpHash = hashOtp(otp);

    // Create or replace pending registration with profilePicture URL
    await PendingRegistration.findOneAndUpdate(
      { email: normalizedEmail },
      {
        $set: {
          name: normalizedName,
          email: normalizedEmail,
          passwordHash,
          otpHash,
          profilePicture,
          expiresAt: new Date(Date.now() + 5 * 60 * 1000),
          attempts: 0,
        },
      },
      {
        upsert: true,
        new: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    // Send OTP to the user's email
    try {
      await sendOtpEmail(normalizedEmail, otp);
    } catch (error) {
      console.error("OTP email error:", error.message);

      await PendingRegistration.deleteOne({
        email: normalizedEmail,
        otpHash,
      });

      return res.status(502).json({
        success: false,
        message: "Unable to send OTP. Check your email service configuration.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully. Check your email.",
      email: normalizedEmail,
    });
  } catch (error) {
    console.error("Signup error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error during signup.",
    });
  }
};

// ----------------------------------
// RESEND OTP
// POST /api/v1/user/resend-otp
// ----------------------------------
export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body ?? {};

    if (typeof email !== "string" || !isValidEmail(email.trim())) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid email address.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const pending = await PendingRegistration.findOne({ email: normalizedEmail });

    if (!pending) {
      return res.status(400).json({
        success: false,
        message: "No pending registration found. Please sign up again.",
      });
    }

    const otp = generateOtp();
    const otpHash = hashOtp(otp);

    pending.otpHash = otpHash;
    pending.expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    pending.attempts = 0;
    await pending.save();

    try {
      await sendOtpEmail(normalizedEmail, otp);
    } catch (error) {
      console.error("Resend OTP email error:", error.message);
      return res.status(502).json({
        success: false,
        message: "Unable to resend OTP. Check email configuration.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "A new OTP has been sent to your email.",
    });
  } catch (error) {
    console.error("Resend OTP error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during resend OTP.",
    });
  }
};

// ----------------------------------
// VERIFY OTP
// POST /api/v1/user/verify-otp
// ----------------------------------
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body ?? {};

    if (
      typeof email !== "string" ||
      !isValidEmail(email.trim()) ||
      typeof otp !== "string" ||
      !/^\d{6}$/.test(otp)
    ) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid email and six-digit OTP.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const pending = await PendingRegistration.findOne({
      email: normalizedEmail,
    }).select("+otpHash");

    if (!pending) {
      return res.status(400).json({
        success: false,
        message: "Registration not found. Please sign up again.",
      });
    }

    if (
      !pending.expiresAt ||
      pending.expiresAt.getTime() <= Date.now()
    ) {
      await pending.deleteOne();

      return res.status(400).json({
        success: false,
        message: "OTP expired. Please sign up again.",
      });
    }

    if (pending.attempts >= 5) {
      await pending.deleteOne();

      return res.status(429).json({
        success: false,
        message: "Too many attempts. Please sign up again.",
      });
    }

    const submittedHash = hashOtp(otp);

    const isOtpCorrect =
      typeof pending.otpHash === "string" &&
      /^[a-f0-9]{64}$/i.test(pending.otpHash) &&
      crypto.timingSafeEqual(
        Buffer.from(submittedHash, "hex"),
        Buffer.from(pending.otpHash, "hex")
      );

    if (!isOtpCorrect) {
      pending.attempts += 1;
      await pending.save();

      return res.status(400).json({
        success: false,
        message: "Invalid OTP.",
      });
    }

    // Check again before creating account
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      await pending.deleteOne();

      return res.status(409).json({
        success: false,
        message: "Email already registered. Please sign in.",
      });
    }

    // Create permanent user including profilePicture from pending registration
    const user = await User.create({
      name: pending.name,
      email: pending.email,
      password: pending.passwordHash,
      profilePicture: pending.profilePicture || "",
    });

    await pending.deleteOne();

    const token = generateToken(user._id.toString());

    return res.status(201).json({
      success: true,
      message: "Email verified and registration successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.error("OTP verification error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email already registered.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error during OTP verification.",
    });
  }
};

// ----------------------------------
// SIGNIN
// POST /api/v1/user/signin
// ----------------------------------
export const signin = async (req, res) => {
  try {
    const { email, password } = req.body ?? {};

    if (
      typeof email !== "string" ||
      !isValidEmail(email.trim()) ||
      typeof password !== "string" ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid email and password.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = generateToken(user._id.toString());

    return res.status(200).json({
      success: true,
      message: "Signin successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.error("Signin error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error during signin.",
    });
  }
};

// ----------------------------------
// FORGOT PASSWORD
// POST /api/v1/user/forgot-password
// ----------------------------------
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body ?? {};

    if (typeof email !== "string" || !isValidEmail(email.trim())) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid email address.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No user found with this email address.",
      });
    }

    const otp = generateOtp();
    const otpHash = hashOtp(otp);

    user.resetPasswordOtpHash = otpHash;
    user.resetPasswordExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
    user.resetPasswordAttempts = 0;
    await user.save();

    try {
      await sendOtpEmail(normalizedEmail, otp);
    } catch (error) {
      console.error("Forgot password OTP email error:", error.message);
      return res.status(502).json({
        success: false,
        message: "Unable to send password reset OTP. Check email configuration.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Password reset OTP sent to your email.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during forgot password process.",
    });
  }
};

// ----------------------------------
// RESET PASSWORD
// POST /api/v1/user/reset-password
// ----------------------------------
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body ?? {};

    if (
      typeof email !== "string" ||
      !isValidEmail(email.trim()) ||
      typeof otp !== "string" ||
      !/^\d{6}$/.test(otp) ||
      typeof newPassword !== "string" ||
      newPassword.length < 6
    ) {
      return res.status(400).json({
        success: false,
        message: "Provide a valid email, 6-digit OTP, and a new password (at least 6 characters).",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail }).select("+resetPasswordOtpHash");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid request or user not found.",
      });
    }

    if (
      !user.resetPasswordExpiresAt ||
      user.resetPasswordExpiresAt.getTime() <= Date.now()
    ) {
      return res.status(400).json({
        success: false,
        message: "OTP expired. Please request a new password reset.",
      });
    }

    if (user.resetPasswordAttempts >= 5) {
      return res.status(429).json({
        success: false,
        message: "Too many failed attempts. Please request a new password reset.",
      });
    }

    const submittedHash = hashOtp(otp);

    const isOtpCorrect =
      typeof user.resetPasswordOtpHash === "string" &&
      /^[a-f0-9]{64}$/i.test(user.resetPasswordOtpHash) &&
      crypto.timingSafeEqual(
        Buffer.from(submittedHash, "hex"),
        Buffer.from(user.resetPasswordOtpHash, "hex")
      );

    if (!isOtpCorrect) {
      user.resetPasswordAttempts = (user.resetPasswordAttempts || 0) + 1;
      await user.save();

      return res.status(400).json({
        success: false,
        message: "Invalid verification code.",
      });
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    user.password = passwordHash;
    user.resetPasswordOtpHash = undefined;
    user.resetPasswordExpiresAt = undefined;
    user.resetPasswordAttempts = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully! You can now log in.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during password reset.",
    });
  }
};

// ----------------------------------
// LOGOUT
// POST /api/v1/user/logout
// ----------------------------------
export const logout = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    console.error("Logout error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error during logout.",
    });
  }
};