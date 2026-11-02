import React from "react";

export default function TiffinAdvantages() {
  // Row 1 Advantages
  const row1 = [
    { title: "Home Style Cooking", icon: "🍲", bg: "bg-orange-100", text: "text-orange-600" },
    { title: "Zero Delivery Fees", icon: "🚚", bg: "bg-green-100", text: "text-green-600" },
    { title: "100% Organic Spices", icon: "🌿", bg: "bg-emerald-100", text: "text-emerald-600" },
    { title: "Flexible Meal Plans", icon: "📅", bg: "bg-purple-100", text: "text-purple-600" },
    { title: "Hot Insulated Packaging", icon: "🔥", bg: "bg-rose-100", text: "text-rose-600" },
    { title: "Hygienic Cloud Kitchens", icon: "✨", bg: "bg-sky-100", text: "text-sky-600" },
  ];

  // Row 2 Advantages
  const row2 = [
    { title: "Instant UPI & Cashbacks", icon: "💳", bg: "bg-indigo-100", text: "text-indigo-600" },
    { title: "1-Click Pause & Resume", icon: "⏸️", bg: "bg-amber-100", text: "text-amber-600" },
    { title: "Customizable Portion Sizes", icon: "🥗", bg: "bg-teal-100", text: "text-teal-600" },
    { title: "Verified Home Chefs", icon: "👩‍🍳", bg: "bg-pink-100", text: "text-pink-600" },
    { title: "Live Order Tracking", icon: "📍", bg: "bg-red-100", text: "text-red-600" },
    { title: "24/7 Priority Support", icon: "🎧", bg: "bg-blue-100", text: "text-blue-600" },
  ];

  // Row 3 Advantages
  const row3 = [
    { title: "No Minimum Order", icon: "🍽️", bg: "bg-yellow-100", text: "text-yellow-600" },
    { title: "Daily Calorie Count", icon: "📊", bg: "bg-violet-100", text: "text-violet-600" },
    { title: "Student Discount Offers", icon: "🎓", bg: "bg-cyan-100", text: "text-cyan-600" },
    { title: "Corporate Bulk Orders", icon: "💼", bg: "bg-stone-100", text: "text-stone-600" },
    { title: "Eco-Friendly Containers", icon: "🌱", bg: "bg-lime-100", text: "text-lime-600" },
    { title: "Fresh Ingredients Daily", icon: "🍎", bg: "bg-orange-100", text: "text-orange-600" },
  ];

  // Helper to render decorative PhonePe style geometry shapes
  const DecorativeShapes = () => (
    <div className="flex items-center gap-2 px-3 shrink-0">
      <span className="w-5 h-5 rounded-full bg-purple-200 inline-block" />
      <span className="w-5 h-5 bg-pink-300 rounded-r-full inline-block" />
      <span className="w-5 h-5 bg-rose-300 rounded-r-full inline-block" />
      <span className="w-4 h-4 bg-teal-300 rotate-45 inline-block" />
    </div>
  );

  // Helper to render individual pill item
  const RenderPill = ({ item }) => (
    <div className="flex items-center gap-4 bg-white border border-slate-300 hover:border-orange-500 rounded-full px-6 py-3.5 shadow-sm hover:shadow-md transition-all duration-300 shrink-0 cursor-pointer group">
      <div className={`w-12 h-12 rounded-full ${item.bg} flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform`}>
        {item.icon}
      </div>
      <span className="text-slate-800 font-extrabold text-sm sm:text-base whitespace-nowrap">
        {item.title}
      </span>
    </div>
  );

  return (
    <section className="py-20 bg-slate-50 overflow-hidden w-full">
      {/* HEADER TITLE */}
      <div className="text-center max-w-2xl mx-auto px-4 mb-14">
        <span className="px-4 py-1.5 bg-orange-100 text-orange-600 font-bold text-xs rounded-full uppercase tracking-widest border border-orange-200">
          Why Choose Us 🌟
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mt-3">
          Designed for Your Everyday Convenience
        </h2>
        <p className="text-slate-500 text-sm sm:text-base font-medium mt-2">
          Experience the ultimate home food delivery service backed by smart features.
        </p>
      </div>

      {/* MARQUEE CONTAINER */}
      <div className="space-y-6">
        
        {/* ROW 1: LEFT TO RIGHT */}
        <div className="flex overflow-hidden select-none group">
          <div className="flex items-center gap-4 animate-marquee-left group-hover:[animation-play-state:paused]">
            {[...row1, ...row1, ...row1].map((item, idx) => (
              <React.Fragment key={idx}>
                <RenderPill item={item} />
                <DecorativeShapes />
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* ROW 2: RIGHT TO LEFT */}
        <div className="flex overflow-hidden select-none group">
          <div className="flex items-center gap-4 animate-marquee-right group-hover:[animation-play-state:paused]">
            {[...row2, ...row2, ...row2].map((item, idx) => (
              <React.Fragment key={idx}>
                <RenderPill item={item} />
                <DecorativeShapes />
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* ROW 3: LEFT TO RIGHT */}
        <div className="flex overflow-hidden select-none group">
          <div className="flex items-center gap-4 animate-marquee-left group-hover:[animation-play-state:paused]">
            {[...row3, ...row3, ...row3].map((item, idx) => (
              <React.Fragment key={idx}>
                <RenderPill item={item} />
                <DecorativeShapes />
              </React.Fragment>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}