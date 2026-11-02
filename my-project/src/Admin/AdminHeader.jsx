
import { useState } from "react";
import { NavLink, Link } from "react-router"; // or 'react-router-dom'

function AdminHeader() {
  const [isOpen, setIsOpen] = useState(false);

  // Helper styling function for Laptop Screen Menu Items
  const desktopLinkStyle = ({ isActive }) => 
    `transition-colors duration-200 font-semibold relative py-1 ${
      isActive 
        ? "text-orange-500 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-orange-500 after:rounded-full" 
        : "text-gray-200 hover:text-orange-400"
    }`;

  // Helper styling function for Mobile/Tablet Dropdown Items
  const mobileLinkStyle = ({ isActive }) => 
    `py-3 px-4 rounded-xl transition-all font-semibold ${
      isActive 
        ? "bg-orange-500/10 text-orange-400 border-l-4 border-orange-500 pl-3 block" 
        : "text-gray-300 hover:text-orange-400 border-b border-white/5 block"
    }`;

  return (
    <>
      <nav className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-black/85 backdrop-blur-md transition-all duration-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 md:px-8 lg:px-12">
          
          {/* Logo */}
          <div className="shrink-0">
            <Link
              to="/admin/home"
              className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-wide flex items-center gap-1"
            >
              Tiffin<span className="text-orange-500">Box</span>
              <span className="ml-2 text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full border border-orange-500/30">Admin</span>
            </Link>
          </div>

          {/* Desktop Menu - Active tabs highlighted with custom underline effects */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8 font-medium">
            <NavLink to="/admin/home" end className={desktopLinkStyle}>Home</NavLink>
            <NavLink to="/admin/about_us" className={desktopLinkStyle}>About Us</NavLink>
            <NavLink to="/admin/upload_food" className={desktopLinkStyle}>Upload Food</NavLink>
            <NavLink to="/admin/performance_measure" className={desktopLinkStyle}>Performance</NavLink>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center gap-1 lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white focus:outline-none p-1.5 rounded-lg hover:bg-white/5 transition-colors"
            >
              <svg className="h-6 w-6 sm:h-7 sm:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Slide Menu - Active states highlighted with orange left-border blocks */}
        <div
          className={`absolute w-full bg-black/95 backdrop-blur-lg border-b border-white/10 transition-all duration-300 ease-in-out lg:hidden ${
            isOpen
              ? "translate-y-0 opacity-100 visible pointer-events-auto"
              : "-translate-y-4 opacity-0 invisible pointer-events-none"
          }`}
        >
          <div className="flex flex-col px-4 py-6 gap-2 max-w-lg mx-auto">
            <NavLink to="/admin/home" end onClick={() => setIsOpen(false)} className={mobileLinkStyle}>Home</NavLink>
            <NavLink to="/admin/about_us" onClick={() => setIsOpen(false)} className={mobileLinkStyle}>About Us</NavLink>
            <NavLink to="/admin/upload_food" onClick={() => setIsOpen(false)} className={mobileLinkStyle}>Upload Food</NavLink>
            <NavLink to="/admin/performance_measure" onClick={() => setIsOpen(false)} className={mobileLinkStyle}>Performance</NavLink>
          </div>
        </div>
      </nav>
    </>
  );
}

export default AdminHeader;