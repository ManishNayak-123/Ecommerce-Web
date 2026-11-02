

import React, { useState } from "react";

export default function ServiceLocations() {
  const [searchQuery, setSearchQuery] = useState("");

  // Locations positioned across 3D spherical coordinates in outer space
  const locations = [
    { name: "Begrajpur Hub", status: "Active", avgTime: "25 min", icon: "🏢", pin: "251203", rotY: 0, rotX: 15 },
    { name: "Ghasipura Zone", status: "Active", avgTime: "30 min", icon: "🍲", pin: "251201", rotY: 72, rotX: -25 },
    { name: "Pipe Company", status: "Active", avgTime: "20 min", icon: "🏭", pin: "251202", rotY: 144, rotX: 20 },
    { name: "Ravi Organic", status: "Expanding", avgTime: "35 min", icon: "🎓", pin: "251308", rotY: 216, rotX: -15 },
    { name: "Magma Area", status: "Active", avgTime: "28 min", icon: "⚙️", pin: "251310", rotY: 288, rotX: 40 },
  ];

  const filteredLocations = locations.filter(
    (loc) =>
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.pin.includes(searchQuery)
  );

  return (
    <section className="relative py-20 sm:py-28 bg-gradient-to-b from-white via-orange-50/30 to-white overflow-hidden">
      {/* 3D Sphere Keyframe Animations */}
      <style>{`
        @keyframes rotateGlobe {
          0% { transform: rotateX(15deg) rotateY(0deg); }
          100% { transform: rotateX(15deg) rotateY(360deg); }
        }
        @keyframes counterRotate {
          0% { transform: rotateY(0deg) rotateX(-15deg); }
          100% { transform: rotateY(-360deg) rotateX(-15deg); }
        }

        .globe-sphere {
          animation: rotateGlobe 32s linear infinite;
          transform-style: preserve-3d;
        }

        .globe-node-counter {
          animation: counterRotate 32s linear infinite;
          transform-style: preserve-3d;
        }

        .globe-stage:hover .globe-sphere,
        .globe-stage:hover .globe-node-counter {
          animation-play-state: paused;
        }
      `}</style>

      {/* Ambient background glow for whitish section */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-400/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER & SEARCH */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-100 text-orange-600 font-bold text-xs rounded-full uppercase tracking-wider border border-orange-200 mb-4 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            Live 3D Sphere Network
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            TiffinBox Cosmic <br />
            <span className="bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 bg-clip-text text-transparent">
              Delivery Orbit System
            </span>
          </h2>

          <p className="text-slate-600 text-sm sm:text-base font-medium mt-3 max-w-xl mx-auto">
            Explore our cloud kitchen nodes broadcasting live across wide orbital pathways in high-visibility outer space.
          </p>

          <div className="mt-8 max-w-md mx-auto relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search area or pincode (e.g. 251203)..."
              className="w-full px-4 py-3.5 pl-11 pr-24 text-sm bg-white border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-slate-800 placeholder-slate-400 transition-all"
            />
            <span className="absolute left-3.5 text-slate-400 text-lg">📍</span>
            <button className="absolute right-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95">
              Check
            </button>
          </div>
        </div>

        {/* --- COMPACT OUTER SPACE CONTAINER CARD (Sphere size preserved) --- */}
        <div className="relative w-full max-w-xl mx-auto bg-slate-950 rounded-3xl p-5 sm:p-8 shadow-2xl border border-slate-800 overflow-hidden">
          
          {/* Cosmic Nebula Backdrops inside the dark container */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-orange-600/15 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute top-1/4 right-1/4 w-[250px] h-[250px] bg-indigo-600/15 blur-[110px] rounded-full pointer-events-none" />
          
          {/* Starfield Dot Grid Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

          {/* 3D SPHERE STAGE */}
          <div className="globe-stage hidden md:flex relative w-full aspect-square mx-auto items-center justify-center my-2 [perspective:1200px]">
            
            {/* Cosmic Floor Glow */}
            <div className="absolute w-[60%] h-[15%] bottom-2 rounded-full bg-orange-600/25 blur-2xl pointer-events-none" />

            {/* Master 3D Globe Sphere */}
            <div className="globe-sphere relative w-56 h-56 sm:w-72 sm:h-72 rounded-full flex items-center justify-center">
              
              {/* SPHERICAL WIREFRAME MESH GRID */}
              <div className="absolute inset-0 rounded-full border-2 border-orange-500/60 shadow-[inset_0_0_60px_rgba(249,115,22,0.6)] pointer-events-none" />
              <div className="absolute inset-0 rounded-full border border-orange-400/40 [transform:rotateX(60deg)] pointer-events-none" />
              <div className="absolute inset-0 rounded-full border border-orange-400/40 [transform:rotateY(60deg)] pointer-events-none" />
              <div className="absolute inset-0 rounded-full border border-amber-300/30 [transform:rotateX(30deg)_rotateY(30deg)] pointer-events-none" />

              {/* Central Core Sphere */}
              <div className="absolute z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-orange-600 via-orange-500 to-amber-400 text-white shadow-[0_0_40px_rgba(249,115,22,0.9)] border-2 border-white/80 flex flex-col items-center justify-center p-2 text-center">
                <span className="text-3xl">🍱</span>
                <span className="text-[10px] font-black tracking-tight uppercase mt-0.5 text-white drop-shadow">TIFFINBOX</span>
              </div>

              {/* --- 3D SURFACE LOCATION NODES IN OUTER SPACE --- */}
              {locations.map((loc, idx) => {
                return (
                  <div
                    key={idx}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    style={{
                      transform: `rotateY(${loc.rotY}deg) rotateX(${loc.rotX}deg) translateZ(195px)`,
                    }}
                  >
                    {/* Counter-rotation to keep card text upright and visible */}
                    <div className="globe-node-counter pointer-events-auto cursor-pointer group">
                      <div className="bg-slate-900/95 backdrop-blur-xl border border-orange-500/40 shadow-[0_0_25px_rgba(249,115,22,0.4)] px-3.5 py-2 rounded-2xl flex items-center gap-2.5 hover:scale-110 hover:border-orange-400 transition-all">
                        <span className="text-base">{loc.icon}</span>
                        <div className="flex flex-col text-left">
                          <span className="text-xs font-extrabold text-white whitespace-nowrap group-hover:text-orange-400 transition-colors">
                            {loc.name}
                          </span>
                          <span className="text-[10px] text-emerald-400 font-semibold">● {loc.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

            </div>
          </div>

          {/* Floating Outer Space Status Badge */}
          <div className="relative z-20 mt-4 max-w-xs mx-auto bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-800 shadow-xl text-center flex items-center justify-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              3D Sphere Active & Syncing
            </span>
          </div>

        </div>

        {/* MOBILE & FALLBACK GRID VIEW */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
              {searchQuery ? "Matching Delivery Zones" : "Active Service Sectors"}
            </h3>
            <span className="text-xs text-orange-600 font-semibold">
              {filteredLocations.length} Locations
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLocations.map((loc, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200/80 hover:border-orange-300 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-lg group-hover:scale-105 transition-transform">
                    {loc.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                      {loc.name}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium">Pincode: {loc.pin}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`inline-block px-2.5 py-0.5 text-[11px] font-bold rounded-full ${
                      loc.status === "Active"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                        : "bg-amber-50 text-amber-700 border border-amber-200/60"
                    }`}
                  >
                    {loc.status}
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5">⚡ {loc.avgTime}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}