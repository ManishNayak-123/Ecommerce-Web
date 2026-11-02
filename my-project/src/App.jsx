

import React from "react";
import { Routes, Route, useNavigate } from 'react-router';
import Home from './Home';
import Meals from './Meals';
import Subscription from './AboutUs';
import Login from './Login';
import Register from './Register';
import CartPage from './CartPage';
import TrackOrder from './TrackOrder';
import ContactPage from './ContactUs';
import AboutUs from './AboutUs';
import AdminPanel from './Admin/AdminPannel';
import UploadFood from './Admin/UploadFood';
import AdminAboutus from './Admin/AdminAboutus';
import AdminPerformanceM from './Admin/AdminPerformanceM';
import AvailableFood from './AvailableFoods';
import CheckoutPayment from './CheckoutPayment';
import ForgotPassword from './ForgotPassword';
import MyOrders from './MyOrders';
import OrderSuccess from './Order_success';
import DriverHome from './Driver/DriverHome';
import DriverDashboard from './Driver/DriverDashboard';
import HelpCenter from "./Help";
import Terms from "./Terms";
import PrivacyPolicy from "./PrivacyPolicy";

// ==========================================
// 1. UNAUTHORIZED COMPONENT ("Thank you, return to home")
// ==========================================
function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-slate-100 flex flex-col items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 text-center max-w-md w-full">
        <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-2xl mx-auto flex items-center justify-center text-3xl mb-4">
          🏠
        </div>
        
        <h1 className="text-xl font-black text-slate-800 tracking-tight mb-2">
          Page Restricted
        </h1>
        
        <p className="text-sm text-slate-500 font-medium mb-6 leading-relaxed">
          Thank you for visiting. You do not have permission to view this page.
        </p>

        <button
          onClick={() => navigate("/")}
          className="w-full bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-extrabold py-3.5 rounded-2xl text-xs tracking-wider uppercase transition shadow-lg shadow-orange-500/20 cursor-pointer"
        >
          Thank you, return to home
        </button>
      </div>
    </div>
  );
}

// ==========================================
// 2. ADMIN ROUTE GUARD WRAPPER
// ==========================================
function AdminRoute({ children }) {
  const savedUser = localStorage.getItem("user");
  let isOwner = false;

  try {
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      // Replace with your personal email address used to log into your admin account
      if (parsedUser.email === "manishnayak5248@gmail.com") {
        isOwner = true;
      }
    }
  } catch (error) {
    console.error("Auth parse error:", error);
  }

  if (!isOwner) {
    return <Unauthorized />;
  }

  return children;
}

// ==========================================
// 3. MAIN APP ROUTING
// ==========================================
function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/meals' element={<Meals />} />
        <Route path='/subscription' element={<Subscription />} />
        <Route path='/login' element={<Home />} /> 
        <Route path='/register' element={<Home />} /> 
        <Route path='/cart_page' element={<CartPage />} />
        <Route path='/product_track' element={<TrackOrder />} />
        <Route path='/contact_us' element={<ContactPage />} />
        <Route path='/about_us' element={<AboutUs />} />
        
        {/* SECURED ADMIN ROUTES */}
        <Route path='/admin/home' element={<AdminRoute><AdminPanel /></AdminRoute>} />
        <Route path='/admin' element={<AdminRoute><AdminPanel /></AdminRoute>} />
        <Route path='/admin/upload_food' element={<AdminRoute><UploadFood /></AdminRoute>} />
        <Route path='/admin/about_us' element={<AdminRoute><AdminAboutus /></AdminRoute>} />
        <Route path='/admin/performance_measure' element={<AdminRoute><AdminPerformanceM /></AdminRoute>} />

        <Route path='/available_food' element={<AvailableFood />} />
        <Route path='/payment_checkout' element={<CheckoutPayment />} />
        <Route path='/forgot_password' element={<ForgotPassword />} /> 
        <Route path='/orders' element = {<MyOrders />} />
        <Route path='/track-order/:orderId' element = {<TrackOrder />} />
        <Route path='/track-order' element={<TrackOrder />} />
        <Route path='/order-success' element = {<OrderSuccess />} />
        <Route path="/driver/home" element={<DriverHome />} />
        <Route path='/driver' element = {<DriverHome />} />
        <Route path='/driver/dashboard' element = {<DriverDashboard />} />
        <Route path="/help" element = {<HelpCenter />} />
        <Route path="/terms" element = {<Terms />} />
        <Route path="/privacy" element = {<PrivacyPolicy />} />
      </Routes>
    </div>
  );
}

export default App;