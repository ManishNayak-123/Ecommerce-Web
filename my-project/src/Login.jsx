


import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { USER_API_END_POINT } from "./Utils/Api";

export default function Login({
  isOpen,
  onClose,
  switchToRegister,
  switchToForgotPassword,
}) {
  // View states: "login" | "forgot-request" | "reset-password"
  const [view, setView] = useState("login");

  // Login form state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Forgot / Reset password states
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 1. Handle Login Submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email.trim() || !formData.password) {
      toast.error("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${USER_API_END_POINT}/signin`,
        {
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        },
        {
          withCredentials: true,
          timeout: 20000,
        }
      );

      const data = response.data;
      const token = data?.token;

      if (!token) {
        console.error("Login response does not contain a token:", data);
        toast.error("Authentication token is missing. Please check your backend.");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(data.user || data));

      toast.success(data.message || "Logged in successfully!");

      setFormData({ email: "", password: "" });

      setTimeout(() => {
        onClose?.();
        window.location.reload();
      }, 1000);
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      const errorMsg =
        err.response?.data?.message ||
        (err.code === "ECONNABORTED"
          ? "Request timed out. Check your backend server."
          : "Login failed. Please check your email and password.");
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle Forgot Password - Step 1: Send OTP to Email
  const handleForgotRequest = async (e) => {
    e.preventDefault();

    if (!forgotEmail.trim()) {
      toast.error("Please enter your registered email address.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${USER_API_END_POINT}/forgot-password`,
        { email: forgotEmail.trim().toLowerCase() },
        { withCredentials: true, timeout: 20000 }
      );

      toast.success(response.data?.message || "Password reset OTP sent to your email!");
      setView("reset-password"); // Switch to code & new password view
    } catch (err) {
      console.error("Forgot password request failed:", err.response?.data || err.message);
      const errorMsg =
        err.response?.data?.message || "Failed to send reset instructions. Please check the email.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // 3. Handle Forgot Password - Step 2: Submit OTP & New Password
  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();

    if (!otp.trim() || !newPassword || !confirmPassword) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${USER_API_END_POINT}/reset-password`,
        {
          email: forgotEmail.trim().toLowerCase(),
          otp: otp.trim(),
          newPassword: newPassword,
        },
        { withCredentials: true, timeout: 20000 }
      );

      toast.success(response.data?.message || "Password changed successfully! You can now log in.");

      // Reset back to login view after success
      setTimeout(() => {
        setView("login");
        setOtp("");
        setNewPassword("");
        setConfirmPassword("");
        setForgotEmail("");
      }, 1500);
    } catch (err) {
      console.error("Password reset failed:", err.response?.data || err.message);
      const errorMsg =
        err.response?.data?.message || "Failed to reset password. Please check your verification code.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-sans">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Clickable backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-all duration-300"
      />

      {/* TiffinBox modal container */}
      <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[2.5rem] border border-slate-100 bg-white p-6 shadow-2xl sm:p-10">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          aria-label="Close modal"
          className="absolute right-6 top-5 text-lg font-bold text-slate-400 transition hover:text-slate-600 disabled:opacity-50"
        >
          ✕
        </button>

        {/* ================= VIEW 1: LOGIN ================= */}
        {view === "login" && (
          <>
            <div className="mb-6">
              <h1 className="mb-1 flex items-center gap-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                <span>Welcome Back</span>
                <span>🍱</span>
              </h1>
              <p className="text-sm font-medium text-slate-400">
                Enter details to log into TiffinBox
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="flex flex-col">
                <label
                  htmlFor="login-email"
                  className="mb-1.5 text-xs font-bold uppercase tracking-wide text-slate-700"
                >
                  Email Address
                </label>
                <input
                  id="login-email"
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  disabled={loading}
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm transition-all focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-500/10 disabled:opacity-60"
                />
              </div>

              <div className="flex flex-col">
                <div className="mb-1.5 flex items-center justify-between">
                  <label
                    htmlFor="login-password"
                    className="text-xs font-bold uppercase tracking-wide text-slate-700"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(formData.email); // Pre-fill if user typed email
                      setView("forgot-request");
                      switchToForgotPassword?.();
                    }}
                    disabled={loading}
                    className="cursor-pointer border-none bg-transparent text-xs font-bold text-orange-500 hover:underline disabled:opacity-50"
                  >
                    Forgot Password?
                  </button>
                </div>
                <input
                  id="login-password"
                  type="password"
                  name="password"
                  required
                  autoComplete="current-password"
                  disabled={loading}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm transition-all focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-500/10 disabled:opacity-60"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full rounded-xl bg-orange-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/10 transition hover:bg-orange-600 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing In..." : "Secure Login 🔑"}
              </button>

              <p className="pt-2 text-center text-xs font-semibold text-slate-400 sm:text-sm">
                New to TiffinBox?{" "}
                <button
                  type="button"
                  onClick={switchToRegister}
                  disabled={loading}
                  className="cursor-pointer border-none bg-transparent p-0 font-extrabold text-orange-500 hover:underline disabled:opacity-50"
                >
                  Create Account
                </button>
              </p>
            </form>
          </>
        )}

        {/* ================= VIEW 2: FORGOT PASSWORD (REQUEST OTP) ================= */}
        {view === "forgot-request" && (
          <>
            <div className="mb-6">
              <h1 className="mb-1 flex items-center gap-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                <span>Reset Password</span>
                <span>🔒</span>
              </h1>
              <p className="text-sm font-medium text-slate-400">
                Enter your account email to receive a password reset verification code.
              </p>
            </div>

            <form onSubmit={handleForgotRequest} className="space-y-4">
              <div className="flex flex-col">
                <label
                  htmlFor="forgot-email"
                  className="mb-1.5 text-xs font-bold uppercase tracking-wide text-slate-700"
                >
                  Email Address
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  name="forgotEmail"
                  required
                  autoComplete="email"
                  disabled={loading}
                  placeholder="john@example.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm transition-all focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-500/10 disabled:opacity-60"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full rounded-xl bg-orange-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/10 transition hover:bg-orange-600 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Sending Code..." : "Send Verification Code 📨"}
              </button>

              <p className="pt-2 text-center text-xs font-semibold text-slate-400 sm:text-sm">
                Remembered your password?{" "}
                <button
                  type="button"
                  onClick={() => setView("login")}
                  disabled={loading}
                  className="cursor-pointer border-none bg-transparent p-0 font-extrabold text-orange-500 hover:underline disabled:opacity-50"
                >
                  Back to Login
                </button>
              </p>
            </form>
          </>
        )}

        {/* ================= VIEW 3: ENTER OTP & NEW PASSWORD ================= */}
        {view === "reset-password" && (
          <>
            <div className="mb-6">
              <h1 className="mb-1 flex items-center gap-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                <span>New Password</span>
                <span>🔑</span>
              </h1>
              <p className="text-sm font-medium text-slate-400">
                Enter the code sent to <span className="font-bold text-slate-700">{forgotEmail}</span> and choose your new password.
              </p>
            </div>

            <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
              <div className="flex flex-col">
                <label
                  htmlFor="otp-code"
                  className="mb-1.5 text-xs font-bold uppercase tracking-wide text-slate-700"
                >
                  Verification Code (OTP)
                </label>
                <input
                  id="otp-code"
                  type="text"
                  required
                  disabled={loading}
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm transition-all focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-500/10 disabled:opacity-60 font-mono tracking-widest"
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="new-password"
                  className="mb-1.5 text-xs font-bold uppercase tracking-wide text-slate-700"
                >
                  New Password
                </label>
                <input
                  id="new-password"
                  type="password"
                  required
                  disabled={loading}
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm transition-all focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-500/10 disabled:opacity-60"
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="confirm-password"
                  className="mb-1.5 text-xs font-bold uppercase tracking-wide text-slate-700"
                >
                  Confirm New Password
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  required
                  disabled={loading}
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm transition-all focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-500/10 disabled:opacity-60"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full rounded-xl bg-orange-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/10 transition hover:bg-orange-600 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Updating Password..." : "Change Password 🚀"}
              </button>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setView("forgot-request")}
                  disabled={loading}
                  className="cursor-pointer border-none bg-transparent text-xs font-bold text-slate-500 hover:underline disabled:opacity-50"
                >
                  ← Resend Code
                </button>
                <button
                  type="button"
                  onClick={() => setView("login")}
                  disabled={loading}
                  className="cursor-pointer border-none bg-transparent text-xs font-bold text-orange-500 hover:underline disabled:opacity-50"
                >
                  Back to Login
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}