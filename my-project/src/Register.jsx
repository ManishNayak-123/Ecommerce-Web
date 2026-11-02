
import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import toast, { Toaster } from "react-hot-toast";
import { USER_API_END_POINT } from "./Utils/Api";

const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

export default function Register({
  isOpen,
  onClose,
  switchToLogin,
}) {
  const captchaRef = useRef(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [captchaToken, setCaptchaToken] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("signup");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  
  const [timeLeft, setTimeLeft] = useState(300);

  useEffect(() => {
    let timer;
    if (step === "otp" && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, timeLeft]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const resetCaptcha = () => {
    setCaptchaToken("");
    captchaRef.current?.reset();
  };

  const resetFormState = () => {
    setFormData({ fullName: "", email: "", password: "" });
    setProfileImage(null);
    setImagePreview(null);
    setCaptchaToken("");
    setOtp("");
    setStep("signup");
    setError("");
    setMessage("");
    setTimeLeft(300);
    captchaRef.current?.reset();
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // STEP 1: SIGNUP
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const nameToSubmit = formData.fullName.trim();
    const emailToSubmit = formData.email.trim().toLowerCase();

    if (!nameToSubmit || nameToSubmit.length < 2) {
      const nameError = "Please enter your full name.";
      setError(nameError);
      toast.error(nameError);
      return;
    }

    if (!captchaToken) {
      setError("Please complete the CAPTCHA.");
      toast.error("Please complete the CAPTCHA.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      toast.error("Password must contain at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      let requestData;
      let headers = {};

      if (profileImage) {
        const data = new FormData();
        data.append("fullName", nameToSubmit);
        data.append("name", nameToSubmit);
        data.append("email", emailToSubmit);
        data.append("password", formData.password);
        data.append("captchaToken", captchaToken);
        data.append("profilePicture", profileImage);

        requestData = data;
        headers = { "Content-Type": "multipart/form-data" };
      } else {
        requestData = {
          fullName: nameToSubmit,
          name: nameToSubmit,
          email: emailToSubmit,
          password: formData.password,
          captchaToken,
        };
        headers = { "Content-Type": "application/json" };
      }

      const response = await axios.post(
        `${USER_API_END_POINT}/signup`,
        requestData,
        { 
          headers,
          timeout: 20000 
        }
      );

      setStep("otp");
      setOtp("");
      setTimeLeft(300);
      const successMsg = response.data.message || "OTP sent successfully. Check your email.";
      setMessage(successMsg);
      toast.success(successMsg);
    } catch (err) {
      console.error(
        "Signup request failed:",
        err.response?.data || err.message
      );

      const errorMsg =
        err.response?.data?.message ||
        (err.code === "ECONNABORTED"
          ? "Request timed out. Check your backend and email service."
          : "Unable to connect to the backend. Check the API URL and server.");

      setError(errorMsg);
      toast.error(errorMsg);
      resetCaptcha();
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: VERIFY OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!/^\d{6}$/.test(otp)) {
      setError("Enter the 6-digit OTP from your email.");
      toast.error("Enter the 6-digit OTP from your email.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${USER_API_END_POINT}/verify-otp`,
        {
          email: formData.email.trim().toLowerCase(),
          otp,
        },
        { timeout: 20000 }
      );

      // Extract user data and token from backend response
      const userData = response.data.user || response.data.data || response.data;
      const token = response.data.token || response.data.accessToken;

      if (userData) {
        localStorage.setItem("user", JSON.stringify(userData));
      }
      if (token) {
        localStorage.setItem("token", token);
      }

      // Notify the Navbar (and other components) that user state has updated
      window.dispatchEvent(new Event("storage"));

      setStep("success");
      const successMsg = response.data.message || "Your account has been created successfully!";
      setMessage(successMsg);
      toast.success(successMsg);
    } catch (err) {
      console.error(
        "OTP verification failed:",
        err.response?.data || err.message
      );

      const errorMsg =
        err.response?.data?.message ||
        "Unable to verify OTP. Check your backend connection.";

      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    onClose();
    setTimeout(resetFormState, 300);
  };

  const handleSwitchToLogin = () => {
    if (loading) return;
    onClose();
    switchToLogin?.();
    setTimeout(resetFormState, 300);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-sans">
      <Toaster position="top-center" reverseOrder={false} />

      <div
        onClick={handleClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
      />

      <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[2rem] border border-slate-100 bg-white p-6 shadow-2xl sm:p-10">
        <button
          type="button"
          onClick={handleClose}
          disabled={loading}
          aria-label="Close registration"
          className="absolute right-6 top-5 text-lg font-bold text-slate-400 hover:text-slate-600"
        >
          ✕
        </button>

        <div className="mb-6 pr-6">
          <h1 className="mb-1 text-2xl font-black text-slate-900 sm:text-3xl">
            {step === "signup" && "Create Account"}
            {step === "otp" && "Verify Your Email"}
            {step === "success" && "You're All Set!"}
          </h1>

          <p className="text-sm text-slate-500">
            {step === "signup" &&
              "Create your account to get started."}
            {step === "otp" &&
              `Enter the OTP sent to ${formData.email}.`}
            {step === "success" &&
              "Your email has been verified and your account is ready."}
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {message && (
          <div
            role="status"
            className="mb-4 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700"
          >
            {message}
          </div>
        )}

        {step === "signup" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Profile Image Picker */}
            <div className="flex flex-col items-center mb-4">
              <label className="relative cursor-pointer group">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-dashed border-orange-400 bg-slate-50 flex items-center justify-center shadow-inner hover:border-orange-500 transition">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-2">
                      <span className="text-2xl">📷</span>
                      <p className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">Upload</p>
                    </div>
                  )}
                </div>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange} 
                  className="hidden" 
                />
              </label>
              <span className="text-xs font-semibold text-slate-500 mt-1.5">Profile Picture (Optional)</span>
            </div>

            <div>
              <label
                htmlFor="fullName"
                className="mb-1 block text-xs font-bold uppercase text-slate-700"
              >
                Full Name
              </label>

              <input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                required
                minLength={2}
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-xs font-bold uppercase text-slate-700"
              >
                Email Address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-xs font-bold uppercase text-slate-700"
              >
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 8 characters"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div className="overflow-x-auto py-2">
              {SITE_KEY ? (
                <ReCAPTCHA
                  ref={captchaRef}
                  sitekey={SITE_KEY}
                  onChange={(token) =>
                    setCaptchaToken(token || "")
                  }
                  onExpired={() => setCaptchaToken("")}
                  onErrored={() => {
                    setCaptchaToken("");
                    setError("CAPTCHA failed to load.");
                    toast.error("CAPTCHA failed to load.");
                  }}
                />
              ) : (
                <p className="text-sm text-red-600">
                  Missing VITE_RECAPTCHA_SITE_KEY in frontend .env.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !SITE_KEY}
              className="w-full rounded-xl bg-orange-500 py-3.5 font-bold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating Account..." : "Sign Up & Get OTP"}
            </button>

            <p className="text-center text-sm text-slate-500">
              Already have an account?{" "}
              <button
                type="button"
                onClick={handleSwitchToLogin}
                disabled={loading}
                className="font-bold text-orange-500 hover:underline"
              >
                Sign In
              </button>
            </p>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="otp"
                  className="text-xs font-bold uppercase text-slate-700"
                >
                  Six-Digit OTP
                </label>
                <span className={`text-xs font-semibold ${timeLeft === 0 ? "text-red-500" : "text-orange-500"}`}>
                  {timeLeft > 0 ? `Expires in ${formatTime(timeLeft)}` : "OTP Expired"}
                </span>
              </div>

              <input
                id="otp"
                name="otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                required
                value={otp}
                onChange={(e) =>
                  setOtp(
                    e.target.value.replace(/\D/g, "").slice(0, 6)
                  )
                }
                placeholder="000000"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-center text-2xl font-bold tracking-[0.5em] focus:border-orange-500 focus:outline-none"
              />

              <p className="mt-2 text-xs text-slate-500">
                Check your inbox and spam folder.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6 || timeLeft === 0}
              className="w-full rounded-xl bg-orange-500 py-3.5 font-bold text-white hover:bg-orange-600 disabled:opacity-60"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => {
                setStep("signup");
                setError("");
                setMessage("");
                resetCaptcha();
              }}
              className="w-full py-2 text-sm font-semibold text-slate-500"
            >
              Back to signup
            </button>
          </form>
        )}

        {step === "success" && (
          <button
            type="button"
            onClick={handleSwitchToLogin}
            className="w-full rounded-xl bg-orange-500 py-3.5 font-bold text-white hover:bg-orange-600"
          >
            Sign In Now
          </button>
        )}
      </div>
    </div>
  );
}