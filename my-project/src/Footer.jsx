

import React from "react";
import { Link, useNavigate } from "react-router"; // Added useNavigate
import { useSelector } from "react-redux"; // Added useSelector

function Footer() {
  const navigate = useNavigate();
  
  // Get user state from Redux (adjust path to match your store state key, e.g., state.auth.user)
  const user = useSelector((state) => state.auth?.user || state.user?.user);

  // Handler to check authentication before navigating to Driver Dashboard
  const handleDriverClick = (e) => {
    e.preventDefault();
    
    // Check Redux user state or localStorage token
    const token = localStorage.getItem("token");

    if (!user && !token) {
      // Redirect to login form if user is not registered/logged in
      navigate("/login");
    } else {
      // Proceed to driver page if authenticated
      navigate("/driver");
    }
  };

  return (
    <div>
      {/* Footer */}
      <footer className="bg-gray-900 text-white px-8 lg:px-20 py-14 font-sans">
        <div className="grid md:grid-cols-4 gap-10">
          <div>
            <h2 className="text-3xl font-black text-orange-400 mb-4">
              TiffinBox
            </h2>

            <p className="text-gray-400 leading-7 text-sm">
              Fresh homemade tiffin delivery service for students, office
              workers, and families.[cite: 2]
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Company</h3>

            <ul className="space-y-3 text-gray-400 text-sm">
              <li>
                <Link to="/about_us" className="hover:text-orange-400 transition">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact_us" className="hover:text-orange-400 transition">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="https://final-year-srgc-project-1.onrender.com" className="hover:text-orange-400 transition">
                  Careers
                </Link>
              </li>
              {/* Protected Driver Partner Link */}
              <li>
                <button
                  type="button"
                  onClick={handleDriverClick}
                  className="text-orange-400 hover:text-orange-300 font-bold transition flex items-center gap-1.5 bg-transparent border-none cursor-pointer p-0 text-left"
                >
                  <span>Driver Partner</span>
                  <span className="text-xs">🛵</span>
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Support</h3>

            <ul className="space-y-3 text-gray-400 text-sm">
              <li>
                <Link to="/help" className="hover:text-orange-400 transition">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-orange-400 transition">
                  Terms
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-orange-400 transition">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>

            <ul className="space-y-3 text-gray-400 text-sm">
              <li>support@tiffinbox.com</li>
              <li>+91 9876543210</li>
              <li>Delhi, India</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-6 text-center text-gray-500 text-xs">
          © 2026 TiffinBox. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default Footer;