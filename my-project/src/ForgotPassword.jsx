

import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { USER_API_END_POINT } from "./Utils/Api";

export default function ForgotPassword({
  isOpen,
  onClose,
  switchToLogin,
}) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Replace with your backend forgot password endpoint if different
      const response = await axios.post(
        `${USER_API_END_POINT}/forgot-password`,
        { email: email.trim().toLowerCase() },
        { timeout: 20000 }
      );

      toast.success(response.data.message || "Password reset link sent to your email!");
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error("Forgot password failed:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to send reset link. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-sans">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Backdrop blur overlay */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-all duration-300"
      />

      {/* Modal Card */}
      <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[2.5rem] border border-slate-100 bg-white p-6 shadow-2xl sm:p-10">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          aria-label="Close forgot password"
          className="absolute right-6 top-5 text-lg font-bold text-slate-400 transition hover:text-slate-600 disabled:opacity-50"
        >
          ✕
        </button>

        <div className="mb-6">
          <h1 className="mb-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Reset Password 🔐
          </h1>
          <p className="text-sm font-medium text-slate-400">
            Enter your email and we'll send you instructions to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
              name="email"
              required
              disabled={loading}
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm transition-all focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-500/10 disabled:opacity-60"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-xl bg-orange-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/10 transition hover:bg-orange-600 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Sending Link..." : "Send Reset Link"}
          </button>

          <p className="pt-2 text-center text-xs font-semibold text-slate-400 sm:text-sm">
            Remembered your password?{" "}
            <button
              type="button"
              onClick={switchToLogin}
              disabled={loading}
              className="cursor-pointer border-none bg-transparent p-0 font-extrabold text-orange-500 hover:underline disabled:opacity-50"
            >
              Back to Login
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}