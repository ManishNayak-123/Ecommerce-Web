import { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router";
import toast from "react-hot-toast";

export default function DriverNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [driverUser, setDriverUser] = useState(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Load saved driver profile from localStorage
  useEffect(() => {
    const loadDriver = () => {
      try {
        const storedDriver = localStorage.getItem("driverUser");
        setDriverUser(storedDriver ? JSON.parse(storedDriver) : null);
      } catch (error) {
        console.error("Could not read driver session:", error);
        setDriverUser(null);
      }
    };

    loadDriver();
    window.addEventListener("storage", loadDriver);
    return () => window.removeEventListener("storage", loadDriver);
  }, []);

  const handleDriverLogout = () => {
    localStorage.removeItem("driverUser");
    localStorage.removeItem("driverToken");
    setDriverUser(null);
    setProfileMenuOpen(false);
    toast.success("Logged out from partner portal");
    navigate("/driver"); // Redirects to Driver Home landing page
  };

  const desktopLinkStyle = ({ isActive }) =>
    `relative py-1 font-semibold transition-colors duration-200 ${
      isActive
        ? "text-orange-500 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-orange-500"
        : "text-gray-300 hover:text-orange-400"
    }`;

  const mobileLinkStyle = ({ isActive }) =>
    `block rounded-xl px-4 py-3 font-semibold transition-all ${
      isActive
        ? "border-l-4 border-orange-500 bg-orange-500/10 pl-3 text-orange-400"
        : "border-b border-white/5 text-gray-300 hover:text-orange-400"
    }`;

  return (
    <nav className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-slate-950/90 backdrop-blur-md font-sans">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 md:px-8 lg:px-12">
        
        {/* Brand / Logo */}
        <div className="shrink-0 flex items-center gap-3">
          <Link
            to="/driver/home"
            className="flex items-center gap-2 text-xl font-black tracking-wide text-white sm:text-2xl"
          >
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-md text-sm font-black">
              🛵
            </div>
            <span>
              TiffinBox <span className="text-orange-500 text-xs uppercase px-2 py-0.5 bg-orange-500/10 border border-orange-500/30 rounded-full ml-1">Partner</span>
            </span>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden items-center gap-6 font-medium lg:flex xl:gap-8 text-sm">
          <NavLink to="/driver/home" end className={desktopLinkStyle}>
            Partner Home
          </NavLink>
          <NavLink to="/driver/dashboard" className={desktopLinkStyle}>
            Driver Dashboard
          </NavLink>
        </div>

        {/* Desktop Right Actions */}
        <div className="hidden items-center gap-3 lg:flex">
          <Link
            to="/"
            className="rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-xs font-bold text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            Switch to Customer App 🍽️
          </Link>

          {driverUser ? (
            /* Profile Dropdown Menu when driver is logged in */
            <div
              className="relative"
              onMouseEnter={() => setProfileMenuOpen(true)}
              onMouseLeave={() => setProfileMenuOpen(false)}
            >
              <button
                type="button"
                onClick={() => setProfileMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1.5 transition hover:border-orange-500"
              >
                <div className="w-7 h-7 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-black">
                  {driverUser?.name ? driverUser.name[0].toUpperCase() : "D"}
                </div>
                <span className="text-xs font-bold text-white max-w-[100px] truncate">
                  {driverUser?.name || "Driver"}
                </span>
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 top-full z-[60] w-48 pt-2">
                  <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-2xl">
                    <div className="border-b border-slate-800 px-4 py-3">
                      <p className="truncate text-xs font-bold text-white">
                        {driverUser?.name || "Delivery Partner"}
                      </p>
                      <p className="text-[10px] text-orange-400 font-semibold mt-0.5">
                        Status: Active Rider 🟢
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleDriverLogout}
                      className="w-full px-4 py-2.5 text-left text-xs font-bold text-rose-400 transition hover:bg-rose-500/10 cursor-pointer"
                    >
                      Logout Partner Account
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Apply / Login CTA when not authenticated */
            <Link
              to="/driver/home"
              className="rounded-xl bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 text-xs font-extrabold transition shadow-md shadow-orange-500/20"
            >
              Apply / Partner Login
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Menu Toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={() => setIsOpen((previous) => !previous)}
            aria-label="Toggle navigation"
            className="rounded-lg p-2 text-white hover:bg-white/10"
          >
            <svg
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        className={`absolute w-full border-b border-white/10 bg-slate-950/95 backdrop-blur-lg transition-all duration-300 lg:hidden ${
          isOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible pointer-events-none -translate-y-4 opacity-0"
        }`}
      >
        <div className="mx-auto flex max-w-lg flex-col gap-2 px-4 py-6">
          <NavLink
            to="/driver/home"
            end
            onClick={() => setIsOpen(false)}
            className={mobileLinkStyle}
          >
            Partner Home
          </NavLink>
          <NavLink
            to="/driver/dashboard"
            onClick={() => setIsOpen(false)}
            className={mobileLinkStyle}
          >
            Driver Dashboard
          </NavLink>

          <div className="mt-4 flex flex-col gap-3 pt-4 border-t border-slate-800">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="w-full rounded-xl border border-white/20 py-3 text-center text-xs font-bold text-slate-300 hover:bg-white/5"
            >
              Switch to Customer App 🍽️
            </Link>

            {driverUser ? (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  handleDriverLogout();
                }}
                className="w-full rounded-xl bg-rose-600/20 border border-rose-500/30 py-3 text-center text-xs font-bold text-rose-400 hover:bg-rose-600 hover:text-white"
              >
                Logout Partner Account
              </button>
            ) : (
              <Link
                to="/driver"
                onClick={() => setIsOpen(false)}
                className="w-full rounded-xl bg-orange-500 py-3 text-center text-xs font-extrabold text-white hover:bg-orange-600"
              >
                Apply / Partner Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}