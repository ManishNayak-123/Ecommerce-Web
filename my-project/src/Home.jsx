

import React, { useEffect, useRef, useState } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { useNavigate } from "react-router";
import SearchBar from "./SearchBar";
import AvailableFood from "./AvailableFoods";
import ServiceLocations from "./ServiceLocations";
import TiffinAdvantages from "./TiffinAdvantages";
import TiffinAppDownloadBanner from "./TiffinAppDownloadBanner";
import axios from "axios";
import { FOOD_API_END_POINT } from "./Utils/Api";

/* ------------------------------------------------------------------
   Stacked scroll cards (PhonePe style)
------------------------------------------------------------------- */
function StackedCards({ cards, onActionClick }) {
  const cardRefs = useRef([]);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    let ticking = false;

    const update = () => {
      const els = cardRefs.current.filter(Boolean);

      els.forEach((el, i) => {
        const next = els[i + 1];
        if (!next) return;

        const nextTop = next.getBoundingClientRect().top;
        const nextStickyTop = parseFloat(getComputedStyle(next).top) || 0;
        const distance = Math.max(nextTop - nextStickyTop, 0);

        const progress = Math.min(
          Math.max(1 - distance / (window.innerHeight * 0.7), 0),
          1
        );

        el.style.transform = `scale(${1 - progress * 0.06})`;
        el.style.filter = `brightness(${1 - progress * 0.1})`;
      });

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="space-y-12 pb-24">
      {cards.map((card, index) => (
        <div
          key={card.id}
          ref={(el) => (cardRefs.current[index] = el)}
          className={`sticky ${card.topOffset} ${card.zIndex} origin-top will-change-transform w-full bg-white ${card.bgGradient} rounded-t-[2.5rem] sm:rounded-t-[4rem] rounded-b-[2rem] border border-slate-200/80 shadow-2xl p-6 sm:p-10 md:p-14 overflow-hidden min-h-[420px] sm:min-h-[460px] flex flex-col justify-between`}
        >
          <div className="grid md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7 space-y-4 sm:space-y-6">
              <span className="inline-block px-3.5 py-1 bg-slate-900 text-white font-bold text-xs rounded-full uppercase tracking-widest shadow-sm">
                {card.badge}
              </span>

              <h3 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {card.title}
              </h3>

              <p className="text-sm sm:text-lg font-bold text-slate-700 leading-snug">
                {card.subtitle}
              </p>

              <p className="text-slate-500 text-xs sm:text-base leading-relaxed max-w-xl">
                {card.desc}
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onActionClick(card.actionType)}
                  className="inline-flex items-center gap-3 font-extrabold text-slate-900 text-base sm:text-lg hover:text-orange-600 transition group cursor-pointer"
                >
                  <span>{card.linkText}</span>
                  <span className="group-hover:translate-x-2 transition-transform duration-300 text-xl">
                    →
                  </span>
                </button>
              </div>
            </div>

            <div className="md:col-span-5 relative flex justify-center items-center">
              <div className="w-full h-56 sm:h-72 rounded-3xl overflow-hidden border border-slate-200/60 shadow-lg">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover hover:scale-105 transition duration-700"
                />
              </div>

              <div className="float-badge absolute bottom-4 right-4 sm:-bottom-4 sm:-right-4 bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-2xl border border-slate-100 flex items-center gap-4">
                <div>
                  <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    {card.statLabel}
                  </span>
                  <span className={`text-xl sm:text-3xl font-black ${card.statColor}`}>
                    {card.statValue}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-lg shadow-md">
                  ✓
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function TiffinHomePage() {
  const navigate = useNavigate();
  const availableFoodRef = useRef(null);
  const [meals, setMeals] = useState([]);

  // Search filter callback
  const handleSearchFilter = (searchTerm) => {
    if (searchTerm && searchTerm.trim()) {
      navigate(`/meals?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  // Card click actions
  const handleCardAction = (actionType) => {
    if (actionType === "track") {
      navigate("/product_track");
    } else {
      const phoneElem = document.getElementById("app-pricing-phone");
      if (phoneElem) {
        phoneElem.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const scrollToMealsSection = () => {
    navigate("/meals");
  };

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await axios.get(`${FOOD_API_END_POINT}/all`);
        const fetchedData =
          Array.isArray(response.data) ? response.data :
          Array.isArray(response.data?.foods) ? response.data.foods :
          Array.isArray(response.data?.meals) ? response.data.meals : [];
        setMeals(fetchedData);
      } catch (err) {
        console.error("Error fetching meals for search bar:", err);
      }
    };
    fetchMeals();
  }, []);

  const stackedCards = [
    {
      id: 1,
      title: "Customized Tiffin Subscriptions",
      subtitle: "Tailored for Students, Corporate Professionals & Families.",
      desc: "Choose your daily, weekly, or monthly meal plan. Easily skip meals or pause subscription anytime with 1-click controls.",
      linkText: "Explore Plans",
      actionType: "explore",
      bgGradient: "bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-white",
      topOffset: "top-20",
      zIndex: "z-10",
      badge: "Flexible Choices",
      statValue: "10k+",
      statLabel: "Active Plans",
      statColor: "text-orange-500",
      image: "Lunch.png",
    },
    {
      id: 2,
      title: "Instant UPI & Smart Payments",
      subtitle: "Seamless Checkout via PhonePe, GPay, Paytm & Cards.",
      desc: "Pay safely for your meals using your preferred UPI app or wallet. Get automated cashback rewards and daily order receipts.",
      linkText: "Payment Methods",
      actionType: "explore",
      bgGradient: "bg-gradient-to-br from-purple-500/10 via-indigo-500/5 to-white",
      topOffset: "top-28",
      zIndex: "z-20",
      badge: "100% Safe & Instant",
      statValue: "₹0",
      statLabel: "Hidden Fees",
      statColor: "text-purple-600",
      image: "scan.jpeg",
    },
    {
      id: 3,
      title: "Live GPS Tiffin Tracking",
      subtitle: "Fresh Warm Meals Delivered Directly to Your Doorstep.",
      desc: "Watch your delivery rider in real-time on our interactive map. Our insulated tiffin carriers ensure food reaches hot & fresh.",
      linkText: "Track Sample Order",
      actionType: "track",
      bgGradient: "bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-white",
      topOffset: "top-36",
      zIndex: "z-30",
      badge: "Express Delivery",
      statValue: "25 Min",
      statLabel: "Avg Delivery Time",
      statColor: "text-emerald-600",
      image: "https://images.unsplash.com/photo-1526367790999-0150786686a2?q=80&w=1000&auto=format&fit=crop",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-slate-100 text-gray-900 overflow-x-clip font-sans">
      <style>{`
        @keyframes floatBadge {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .float-badge { animation: floatBadge 3s ease-in-out infinite; }
        @keyframes bounceArrow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }
        .animate-bounce-arrow { animation: bounceArrow 1.5s infinite; }
        @media (prefers-reduced-motion: reduce) {
          .float-badge, .animate-bounce-arrow { animation: none; }
        }
      `}</style>

      {/* Navbar Wrapper */}
      <div className="absolute top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-screen w-full flex flex-col justify-center items-center text-center px-4 md:mt-[0] mt-[-3.5rem] sm:px-6 md:px-8 overflow-hidden py-24 lg:py-0">
        <div className="absolute top-0 left-0 w-full h-full z-0">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover">
            <source src="/videos/tiffin-loop.mp4" type="video/mp4" />
          </video>
          <div className="absolute top-0 left-0 w-full h-full bg-black/60 z-10" />
        </div>

        <div className="relative z-20 max-w-4xl w-full flex flex-col items-center pt-12 sm:pt-16">
          <div className="inline-block px-4 py-2 bg-orange-500/20 backdrop-blur-md border border-orange-500/30 rounded-full text-orange-400 text-xs sm:text-sm font-semibold mb-6">
            Fresh Homemade Food Delivered Daily
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight mb-4 text-white drop-shadow-md max-w-3xl">
            Healthy <span className="text-orange-500">Tiffin</span> Delivered To Your Doorstep
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-200 leading-relaxed mb-8 max-w-2xl drop-shadow">
            Enjoy fresh homemade meals with flexible subscription plans, lightning fast delivery, and healthy ingredients prepared daily.
          </p>

          <div className="w-full">
            <SearchBar products={meals} onSearch={handleSearchFilter} />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 md:gap-16 mt-12 text-white px-2">
            <div className="text-center sm:text-left">
              <h2 className="text-2xl sm:text-3xl font-black">10K+</h2>
              <p className="text-gray-300 text-xs sm:text-sm">Happy Customers</p>
            </div>
            <div className="hidden sm:block border-l border-white/20 h-8" />
            <div className="text-center sm:text-left">
              <h2 className="text-2xl sm:text-3xl font-black">500+</h2>
              <p className="text-gray-300 text-xs sm:text-sm">Daily Orders</p>
            </div>
            <div className="hidden sm:block border-l border-white/20 h-8" />
            <div className="text-center sm:text-left">
              <h2 className="text-2xl sm:text-3xl font-black">4.9★</h2>
              <p className="text-gray-300 text-xs sm:text-sm">Customer Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section>
        <TiffinAdvantages />
      </section>

      <section className="relative px-3 sm:px-6 lg:px-12 py-12 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <span className="px-4 py-1.5 bg-orange-100 text-orange-600 border border-orange-200 text-xs font-bold rounded-full uppercase tracking-wider">
            OUR SOLUTIONS 🛡️
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mt-3 text-slate-900 tracking-tight">
            How We Serve Your Daily Meals
          </h2>
          <p className="text-slate-500 text-sm sm:text-base mt-2">
            Scroll down to see our stacked service workflow.
          </p>
        </div>

        <StackedCards cards={stackedCards} onActionClick={handleCardAction} />
      </section>

      <div id="available-foods-section" ref={availableFoodRef}>
        <AvailableFood />
      </div>

      {/* --- TESTIMONIALS SECTION --- */}
      <section className="px-4 sm:px-8 lg:px-20 py-16 md:py-20 bg-white max-w-7xl mx-auto rounded-[3rem] my-8 shadow-sm">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 text-slate-900">
            What Customers Say
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600">
            Trusted by thousands of happy customers.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="bg-orange-50/60 p-6 sm:p-8 rounded-[2rem] border border-orange-100 flex flex-col justify-between"
            >
              <div>
                <div className="text-xl sm:text-2xl mb-4 tracking-tight text-orange-400">
                  ⭐⭐⭐⭐⭐
                </div>
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-6">
                  Amazing homemade taste and very affordable pricing. Delivery is always on time and food quality is excellent.
                </p>
              </div>

              <div className="flex items-center gap-4 mt-auto">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-orange-200 shrink-0" />
                <div>
                  <h4 className="font-bold text-base sm:text-lg text-gray-900">
                    Rahul Sharma
                  </h4>
                  <p className="text-gray-500 text-xs sm:text-sm">Delhi</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- PHONE APP DOWNLOAD BANNER COMPONENT --- */}
      <TiffinAppDownloadBanner onScrollToMeals={scrollToMealsSection} />

      {/* --- SERVICE LOCATIONS 3D GLOBE SECTION --- */}
      <section>
        <ServiceLocations />
      </section>

      <Footer />
    </div>
  );
}