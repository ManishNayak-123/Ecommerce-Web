

import React, { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { CONTACT_API_END_POINT } from "./Utils/Api";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    message: "",
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      // Connect to your Express backend endpoint
      const response = await fetch(`${CONTACT_API_END_POINT}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit your message. Please try again.");
      }

      // Trigger success state and clear form fields
      setSubmitted(true);
      setFormData({ 
        name: "", 
        email: "", 
        phone: "", 
        subject: "General Inquiry", 
        message: "" 
      });

      // Hide success banner after 4 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 4000);

    } catch (error) {
      console.error("Contact Submission Error:", error);
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-orange-50 text-slate-900 pt-24 flex flex-col justify-between font-sans">
      <Navbar />

      <main className="max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex-grow">
        
        {/* HEADER HERO AREA */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-block px-4 py-1.5 bg-orange-100 rounded-full text-orange-600 text-xs font-bold uppercase tracking-wider mb-3">
            Contact Our Team
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-800 tracking-tight">
            We'd Love To Hear From You
          </h1>
          <p className="text-slate-500 text-sm sm:text-base mt-3 leading-relaxed">
            Have questions about our meals, corporate subscriptions, or delivery zones? Drop us a line and our kitchen support staff will get back to you immediately.
          </p>
        </div>

        {/* TWO COLUMN CONTENT ROW */}
        <div className="grid lg:grid-cols-5 gap-8 items-start">
          
          {/* LEFT PANEL: DIRECT CONTACT META DATA (2 Columns wide) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-[2rem] p-6 sm:p-8 shadow-xl relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <h2 className="text-xl sm:text-2xl font-black mb-6 tracking-tight">
                Contact Information
              </h2>

              <div className="space-y-6">
                {/* Phone Block */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-lg shadow-inner shrink-0">
                    📞
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">Call Us</span>
                    <a href="tel:+919876543210" className="text-sm sm:text-base font-bold hover:text-orange-400 transition block mt-0.5">
                      +91 8273235248
                    </a>
                    <span className="text-[11px] text-slate-400 block mt-0.5">Mon-Sun: 7:00 AM - 10:00 PM</span>
                  </div>
                </div>

                {/* Email Block */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-lg shadow-inner shrink-0">
                    ✉️
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">Email Support</span>
                    <a href="mailto:support@tiffinbox.com" className="text-sm sm:text-base font-bold hover:text-orange-400 transition block mt-0.5">
                      support@tiffinbox.com
                    </a>
                    <span className="text-[11px] text-slate-400 block mt-0.5">Response within 2 hours</span>
                  </div>
                </div>

                {/* Office Address Block */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-lg shadow-inner shrink-0">
                    📍
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">Our Kitchen Headquarters</span>
                    <p className="text-sm text-slate-200 font-medium leading-relaxed mt-1">
                      Begrajput muzaffarnagar Uttarpradesh 251301
                    </p>
                  </div>
                </div>
              </div>

              {/* Decorative Brand Tag */}
              <div className="mt-12 pt-6 border-t border-white/10 flex items-center gap-2">
                <span className="text-2xl font-black tracking-wide text-white">
                  Tiffin<span className="text-orange-500">Box</span>
                </span>
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse mt-2"></span>
                <span className="text-xs font-bold text-slate-400 mt-2">Kitchens Active Now</span>
              </div>
            </div>

            {/* QUICK FAQ MINI-WIDGET */}
            <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm">
              <h3 className="font-extrabold text-slate-800 text-sm mb-3 uppercase tracking-wider">Looking to Pause or Cancel?</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                You can pause or update your delivery plans instantly directly inside your dashboard window or account tracking page without reaching support.
              </p>
            </div>
          </div>

          {/* RIGHT PANEL: INTERACTIVE MESSAGING FORM (3 Columns wide) */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-[2rem] border border-slate-100 p-6 sm:p-8 lg:p-10 shadow-sm relative">
              
              {/* Success Notification Alert overlay message */}
              {submitted && (
                <div className="absolute inset-4 bg-white/95 backdrop-blur-sm z-20 flex flex-col items-center justify-center text-center p-6 rounded-2xl animate-fade-in">
                  <span className="text-5xl block mb-3 animate-bounce">🚀</span>
                  <h3 className="text-xl font-black text-slate-800">Message Sent Successfully!</h3>
                  <p className="text-sm text-slate-500 mt-2 max-w-sm leading-relaxed">
                    Thank you for reaching out. A representative from the TiffinBox kitchen operations team will reach your inbox shortly.
                  </p>
                </div>
              )}

              <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight mb-2">
                Send Us A Message
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm font-medium mb-6">
                Fill out the secure fields below and we'll process your request.
              </p>

              {/* Backend Error Notification Banner */}
              {errorMessage && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 text-xs font-bold rounded-xl flex items-center justify-between">
                  <span>{errorMessage}</span>
                  <button onClick={() => setErrorMessage("")} className="text-red-400 hover:text-red-700 font-black ml-2">✕</button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name & Email Input Group */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5">Full Name</label>
                    <input 
                      type="text" 
                      name="name" 
                      required 
                      placeholder="John Doe" 
                      value={formData.name}
                      onChange={handleChange} 
                      className="px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50/50 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-medium text-slate-800" 
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5">Email Address</label>
                    <input 
                      type="email" 
                      name="email" 
                      required 
                      placeholder="john@example.com" 
                      value={formData.email}
                      onChange={handleChange} 
                      className="px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50/50 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-medium text-slate-800" 
                    />
                  </div>
                </div>

                {/* Phone & Subject Input Group */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5">Phone Number (Optional)</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      placeholder="+91 XXXXX XXXXX" 
                      value={formData.phone}
                      onChange={handleChange} 
                      className="px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50/50 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-medium text-slate-800" 
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5">Subject Type</label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50/50 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-bold text-slate-700"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Subscription Issue">Subscription Issue</option>
                      <option value="Delivery Delay">Delivery Delay</option>
                      <option value="Corporate Catering">Corporate Catering / Bulk</option>
                    </select>
                  </div>
                </div>

                {/* Text Message Field */}
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5">Your Message</label>
                  <textarea 
                    name="message" 
                    required 
                    rows="5"
                    placeholder="Write details of your inquiry here..." 
                    value={formData.message}
                    onChange={handleChange} 
                    className="px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50/50 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-medium text-slate-800 resize-none" 
                  />
                </div>

                {/* Submit Action Button */}
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-orange-500 hover:bg-orange-600 active:scale-[0.99] disabled:bg-orange-300 text-white font-extrabold py-3.5 rounded-xl shadow-lg shadow-orange-500/20 transition duration-200 mt-2 text-center text-sm flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Sending Inquiry...
                    </>
                  ) : (
                    "Send Inquiry Message ✉️"
                  )}
                </button>
              </form>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}