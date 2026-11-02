
import React, { useState, useEffect, useRef } from "react";

export default function AnimatedSection() {
  const sectionRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate overall scroll progress (0 to 1) inside this section
      const totalScrollableDistance = rect.height - windowHeight;
      const currentScroll = -rect.top;

      if (totalScrollableDistance > 0) {
        let progress = currentScroll / totalScrollableDistance;
        progress = Math.max(0, Math.min(1, progress));
        setScrollProgress(progress);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Phase 1 (0 -> 0.5): Assemble floating tiers into a vertical stack
  // Phase 2 (0.5 -> 1.0): Transition from stack fashion into a horizontal single line alignment
  const getTierTransformStyle = (index) => {
    // Stage 1: Assemble into vertical stack (Progress 0 to 0.5)
    const stackPhase = Math.min(1, scrollProgress / 0.5); 
    const stackInverted = 1 - stackPhase;

    // Stage 2: Spread horizontally in one line as it moves past header (Progress 0.5 to 1.0)
    const linePhase = Math.max(0, (scrollProgress - 0.5) / 0.5);

    // Initial scatter offsets for stage 1
    let initialX = 0;
    let initialY = 0;
    let initialRotate = 0;

    switch (index) {
      case 0: // Steel Lid
        initialX = -180;
        initialY = -280;
        initialRotate = -35;
        break;
      case 1: // Tier 1: Paneer Masala
        initialX = 220;
        initialY = -140;
        initialRotate = 25;
        break;
      case 2: // Tier 2: Dal Tadka
        initialX = -240;
        initialY = 80;
        initialRotate = -22;
        break;
      case 3: // Tier 3: Basmati Rice
        initialX = 200;
        initialY = 260;
        initialRotate = 30;
        break;
      default:
        break;
    }

    // 1. Position during Stack Mode
    const stackedX = initialX * Math.pow(stackInverted, 1.2);
    const stackedY = initialY * Math.pow(stackInverted, 1.2);
    const stackedRotate = initialRotate * stackInverted;

    // 2. Position during Horizontal Line Mode
    // Target X position offsets for 1-line alignment (-1.5, -0.5, 0.5, 1.5 spacing multiplier)
    const lineXOffsets = [-260, -90, 80, 250]; 
    const lineTargetX = lineXOffsets[index];

    // Combine both phases smoothly based on scroll position
    const currentX = (1 - linePhase) * stackedX + linePhase * lineTargetX;
    const currentY = (1 - linePhase) * stackedY; // Y levels out to 0 in line mode
    const currentRotate = (1 - linePhase) * stackedRotate; // Rotation straightens to 0deg

    const scale = 0.85 + scrollProgress * 0.15;
    const opacity = 0.3 + scrollProgress * 0.7;

    return {
      transform: `translate3d(${currentX}px, ${currentY}px, 0) rotate(${currentRotate}deg) scale(${scale})`,
      opacity: opacity,
      transition: "transform 0.08s ease-out, opacity 0.08s ease-out",
    };
  };

  return (
    <section
      ref={sectionRef}
      className="relative mt-30 h-[280vh] w-full bg-transparent overflow-clip my-4"
    >
      {/* Sticky Viewport Container */}
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center px-4 overflow-hidden">
        
        {/* Glow Background Layer */}
        <div
          className="absolute w-[360px] h-[360px] sm:w-[540px] sm:h-[540px] rounded-full bg-gradient-to-tr from-orange-500/25 to-red-500/15 blur-3xl pointer-events-none transition-all duration-500"
          style={{
            transform: `scale(${0.7 + scrollProgress * 0.5})`,
            opacity: 0.4 + scrollProgress * 0.6,
          }}
        />

        {/* Header Section */}
        <div className="text-center z-10 max-w-2xl mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-500/10 backdrop-blur-md border border-orange-500/30 rounded-full text-orange-600 text-xs sm:text-sm font-black mb-3 uppercase tracking-wider shadow-sm">
            <span>🍱</span> Authentic Indian Tiffin Assembly
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight mb-2">
            {scrollProgress > 0.5 ? (
              <>Unpacked <span className="text-orange-500">Delicious Tiffin</span></>
            ) : (
              <>Watch Your <span className="text-orange-500">Dabba</span> Assemble</>
            )}
          </h2>
          <p className="text-gray-600 text-sm sm:text-base font-semibold max-w-md mx-auto">
            {scrollProgress > 0.5
              ? "Tiffin unpacked into one fresh horizontal line display."
              : "Scroll down to see the tiffin stack up into one hot meal container."}
          </p>
        </div>

        {/* --- DYNAMIC TIFFIN ASSEMBLY & LINE ALIGNMENT CONTAINER --- */}
        <div className="relative z-20 w-full max-w-5xl flex items-center justify-center min-h-[380px] sm:min-h-[440px]">
          
          {/* Steel Locking Frame (Visible only during vertical stack mode) */}
          <div
            className="absolute z-30 w-40 sm:w-48 h-[260px] sm:h-[300px] border-4 border-slate-400 rounded-3xl pointer-events-none transition-all duration-300 flex flex-col items-center justify-between py-2 shadow-2xl"
            style={{
              opacity: scrollProgress > 0.4 && scrollProgress < 0.65 ? 1 : 0,
              transform: `scale(${scrollProgress > 0.4 && scrollProgress < 0.65 ? 1 : 0.9})`,
            }}
          >
            <div className="w-16 h-8 border-4 border-slate-400 border-b-0 rounded-t-full -mt-9 bg-transparent relative flex justify-center">
              <span className="w-4 h-1 bg-orange-500 rounded-full mt-1" />
            </div>
            <div className="w-full flex justify-between px-1">
              <div className="w-2.5 h-6 bg-slate-400 rounded-sm shadow-md" />
              <div className="w-2.5 h-6 bg-slate-400 rounded-sm shadow-md" />
            </div>
          </div>

          {/* Tier 0: Stainless Steel Lid */}
          <div
            style={getTierTransformStyle(0)}
            className="absolute z-20 w-48 sm:w-56 h-12 sm:h-16 bg-gradient-to-r from-slate-200 via-white to-slate-300 rounded-2xl border-2 border-slate-300 shadow-xl flex items-center justify-center relative backdrop-blur-md"
          >
            <div className="w-8 h-3 bg-slate-400 rounded-t-md shadow-inner border border-slate-300 mr-2" />
            <span className="text-xs sm:text-sm font-black text-slate-700 uppercase tracking-widest">
              Lid Cover
            </span>
          </div>

          {/* Tier 1: Paneer Butter Masala */}
          <div
            style={getTierTransformStyle(1)}
            className="absolute z-15 w-48 sm:w-56 h-28 sm:h-32 bg-gradient-to-r from-slate-100 via-white to-slate-200 rounded-2xl border-2 border-slate-300 shadow-xl flex flex-col items-center justify-center p-3 text-center backdrop-blur-md"
          >
            <span className="text-3xl sm:text-4xl mb-1">🥘</span>
            <h4 className="text-xs sm:text-sm font-black text-gray-900 leading-snug">
              Paneer Masala
            </h4>
            <p className="text-[10px] sm:text-xs text-orange-600 font-extrabold mt-1">
              Creamy Gravy
            </p>
          </div>

          {/* Tier 2: Dal Tadka & Rotis */}
          <div
            style={getTierTransformStyle(2)}
            className="absolute z-10 w-48 sm:w-56 h-28 sm:h-32 bg-gradient-to-r from-slate-100 via-white to-slate-200 rounded-2xl border-2 border-slate-300 shadow-xl flex flex-col items-center justify-center p-3 text-center backdrop-blur-md"
          >
            <span className="text-3xl sm:text-4xl mb-1">🍲</span>
            <h4 className="text-xs sm:text-sm font-black text-gray-900 leading-snug">
              Dal & Rotis
            </h4>
            <p className="text-[10px] sm:text-xs text-orange-600 font-extrabold mt-1">
              Tempered Ghee
            </p>
          </div>

          {/* Tier 3: Basmati Rice */}
          <div
            style={getTierTransformStyle(3)}
            className="absolute z-5 w-48 sm:w-56 h-28 sm:h-32 bg-gradient-to-r from-slate-100 via-white to-slate-200 rounded-2xl border-2 border-slate-300 shadow-xl flex flex-col items-center justify-center p-3 text-center backdrop-blur-md"
          >
            <span className="text-3xl sm:text-4xl mb-1">🍚</span>
            <h4 className="text-xs sm:text-sm font-black text-gray-900 leading-snug">
              Basmati Rice
            </h4>
            <p className="text-[10px] sm:text-xs text-orange-600 font-extrabold mt-1">
              Aromatic Grain
            </p>
          </div>

        </div>

        {/* Assembly Progress Status Badge */}
        <div className="mt-6 flex flex-col items-center gap-2.5 z-20">
          <div
            className={`px-5 py-2 rounded-full font-black text-xs sm:text-sm tracking-wide uppercase transition-all duration-300 shadow-md ${
              scrollProgress > 0.85
                ? "bg-emerald-500 text-white ring-4 ring-emerald-500/20 scale-105"
                : scrollProgress > 0.45
                ? "bg-orange-500 text-white shadow-orange-500/30"
                : "bg-slate-700 text-white"
            }`}
          >
            {scrollProgress > 0.85
              ? "✅ Unpacked In 1 Line Mode!"
              : scrollProgress > 0.45
              ? "🍱 Assembled In Stack Mode!"
              : `Assembling Tiffin: ${Math.round(scrollProgress * 100)}%`}
          </div>

          <div className="w-52 sm:w-64 bg-gray-200 h-2.5 rounded-full overflow-hidden backdrop-blur-sm border border-gray-300/50 shadow-inner">
            <div
              className="bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-500 h-full transition-all duration-75 ease-out rounded-full shadow-md"
              style={{ width: `${scrollProgress * 100}%` }}
            />
          </div>
        </div>

      </div>
    </section>
  );
}