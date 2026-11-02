

import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import DriverNavbar from "./DriverNavbar";
import Footer from "../Footer";
import { DRIVER_API_END_POINT } from "../Utils/Api";
import toast from "react-hot-toast";

// Connect to backend Socket.io server
const socket = io("https://ecommerce-web-g9rx.onrender.com");

export default function DriverDashboard() {
  const [assignedOrders, setAssignedOrders] = useState([]);
  const [activeOrderId, setActiveOrderId] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [watchId, setWatchId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [driverInfo, setDriverInfo] = useState({ 
    fullName: "Ramesh Kumar", 
    phone: "",
    status: "Pending" // Default status from Admin panel
  });

  // Fetch assigned orders & driver status from MongoDB
  useEffect(() => {
    const fetchDriverOrders = async () => {
      try {
        setLoading(true);

        const savedDriver = localStorage.getItem("driverUser") || localStorage.getItem("user");
        let currentDriverId = "";

        if (savedDriver) {
          const parsedDriver = JSON.parse(savedDriver);
          setDriverInfo(parsedDriver);
          currentDriverId = parsedDriver._id || parsedDriver.id || "";
        }

        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const response = await axios.get(
          `${DRIVER_API_END_POINT}/orders/${currentDriverId}`,
          { headers, withCredentials: true }
        );

        const orders =
          Array.isArray(response.data) ? response.data :
          Array.isArray(response.data?.orders) ? response.data.orders :
          Array.isArray(response.data?.data) ? response.data.data : [];

        setAssignedOrders(orders);

        // Sync driver status if API call succeeds (meaning approved)
        setDriverInfo((prev) => {
          const updated = { ...prev, status: "Approved" };
          if (localStorage.getItem("driverUser")) {
            localStorage.setItem("driverUser", JSON.stringify(updated));
          } else if (localStorage.getItem("user")) {
            localStorage.setItem("user", JSON.stringify(updated));
          }
          return updated;
        });

      } catch (error) {
        console.error("Error fetching driver orders:", error);
        
        if (error.response?.status === 401) {
          toast.error("Unauthorized. Please log in or check driver registration.");
        } else if (error.response?.status === 403) {
          toast.error("Account pending admin approval.");
          setDriverInfo((prev) => ({ ...prev, status: "Pending" }));
        } else {
          toast.error("Failed to sync assigned orders from server.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDriverOrders();
  }, []);

  const isDriverApproved = driverInfo.status === "Approved" || driverInfo.status === "Active";

  // Start Broadcasting Live GPS Location to Backend Socket
  const startTrip = (orderId) => {
    if (!isDriverApproved) {
      toast.error("Delivery blocked! Your account must be approved by the Admin first.");
      return;
    }

    if (!("geolocation" in navigator)) {
      toast.error("Geolocation is not supported by your device browser.");
      return;
    }

    setActiveOrderId(orderId);
    setIsTracking(true);

    socket.emit("join-order", orderId);
    toast.success("GPS Live Broadcasting Started! 🚴");

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        socket.emit("update-location", { orderId, lat, lng });
      },
      (error) => {
        console.error("GPS Tracking Error:", error);
        toast.error("Unable to retrieve live GPS position.");
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    );

    setWatchId(id);
  };


  const completeTrip = async (orderId) => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }

    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      console.log("Sending delivery completion for Order ID:", orderId);

      const response = await axios.put(
        `${DRIVER_API_END_POINT}/order/status/${orderId}`,
        { orderId, orderStatus: "Delivered" },
        { headers, withCredentials: true }
      );

      console.log("Server response:", response.data);

      if (response.data?.success) {
        socket.emit("update-order-status", { orderId, orderStatus: "Delivered" });
        setIsTracking(false);
        setActiveOrderId(null);
        toast.success("Tiffin Delivered Successfully! 🎉");
        setAssignedOrders((prev) => prev.filter((o) => (o._id || o.id) !== orderId));
      }
    } catch (error) {
      // 🔍 PRINT THE EXACT ERROR MESSAGE FROM BACKEND IN CONSOLE
      console.error("Detailed delivery error:", error.response?.data || error.message);
      
      setIsTracking(false);
      setActiveOrderId(null);

      toast.error(error.response?.data?.message || "Failed to mark order as delivered.");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Active":
        return <span className="text-emerald-400 font-semibold">Online • Active 🟢</span>;
      case "Approved":
        return <span className="text-blue-400 font-semibold">Approved • Ready 🔵</span>;
      case "Suspended":
        return <span className="text-rose-400 font-semibold">Account Suspended 🔴</span>;
      default:
        return <span className="text-amber-400 font-semibold">Pending Approval 🟡</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans flex flex-col justify-between pt-20">
      <div>
        <DriverNavbar />

        <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <span className="text-xs font-bold text-orange-400 uppercase tracking-widest bg-orange-500/10 border border-orange-500/20 px-3 py-1 rounded-full">
                Active Duty 🛵
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white mt-2">
                Delivery Executive Dashboard
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Manage assigned tiffin deliveries and broadcast real-time GPS locations to customers.
              </p>
            </div>

            <div className="flex items-center gap-3 bg-slate-800 p-2.5 rounded-2xl border border-slate-700/80 shrink-0">
              <div className="w-10 h-10 bg-orange-500 text-white rounded-xl flex items-center justify-center font-black text-sm shadow">
                {driverInfo.fullName ? driverInfo.fullName[0].toUpperCase() : "R"}
              </div>
              <div className="text-left pr-2">
                <p className="text-xs font-bold text-white">{driverInfo.fullName || "Ramesh Kumar"}</p>
                <p className="text-[10px]">{getStatusBadge(driverInfo.status)}</p>
              </div>
            </div>
          </div>

          {!isDriverApproved && (
            <div className="my-6 p-4 bg-amber-500/15 border border-amber-500/40 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 bg-amber-400 rounded-full animate-ping" />
                <div>
                  <p className="text-xs font-bold text-amber-300">
                    {driverInfo.status === "Suspended" ? "Account Suspended" : "Pending Admin Approval"}
                  </p>
                  <p className="text-[10px] text-slate-300">
                    You cannot start deliveries until the admin approves your account in the dashboard.
                  </p>
                </div>
              </div>
              <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                Locked 🔒
              </span>
            </div>
          )}

          {isTracking && (
            <div className="my-6 p-4 bg-emerald-500/15 border border-emerald-500/40 rounded-2xl flex items-center justify-between animate-pulse">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 bg-emerald-400 rounded-full shadow-lg shadow-emerald-400/50" />
                <div>
                  <p className="text-xs font-bold text-emerald-300">Live GPS Broadcasting Active</p>
                  <p className="text-[10px] text-slate-400">Customer is watching your location in real-time.</p>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-500 text-slate-950 font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                Broadcasting
              </span>
            </div>
          )}

          <div className="mt-8">
            <h2 className="text-base font-extrabold text-slate-200 mb-4 flex items-center gap-2">
              <span>Assigned Tiffin Orders</span>
              <span className="text-xs font-bold bg-slate-800 text-orange-400 px-2.5 py-0.5 rounded-full border border-slate-700">
                {assignedOrders.length}
              </span>
            </h2>

            {loading ? (
              <div className="text-center py-16 bg-slate-800/40 rounded-2xl border border-slate-800">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent" />
                <p className="text-xs font-bold text-slate-400 mt-3">Fetching assigned runs...</p>
              </div>
            ) : assignedOrders.length === 0 ? (
              <div className="text-center py-16 bg-slate-800/40 rounded-3xl border border-slate-800/80 p-8">
                <div className="text-4xl mb-3">📦</div>
                <h3 className="text-base font-bold text-white mb-1">No Active Deliveries</h3>
                <p className="text-slate-400 text-xs max-w-sm mx-auto leading-relaxed">
                  You have no assigned tiffin orders right now or your account is awaiting verification.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {assignedOrders.map((order) => {
                  const orderId = order._id || order.id;
                  const isCurrentActive = activeOrderId === orderId;

                  const addr = order.deliveryAddress || {};
                  const customerName = addr.name || order.userName || "Customer";
                  const customerPhone = addr.phone || order.userPhone || "";
                  const fullAddress = typeof addr === "string" 
                    ? addr 
                    : `${addr.houseNo || ""}, ${addr.street || ""}, ${addr.city || ""} - ${addr.pincode || ""}`;

                  const itemsText = Array.isArray(order.items)
                    ? order.items.map(i => `${i.quantity || 1}x ${i.name}`).join(", ")
                    : order.itemsSummary || "Special Tiffin Box";

                  return (
                    <div
                      key={orderId}
                      className={`p-5 rounded-3xl border transition-all duration-300 ${
                        isCurrentActive
                          ? "bg-slate-800 border-orange-500/80 ring-2 ring-orange-500/30 shadow-2xl"
                          : "bg-slate-800/60 border-slate-700/70 hover:border-slate-600"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <span className="text-[10px] font-black text-orange-400 tracking-wider uppercase bg-orange-500/10 px-2 py-0.5 rounded-md border border-orange-500/20">
                            Order #{orderId.slice(-6)}
                          </span>
                          <h3 className="text-base font-bold text-white mt-1">
                            {customerName}
                          </h3>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg block">
                            ₹{order.totalAmount || 129}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs text-slate-300 bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800/80 mb-4">
                        <p className="flex items-start gap-2">
                          <span className="shrink-0">📍</span>
                          <span>
                            <strong className="text-slate-200">Delivery Address:</strong> {fullAddress}
                          </span>
                        </p>
                        <p className="flex items-center gap-2">
                          <span>📞</span>
                          <span>
                            <strong className="text-slate-200">Contact Phone:</strong>{" "}
                            <a href={`tel:${customerPhone}`} className="text-orange-400 underline font-bold">
                              {customerPhone || "Not provided"}
                            </a>
                          </span>
                        </p>
                        <p className="flex items-start gap-2">
                          <span className="shrink-0">🍱</span>
                          <span>
                            <strong className="text-slate-200">Tiffin Items:</strong> {itemsText}
                          </span>
                        </p>
                      </div>

                      {!isDriverApproved ? (
                        <button
                          disabled
                          className="w-full bg-slate-800 border border-slate-700 text-slate-500 font-extrabold py-3.5 rounded-2xl text-xs tracking-wider uppercase cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          <span>Delivery Locked (Pending Admin Approval)</span>
                          <span>🔒</span>
                        </button>
                      ) : !isTracking || !isCurrentActive ? (
                        <button
                          type="button"
                          onClick={() => startTrip(orderId)}
                          className="w-full bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-extrabold py-3.5 rounded-2xl text-xs tracking-wider uppercase transition shadow-lg shadow-orange-500/20 cursor-pointer flex items-center justify-center gap-2"
                        >
                          <span>Start Delivery & Broadcast GPS</span>
                          <span className="text-sm">🛵</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => completeTrip(orderId)}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold py-3.5 rounded-2xl text-xs tracking-wider uppercase transition shadow-lg shadow-emerald-600/20 cursor-pointer flex items-center justify-center gap-2"
                        >
                          <span>Mark Tiffin as Delivered</span>
                          <span className="text-sm">✓</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}