

import React, { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import Footer from "../Footer";
import toast from "react-hot-toast";
import DriverNavbar from "./DriverNavbar";
import { DRIVER_API_END_POINT } from "../Utils/Api";

// Automatically derive base URL from your existing API endpoint configuration
// const API_BASE_URL = FOOD_API_END_POINT.replace(/\/api\/v1\/.*$/, "").replace(/\/+$/, "");

export default function DriverHome() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    city: "Delhi NCR",
    vehicleType: "Bike",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone) {
      toast.error("Please fill out all required fields!");
      return;
    }

    try {
      setLoading(true);
      // Send driver application data to the backend database
      const response = await axios.post(`${DRIVER_API_END_POINT}/register`, formData);

      if (response.data.success) {
        toast.success("Application submitted successfully! Saved to admin records.");
        
        // Save driver session locally so navbar & dashboard recognize them
        localStorage.setItem("driverUser", JSON.stringify(response.data.driver));

        setTimeout(() => {
          navigate("/driver/dashboard");
        }, 1500);
      }
    } catch (error) {
      console.error("Driver application error:", error);
      toast.error(error.response?.data?.message || "Failed to submit application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans flex flex-col justify-between">
      <div>
        <DriverNavbar />

        {/* --- HERO SECTION --- */}
        <section className="py-20 px-4 sm:px-6 lg:px-16 max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <span className="inline-block px-4 py-1.5 bg-orange-500/20 text-orange-400 border border-orange-500/30 font-extrabold text-xs rounded-full uppercase tracking-widest">
              🚴 Become a TiffinBox Delivery Partner
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
              Earn up to <span className="text-orange-500">₹25,000/month</span> delivering fresh tiffins.
            </h1>

            <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Enjoy flexible working hours, daily payout options, dynamic GPS routing, and attractive referral bonuses delivering homemade meals in your city.
            </p>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-4 pt-4 max-w-lg mx-auto lg:mx-0">
              <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/80 text-center">
                <p className="text-xl sm:text-2xl font-black text-orange-400">₹30-₹60</p>
                <p className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase mt-0.5">Per Order</p>
              </div>
              <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/80 text-center">
                <p className="text-xl sm:text-2xl font-black text-emerald-400">Daily</p>
                <p className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase mt-0.5">Payouts</p>
              </div>
              <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/80 text-center">
                <p className="text-xl sm:text-2xl font-black text-amber-400">Flexi</p>
                <p className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase mt-0.5">Shifts</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                type="button"
                onClick={() => navigate("/driver/dashboard")}
                className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-extrabold px-8 py-4 rounded-2xl text-sm tracking-wide shadow-xl shadow-orange-500/20 transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Go to Active Driver Dashboard</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Right Column: Driver Application Card */}
          <div className="lg:col-span-5 bg-slate-800 border border-slate-700 p-6 sm:p-8 rounded-3xl shadow-2xl">
            <h3 className="text-xl font-black text-white mb-1">Apply to Join as a Partner 📝</h3>
            <p className="text-xs text-slate-400 mb-6">Fill out your details to register and notify the admin dashboard.</p>

            <form onSubmit={handleRegister} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Ramesh Kumar"
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Phone Number (WhatsApp) *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">City</label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-3 text-xs text-white focus:outline-none focus:border-orange-500 transition"
                  >
                    <option value="Delhi NCR">Delhi NCR</option>
                    <option value="Noida">Noida</option>
                    <option value="Gurugram">Gurugram</option>
                    <option value="Bengaluru">Bengaluru</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Vehicle Type</label>
                  <select
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-3 text-xs text-white focus:outline-none focus:border-orange-500 transition"
                  >
                    <option value="Bike">Motorcycle / Scooter</option>
                    <option value="EV Scooter">EV Scooter</option>
                    <option value="Bicycle">Bicycle</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold py-3.5 rounded-xl text-xs tracking-wider uppercase transition shadow-lg shadow-emerald-600/20 cursor-pointer mt-2 disabled:opacity-50"
              >
                {loading ? "Submitting Application..." : "Submit Application"}
              </button>
            </form>
          </div>
        </section>

        {/* --- BENEFITS SECTION --- */}
        <section className="py-16 px-4 sm:px-6 lg:px-16 max-w-7xl mx-auto border-t border-slate-800">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-orange-400 uppercase tracking-widest">
              WHY RIDE WITH US 🛵
            </span>
            <h2 className="text-2xl sm:text-4xl font-black mt-2">
              Best Perks in Tiffin Delivery
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/80">
              <div className="text-3xl mb-3">💰</div>
              <h3 className="text-lg font-bold mb-1">Weekly & Daily Payouts</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Receive earnings directly in your bank account or UPI app with zero hidden deductions.
              </p>
            </div>

            <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/80">
              <div className="text-3xl mb-3">📍</div>
              <h3 className="text-lg font-bold mb-1">Smart GPS Navigation</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Live interactive maps calculate the fastest routes to customer doorsteps to save fuel.
              </p>
            </div>

            <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/80">
              <div className="text-3xl mb-3">🛡️</div>
              <h3 className="text-lg font-bold mb-1">Free Medical Cover</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Accidental insurance coverage provided for all active delivery partners on shift.
              </p>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}