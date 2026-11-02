

import React, { useEffect, useRef, useState } from "react";

export default function AvailableFood() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // Dishes dataset
  const dishes = [
    { id: 1, name: "Kachori", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=600&auto=format&fit=crop" },
    { id: 2, name: "Cake", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=600&auto=format&fit=crop" },
    { id: 3, name: "Paratha", image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?q=80&w=600&auto=format&fit=crop" },
    { id: 4, name: "Chole Bhature", image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?q=80&w=600&auto=format&fit=crop" },
    { id: 5, name: "Biryani", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=600&auto=format&fit=crop" },
    { id: 6, name: "Dosa", image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?q=80&w=600&auto=format&fit=crop" },
    { id: 7, name: "Poori", image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?q=80&w=600&auto=format&fit=crop" },
    { id: 8, name: "Idli", image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=600&auto=format&fit=crop" },
    { id: 9, name: "Samosa", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=600&auto=format&fit=crop" },
    { id: 10, name: "Vada Pav", image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?q=80&w=600&auto=format&fit=crop" },
    { id: 11, name: "Coffee", image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600&auto=format&fit=crop" },
    { id: 12, name: "Shake", image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=600&auto=format&fit=crop" },
    { id: 13, name: "Pav Bhaji", image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?q=80&w=600&auto=format&fit=crop" },
    { id: 14, name: "Pakoda", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=600&auto=format&fit=crop" },
  ];

  // Intersection Observer to detect scroll position
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          // Reset so the queue animation triggers every time you scroll back
          setIsVisible(false);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-orange-500 text-white py-20 px-4 sm:px-8 overflow-hidden rounded-[3rem] my-12 max-w-7xl mx-auto shadow-2xl"
    >
      {/* Background Decorative Glow Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-500/20 blur-[120px] pointer-events-none rounded-full"></div>

      {/* SECTION HEADER */}
      <div className="text-center max-w-3xl mx-auto mb-16 relative z-10">
        <span className="px-4 py-1.5 bg-purple-500/30 text-purple-200 border border-purple-400/30 text-xs font-bold rounded-full uppercase tracking-widest inline-block mb-3">
          Explore Specialties 🍲
        </span>
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4">
          Inspiration for Your Daily Meals
        </h2>
        <p className="text-purple-200 text-sm sm:text-lg font-medium leading-relaxed max-w-2xl mx-auto">
          Explore delicious homemade dishes prepared daily by top kitchens near you.
        </p>
      </div>

      {/* QUEUE-ANIMATED DISHES GRID */}
      <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 max-w-6xl mx-auto relative z-10">
        {dishes.map((dish, index) => (
          <div
            key={dish.id}
            className="flex flex-col items-center group cursor-pointer"
            style={{
              transition: "all 0.6s cubic-bezier(0.25, 1, 0.5, 1)",
              // Staggered delay creates the sequential queue movement (80ms per item)
              transitionDelay: isVisible ? `${index * 80}ms` : "0ms",
              opacity: isVisible ? 1 : 0,
              // Glides in from left & bottom in a queue trail
              transform: isVisible
                ? "translate(0px, 0px) scale(1)"
                : `translate(${-40 - index * 5}px, 60px) scale(0.5)`,
            }}
          >
            {/* CIRCULAR DISH ICON */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-white/10 backdrop-blur-md border border-white/20 shadow-lg group-hover:border-orange-400 group-hover:scale-110 group-hover:shadow-orange-500/40 transition-all duration-300 relative overflow-hidden flex items-center justify-center">
              <img
                src={dish.image}
                alt={dish.name}
                className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
              />
            </div>

            {/* DISH NAME LABEL */}
            <span className="mt-3 text-sm sm:text-base font-bold text-purple-100 group-hover:text-orange-400 transition-colors tracking-wide text-center">
              {dish.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}