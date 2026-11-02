

import React from "react";
import { Link } from "react-router"; // Adjust to 'react-router-dom' if needed
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function AboutUs() {
  const stats = [
    { value: "30+", label: "Active Users" },
    { value: "8+", label: "Dedicated Employees" },
    { value: "2022", label: "Established in Noida, UP" },
    { value: "4.9★", label: "Average Customer Rating" },
  ];

  const coreValues = [
    {
      icon: "👩‍🍳",
      title: "Homemade with Love",
      desc: "Our meals are prepared by expert home-chefs using traditional, generational recipes. No commercial pastes, no artificial additives.",
    },
    {
      icon: "🌱",
      title: "Sourced Locally & Freshly",
      desc: "Every vegetable, grain, and spice is handpicked daily from local farmers to guarantee absolute nutritional value and freshness.",
    },
    {
      icon: "🍱",
      title: "Eco-Friendly Packaging",
      desc: "We prioritize sustainability. Our meals travel in premium, insulated, food-grade safe tiffin boxes that keep your food piping hot.",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-orange-50 text-slate-900 pt-24 flex flex-col justify-between font-sans">
      <Navbar />

      <main className="w-full mx-auto flex-grow">
        
        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 text-center">
          <div className="inline-block px-4 py-1.5 bg-orange-100 rounded-full text-orange-600 text-xs font-bold uppercase tracking-wider mb-4">
            Our Story
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-800 tracking-tight max-w-3xl mx-auto leading-tight">
            Bringing Back The Taste Of <span className="text-orange-500">Home</span>
          </h1>
          <p className="text-slate-500 text-base sm:text-lg mt-6 max-w-2xl mx-auto leading-relaxed">
            TiffinBox was born out of a simple craving: the longing for genuine, nutritious, home-cooked food in a world dominated by fast food and commercial cloud kitchens.
          </p>
        </section>

        {/* HEADQUARTERS & COMPANY INFO SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 sm:p-10 shadow-sm grid md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-orange-500">Corporate Footprint</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight mt-1 mb-4">
               Begrajpur muzaffarnagar, UP
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-4">
                Founded in <strong className="text-slate-800">2022</strong>, TiffinBox has scaled rapidly into a dynamic mid-scale food-tech enterprise. Operating out of our main headquarters in <strong className="text-slate-800">Begrajpur Muzaffarnagar UP</strong>, we coordinate our culinary standards, local logistics, and tech infrastructure.
              </p>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Our growing team of <strong className="text-slate-800">8+ full-time employees</strong>—spanning software engineering, culinary arts, and logistics operations—works day and night to serve a community of over <strong className="text-slate-800">30+ active users</strong>.
              </p>
            </div>
            <div className="bg-orange-50/60 border border-orange-100/80 rounded-2xl p-6 sm:p-8 space-y-4">
              <h3 className="text-lg font-extrabold text-slate-800">Company At a Glance</h3>
              <ul className="space-y-3 text-sm text-slate-700">
                <li className="flex justify-between border-b border-orange-100/60 pb-2">
                  <span className="font-semibold text-slate-500">Headquarters</span>
                  <span className="font-bold text-slate-900">Begrajpur Muzaffarnagar India</span>
                </li>
                <li className="flex justify-between border-b border-orange-100/60 pb-2">
                  <span className="font-semibold text-slate-500">Established</span>
                  <span className="font-bold text-slate-900">2022</span>
                </li>
                <li className="flex justify-between border-b border-orange-100/60 pb-2">
                  <span className="font-semibold text-slate-500">Company Size</span>
                  <span className="font-bold text-slate-900">8+ Employees</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-semibold text-slate-500">Active Users</span>
                  <span className="font-bold text-slate-900">30+ Customers</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* MISSION & IMAGE SPLIT SECTION */}
        <section className="bg-white border-y border-slate-100 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
            
            {/* Visual Graphic Element */}
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl aspect-[4/3] bg-slate-100 border border-slate-100">
              <img 
                src="https://images.unsplash.com/photo-1543339308-43e59d6b73a6?q=80&w=1200&auto=format&fit=crop" 
                alt="Fresh home-cooked Indian meal spread" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <p className="text-xs font-bold uppercase tracking-wider text-orange-400">Pure Ingredients</p>
                <h3 className="text-lg font-black mt-0.5">Cooked Daily at 4:00 AM</h3>
              </div>
            </div>

            {/* Mission Statement Copy */}
            <div className="space-y-6">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
                Our Mission: Healthy, Consistent, & Affordable Eating
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                We realize how difficult it is to balance a busy work life, college schedules, or corporate routines with clean eating habits. Relying on restaurant delivery apps leads to health fatigue and heavy expenses.
              </p>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                TiffinBox bridges that gap. We curate meal subscription models that sync directly with your daily life—delivering robust, healthy meals packed dynamically with macro-balanced items right to your desk or doorstep.
              </p>
              <div className="pt-4">
                <Link 
                  to="/meals" 
                  className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-md shadow-slate-900/10"
                >
                  View Our Menu 🍽️
                </Link>
              </div>
            </div>

          </div>
        </section>

        {/* METRICS STATS COUNTER BAR */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm text-center">
                <span className="block text-3xl sm:text-4xl font-black text-orange-500 tracking-tight">
                  {stat.value}
                </span>
                <span className="block text-xs sm:text-sm font-bold text-slate-400 mt-1">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* CORE VALUES / WHY US FEATURE CARDS */}
        <section className="bg-slate-900 text-white py-16 sm:py-20 relative overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                What Makes TiffinBox Special?
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-2 font-medium">
                We maintain strict quality control checklists across every batch.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {coreValues.map((value, i) => (
                <div 
                  key={i} 
                  className="bg-white/5 border border-white/10 rounded-[2rem] p-6 sm:p-8 hover:bg-white/10 transition-colors duration-200"
                >
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl shadow-inner mb-6">
                    {value.icon}
                  </div>
                  <h3 className="text-lg font-extrabold text-white tracking-wide mb-2">
                    {value.title}
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-medium">
                    {value.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CLOSING CALL TO ACTION CALLOUT */}
        <section className="max-w-4xl mx-auto px-4 text-center py-16 sm:py-24">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
            Ready to Upgrade Your Lunch Break?
          </h2>
          <p className="text-slate-500 text-sm mt-3 max-w-md mx-auto leading-relaxed font-medium">
            Join thousands of professionals and students who trust us for their daily nutrition.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link 
              to="/subscription" 
              className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white font-extrabold px-8 py-3.5 rounded-2xl shadow-lg shadow-orange-500/20 transition text-sm"
            >
              Explore Subscription Plans
            </Link>
            <Link 
              to="/contact_us" 
              className="w-full sm:w-auto bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold px-8 py-3.5 rounded-2xl transition text-sm shadow-sm"
            >
              Talk to Our Team
            </Link>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}