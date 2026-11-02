
import React, { useState, useEffect } from "react";
import AdminHeader from "./AdminHeader";
import Footer from "../Footer";
import { ANALYTICS_API_END_POINT, DRIVER_API_END_POINT } from "../Utils/Api";
import toast from "react-hot-toast";

export default function AdminPerformanceM() {
  const [loading, setLoading] = useState(true);
  
  // Real live backend state
  const [metrics, setMetrics] = useState({
    activeUsers: 0,
    totalProducts: 0,
    totalInquiries: 0,
    revenue: 0,
    recentInquiries: [],
  });

  // Drivers State
  const [drivers, setDrivers] = useState([]);
  const [loadingDrivers, setLoadingDrivers] = useState(true);

  // Fetch real data from Express backend on mount
  useEffect(() => {
    const fetchLiveAnalytics = async () => {
      try {
        const response = await fetch(`${ANALYTICS_API_END_POINT}/google_analytics`);
        const result = await response.json();
        
        if (result.success) {
          setMetrics(result.data);
        }
      } catch (error) {
        console.error("Failed to load live backend analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    // const fetchDrivers = async () => {
    //   try {
    //     const response = await fetch(`${DRIVER_API_END_POINT}/all`);
    //     const result = await response.json();
        
    //     if (result.success) {
    //       setDrivers(result.drivers || []);
    //     }
    //   } catch (error) {
    //     console.error("Failed to load driver applications:", error);
    //     toast.error("Failed to load delivery partners list.");
    //   } finally {
    //     setLoadingDrivers(false);
    //   }
    // };

    const fetchDrivers = async () => {
      try {
        const token = localStorage.getItem("token"); // Get admin token

        const response = await fetch(`${DRIVER_API_END_POINT}/all`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Pass token here
          },
          credentials: "include",
        });

        const result = await response.json();
        
        if (result.success) {
          setDrivers(result.drivers || []);
        } else {
          toast.error(result.message || "Failed to load drivers.");
        }
      } catch (error) {
        console.error("Failed to load driver applications:", error);
        toast.error("Failed to load delivery partners list.");
      } finally {
        setLoadingDrivers(false);
      }
    };

    fetchLiveAnalytics();
    fetchDrivers();
  }, []);

  // Handler to update a driver's approval/active status
  const handleDriverStatusChange = async (driverId, newStatus) => {
    const token = localStorage.getItem("token");
    
    try {
      const response = await fetch(`${DRIVER_API_END_POINT}/update-status/${driverId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (response.ok) {
        setDrivers(drivers.map(d => (d._id === driverId ? { ...d, status: newStatus } : d)));
        toast.success(`Driver status updated to ${newStatus}!`);
      } else {
        toast.error(data.message || "Failed to update driver status.");
      }
    } catch (error) {
      console.error("Error updating driver status:", error);
      toast.error("Network error updating driver status.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900 pt-28 flex flex-col justify-between font-sans">
      <AdminHeader />

      <main className="max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex-grow animate-fadein">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 font-bold text-xs rounded-full uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Live Backend Database Connected 🗄️
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Admin Performance & Delivery Partners Hub
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1">
              Pulling real-time records directly from MongoDB collections (Users, Orders, Products, and Drivers).
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-400 font-bold text-sm">
            Fetching live production telemetry from database... ⚡
          </div>
        ) : (
          <>
            {/* Real Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Revenue</span>
                <div className="text-3xl font-black text-slate-900 mt-2">₹{metrics.revenue.toLocaleString()}</div>
                <p className="text-xs text-green-600 font-semibold mt-1">Live from Orders collection</p>
              </div>

              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Registered Users</span>
                <div className="text-3xl font-black text-slate-900 mt-2">{metrics.activeUsers}</div>
                <p className="text-xs text-orange-600 font-semibold mt-1">Active accounts</p>
              </div>

              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Catalog Products</span>
                <div className="text-3xl font-black text-slate-900 mt-2">{metrics.totalProducts}</div>
                <p className="text-xs text-amber-600 font-semibold mt-1">Active tiffin dishes</p>
              </div>

              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Delivery Partners</span>
                <div className="text-3xl font-black text-orange-500 mt-2">{drivers.length}</div>
                <p className="text-xs text-orange-600 font-semibold mt-1">Registered drivers</p>
              </div>
            </div>

            {/* --- REGISTERED DRIVERS SECTION --- */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-6 sm:p-8 shadow-sm mb-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">Registered Delivery Partners 🛵</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Manage and update active driver clearance statuses.</p>
                </div>
                <span className="text-xs font-bold bg-orange-100 text-orange-700 px-3 py-1 rounded-full">
                  {drivers.length} Active Applicants
                </span>
              </div>

              {loadingDrivers ? (
                <div className="text-center py-8 text-slate-400 text-xs">Loading drivers...</div>
              ) : drivers.length === 0 ? (
                <div className="text-center py-8 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-xs text-slate-500 font-semibold">No driver applications submitted yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-[11px] font-black uppercase text-slate-400">
                        <th className="pb-3 px-4">Partner Name</th>
                        <th className="pb-3 px-4">Phone (WhatsApp)</th>
                        <th className="pb-3 px-4">City</th>
                        <th className="pb-3 px-4">Vehicle</th>
                        <th className="pb-3 px-4">Status Controller</th>
                        <th className="pb-3 px-4">Applied Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {drivers.map((driver) => (
                        <tr key={driver._id} className="hover:bg-slate-50/80 transition">
                          <td className="py-4 px-4 font-extrabold text-slate-900 flex items-center gap-2">
                            <span className="w-7 h-7 bg-orange-500 text-white rounded-lg flex items-center justify-center font-bold text-[10px]">
                              {driver.fullName ? driver.fullName[0].toUpperCase() : "D"}
                            </span>
                            {driver.fullName}
                          </td>
                          <td className="py-4 px-4 text-slate-600 font-medium">
                            <a href={`tel:${driver.phone}`} className="text-orange-600 underline">
                              {driver.phone}
                            </a>
                          </td>
                          <td className="py-4 px-4 text-slate-600">{driver.city}</td>
                          <td className="py-4 px-4">
                            <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-md font-bold text-[10px]">
                              {driver.vehicleType}
                            </span>
                          </td>
                          
                          {/* Interactive Status Controller Dropdown */}
                          <td className="py-4 px-4">
                            <select
                              value={driver.status || "Pending"}
                              onChange={(e) => handleDriverStatusChange(driver._id, e.target.value)}
                              className="bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold px-3 py-1.5 text-slate-700 focus:outline-none focus:border-orange-500"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Approved">Approved</option>
                              <option value="Active">Active 🟢</option>
                              <option value="Suspended">Suspended 🔴</option>
                            </select>
                          </td>

                          <td className="py-4 px-4 text-slate-400 text-[11px]">
                            {new Date(driver.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Recent Customer Requirements / Inquiries Section */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-6 sm:p-8 shadow-sm">
              <h2 className="text-xl font-extrabold text-slate-900 mb-2">Live Customer Requirements & Messages</h2>
              <p className="text-xs text-slate-400 mb-6">Real-time submissions from your contact form collection.</p>

              <div className="space-y-4">
                {metrics.recentInquiries.length === 0 ? (
                  <p className="text-xs text-slate-500">No customer inquiries recorded yet.</p>
                ) : (
                  metrics.recentInquiries.map((item, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-slate-900">{item.name}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-orange-100 text-orange-700 rounded-md">{item.subject}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">{item.message}</p>
                      </div>
                      <div className="text-right text-[11px] text-slate-400">
                        {item.email} <br />
                        {new Date(item.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}