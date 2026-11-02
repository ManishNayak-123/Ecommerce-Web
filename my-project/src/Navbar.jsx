

import { useState, useEffect } from "react";
import {
  NavLink,
  Link,
  useLocation,
  useNavigate,
} from "react-router";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";

import Login from "./Login";
import Register from "./Register";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "https://ecommerce-web-g9rx.onrender.com"
).replace(/\/+$/, "");

// Helper function to resolve the user's uploaded profile image path correctly
function getProfileImage(user) {
  const image =
    user?.profilePicture?.url ||
    user?.profilePicture?.path ||
    user?.profilePicture ||
    user?.avatar ||
    user?.photo ||
    user?.image ||
    user?.img;

  if (typeof image !== "string" || !image.trim()) {
    return null; // Return null if no image was uploaded
  }

  const value = image.trim();

  if (
    value.startsWith("https://") ||
    value.startsWith("http://") ||
    value.startsWith("data:image/")
  ) {
    return value;
  }

  // Clean up backslashes (Windows paths) and leading slashes
  const normalizedPath = value.replace(/\\/g, "/").replace(/^\/+/, "");

  if (normalizedPath.startsWith("uploads/")) {
    return `${API_BASE_URL}/${normalizedPath}`;
  }

  return `${API_BASE_URL}/uploads/${normalizedPath}`;
}

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [loginShow, setLoginShow] = useState(false);
  const [registerShow, setRegisterShow] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  // State to handle the 3-second flipping animation between "T" and "Tiffin icon"
  const [showT, setShowT] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  const cartCount = useSelector(
    (state) => state.cart?.totalCount ?? 0
  );

  // Timer: Flip logo every 3 seconds (3000ms)
  useEffect(() => {
    const timer = setInterval(() => {
      setShowT((prev) => !prev);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  // Synchronize modal visibility with URL paths
  useEffect(() => {
    setLoginShow(location.pathname === "/login");
    setRegisterShow(location.pathname === "/register");
  }, [location.pathname]);

  // Load the saved user.
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem("user");
        setUser(storedUser ? JSON.parse(storedUser) : null);
      } catch (error) {
        console.error("Could not read saved user:", error);
        setUser(null);
      }
    };

    loadUser();
    window.addEventListener("storage", loadUser);

    return () => {
      window.removeEventListener("storage", loadUser);
    };
  }, []);

  // Return safely to the page behind the modal
  const returnToBackgroundPage = () => {
    const backgroundLocation = location.state?.backgroundLocation;

    if (backgroundLocation) {
      navigate(
        backgroundLocation.pathname +
          backgroundLocation.search +
          backgroundLocation.hash,
        { replace: true }
      );
    } else {
      navigate("/", { replace: true });
    }
  };

  // Open login and capture current view as background state
  const handleOpenLogin = () => {
    setIsOpen(false);
    setRegisterShow(false);

    if (location.pathname === "/login") {
      setLoginShow(true);
      return;
    }

    navigate("/login", {
      state: {
        backgroundLocation: location.state?.backgroundLocation || location,
      },
    });
  };

  const handleCloseLogin = () => {
    setLoginShow(false);
    returnToBackgroundPage();
  };

  const handleCloseRegister = () => {
    setRegisterShow(false);
    returnToBackgroundPage();
  };

  const handleSwitchToRegister = () => {
    navigate("/register", {
      state: {
        backgroundLocation: location.state?.backgroundLocation || location,
      },
    });
  };

  const handleSwitchToLogin = () => {
    navigate("/login", {
      state: {
        backgroundLocation: location.state?.backgroundLocation || location,
      },
    });
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/v1/user/logout`);
      toast.success("Logged out successfully!");
    } catch (error) {
      console.error("Logout request failed:", error);
      toast.error("Logout failed on server, clearing local session.");
    } finally {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("accessToken");

      setUser(null);
      setProfileMenuOpen(false);
      setIsOpen(false);
      navigate("/");
    }
  };

  const desktopLinkStyle = ({ isActive }) =>
    `relative py-1 font-semibold transition-colors duration-200 ${
      isActive
        ? "text-orange-500 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-orange-500"
        : "text-gray-200 hover:text-orange-400"
    }`;

  const mobileLinkStyle = ({ isActive }) =>
    `block rounded-xl px-4 py-3 font-semibold transition-all ${
      isActive
        ? "border-l-4 border-orange-500 bg-orange-500/10 pl-3 text-orange-400"
        : "border-b border-white/5 text-gray-300 hover:text-orange-400"
    }`;

  const profileImageUrl = getProfileImage(user);
  const userName =
    user?.name || user?.fullName || user?.username || "User";

  // Renders the uploaded user image, or a fallback initials badge if no image was uploaded
  const renderProfileImage = (mobile = false) => {
    if (profileImageUrl) {
      return (
        <img
          src={profileImageUrl}
          alt={`${userName}'s profile`}
          className={`rounded-full border-2 border-orange-500 object-cover ${
            mobile ? "h-10 w-10" : "h-9 w-9"
          }`}
        />
      );
    }

    // Fallback: Show user's initials if they didn't upload a picture
    const initials = userName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    return (
      <div
        className={`flex items-center justify-center rounded-full border-2 border-orange-500 bg-orange-500/20 font-bold text-orange-400 ${
          mobile ? "h-10 w-10 text-sm" : "h-9 w-9 text-xs"
        }`}
      >
        {initials || "U"}
      </div>
    );
  };

  return (
    <>
      <nav className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-black/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 md:px-8 lg:px-12">
          {/* Animated IIT Madras Style Rotating Flip Logo */}
          <div className="shrink-0">
            <Link
              to="/"
              className="flex items-center gap-2 text-xl font-black tracking-wide text-white sm:text-2xl lg:text-3xl"
            >
              {/* 3D Flip Container */}
              <div className="h-9 w-9 [perspective:1000px] sm:h-10 sm:w-10">
                <div
                  className={`relative h-full w-full rounded-xl transition-transform duration-700 [transform-style:preserve-3d] ${
                    showT ? "" : "[transform:rotateY(180deg)]"
                  }`}
                >
                  {/* Front Side: Letter 'T' */}
                  <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 text-xl font-black text-white shadow-md [backface-visibility:hidden] sm:text-2xl">
                    T
                  </div>

                  {/* Back Side: Tiffin Icon / Image */}
                  <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-gradient-to-tr from-orange-500 to-amber-400 text-white shadow-md [backface-visibility:hidden] [transform:rotateY(180deg)]">
                    {/* SVG Tiffin Icon (or replace with your <img src="/tiffin.png" alt="Tiffin" className="h-6 w-6 object-contain" />) */}
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 3v2m-6 4h12a1 1 0 011 1v2a1 1 0 01-1 1H6a1 1 0 01-1-1V10a1 1 0 011-1zm-1 5h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2a1 1 0 011-1zm0 5h14a1 1 0 011 1v1a2 2 0 01-2 2H6a2 2 0 01-2-2v-1a1 1 0 011-1z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Brand Text */}
              <span>
                iffin<span className="text-orange-500">Box</span>
              </span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden items-center gap-6 font-medium lg:flex xl:gap-8">
            <NavLink to="/" end className={desktopLinkStyle}>
              Home
            </NavLink>
            <NavLink to="/meals" className={desktopLinkStyle}>
              Meals
            </NavLink>
            <NavLink to="/about_us" className={desktopLinkStyle}>
              About Us
            </NavLink>
            <NavLink to="/contact_us" className={desktopLinkStyle}>
              Contact
            </NavLink>
            <NavLink to="/product_track" className={desktopLinkStyle}>
              Track Product
            </NavLink>
          </div>

          {/* Desktop account and cart */}
          <div className="hidden items-center gap-3 lg:flex xl:gap-4">
            {user ? (
              <div
                className="relative"
                onMouseEnter={() => setProfileMenuOpen(true)}
                onMouseLeave={() => setProfileMenuOpen(false)}
              >
                <button
                  type="button"
                  onClick={() =>
                    setProfileMenuOpen((previous) => !previous)
                  }
                  aria-expanded={profileMenuOpen}
                  className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 p-1.5 transition hover:border-orange-500"
                >
                  {renderProfileImage()}
                  <span className="hidden max-w-[100px] truncate text-sm font-semibold text-white xl:inline">
                    {userName}
                  </span>
                </button>

                <div
                  className={`absolute right-0 top-full z-[60] w-48 pt-2 ${
                    profileMenuOpen ? "block" : "hidden"
                  }`}
                >
                  <div className="overflow-hidden rounded-xl border border-white/10 bg-gray-900 shadow-xl">
                    <div className="border-b border-white/10 px-4 py-3">
                      <p className="truncate text-sm font-semibold text-white">
                        {userName}
                      </p>
                      <p className="text-xs text-gray-400">
                        My Account
                      </p>
                    </div>

                    <Link
                      to="/orders"
                      onClick={() => setProfileMenuOpen(false)}
                      className="block w-full px-4 py-2.5 text-left text-sm font-semibold text-gray-200 transition hover:bg-white/10"
                    >
                      My Orders
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full px-4 py-3 text-left text-sm font-semibold text-red-400 transition hover:bg-red-500/10"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleOpenLogin}
                className="rounded-full border border-white/30 px-4 py-2 text-sm font-medium text-white transition hover:border-white hover:bg-white/10 xl:text-base"
              >
                Login
              </button>
            )}

            <Link
              to="/cart_page"
              className="relative flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:scale-105 hover:bg-orange-600 xl:text-base"
            >
              <span>🛒</span>
              Cart
              {cartCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full border border-black bg-red-600 text-xs font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile controls */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              to="/cart_page"
              onClick={() => setIsOpen(false)}
              className="relative rounded-full bg-orange-500 px-3 py-2 text-sm font-semibold text-white"
            >
              🛒
              <span className="hidden sm:inline"> Cart</span>
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full border border-black bg-red-600 text-[10px] font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        <div
          className={`absolute w-full border-b border-white/10 bg-black/95 backdrop-blur-lg transition-all duration-300 lg:hidden ${
            isOpen
              ? "visible translate-y-0 opacity-100"
              : "invisible pointer-events-none -translate-y-4 opacity-0"
          }`}
        >
          <div className="mx-auto flex max-w-lg flex-col gap-2 px-4 py-6">
            <NavLink
              to="/"
              end
              onClick={() => setIsOpen(false)}
              className={mobileLinkStyle}
            >
              Home
            </NavLink>
            <NavLink
              to="/meals"
              onClick={() => setIsOpen(false)}
              className={mobileLinkStyle}
            >
              Meals
            </NavLink>
            <NavLink
              to="/about_us"
              onClick={() => setIsOpen(false)}
              className={mobileLinkStyle}
            >
              About Us
            </NavLink>
            <NavLink
              to="/contact_us"
              onClick={() => setIsOpen(false)}
              className={mobileLinkStyle}
            >
              Contact
            </NavLink>
            <NavLink
              to="/product_track"
              onClick={() => setIsOpen(false)}
              className={mobileLinkStyle}
            >
              Track Product
            </NavLink>

            <div className="mt-4 flex flex-col gap-3">
              {user ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setProfileMenuOpen((previous) => !previous)
                    }
                    className="flex w-full items-center justify-between rounded-xl border border-white/20 bg-white/10 p-3"
                  >
                    <div className="flex items-center gap-3">
                      {renderProfileImage(true)}
                      <span className="text-sm font-semibold text-white">
                        {userName}
                      </span>
                    </div>
                    <span className="text-gray-300">
                      {profileMenuOpen ? "▲" : "▼"}
                    </span>
                  </button>

                  {profileMenuOpen && (
                    <div className="mt-2 overflow-hidden rounded-xl border border-white/10 bg-gray-900">
                      <Link
                        to="/orders"
                        onClick={() => {
                          setProfileMenuOpen(false);
                          setIsOpen(false);
                        }}
                        className="block w-full px-4 py-2.5 text-left text-sm font-semibold text-gray-200 transition hover:bg-white/10"
                      >
                        My Orders
                      </Link>

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full px-4 py-3 text-left text-sm font-semibold text-red-400 transition hover:bg-red-500/10"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleOpenLogin}
                  className="w-full rounded-xl border border-white/20 py-3 text-sm font-medium text-white hover:bg-white/5"
                >
                  Login
                </button>
              )}

              <Link
                to="/cart_page"
                onClick={() => setIsOpen(false)}
                className="w-full rounded-xl bg-orange-500 py-3 text-center text-sm font-bold text-white hover:bg-orange-600"
              >
                Proceed to Cart 🛒
                {cartCount > 0 && (
                  <span className="ml-2 rounded-full bg-red-600 px-2 py-0.5 text-xs">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Login and Register Modals */}
      <Login
        isOpen={loginShow}
        onClose={handleCloseLogin}
        switchToRegister={handleSwitchToRegister}
      />

      <Register
        isOpen={registerShow}
        onClose={handleCloseRegister}
        switchToLogin={handleSwitchToLogin}
      />
    </>
  );
}

export default Navbar;