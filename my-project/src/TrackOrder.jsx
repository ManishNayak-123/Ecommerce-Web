

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { ORDER_API_END_POINT } from "./Utils/Api";
import axios from "axios";
import { io } from "socket.io-client";

// Connect to your backend Socket.io server
const socket = io("https://ecommerce-web-g9rx.onrender.com");

export default function TrackOrder() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [driverLocation, setDriverLocation] = useState(null);

  useEffect(() => {
    const fetchOrderStatus = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to track your order.");
        navigate("/login");
        return;
      }

      try {
        let endpoint = `${ORDER_API_END_POINT}/order-status/${orderId}`;
        
        if (!orderId) {
          endpoint = `${ORDER_API_END_POINT}/all-orders`;
        }

        const response = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        if (response.data && response.data.success) {
          if (!orderId) {
            const allOrders = response.data.orders || [];
            if (allOrders.length > 0) {
              setOrder(allOrders[0]);
            }
          } else {
            setOrder(response.data.order);
          }
        }
      } catch (error) {
        console.error("Track order network error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderStatus();

    const interval = setInterval(() => {
      fetchOrderStatus();
    }, 10000);

    return () => clearInterval(interval);
  }, [orderId, navigate]);

  // Socket.io Live GPS & Status Tracking Listener
  useEffect(() => {
    const targetOrderId = orderId || order?._id;
    if (!targetOrderId) return;

    // Join the specific order room on the server
    socket.emit("join-order", targetOrderId);

    // Listen for live coordinate broadcasts from driver
    socket.on("receive-location", (data) => {
      if (data.orderId === targetOrderId) {
        setDriverLocation({ lat: data.lat, lng: data.lng });
      }
    });

    // ⚡ INSTANT LIVE STATUS LISTENER: Updates UI immediately when driver clicks Delivered
    socket.on("order-status-updated", (data) => {
      if (data.orderId === targetOrderId) {
        setOrder((prevOrder) => {
          if (!prevOrder) return prevOrder;
          return {
            ...prevOrder,
            orderStatus: data.orderStatus,
          };
        });
      }
    });

    return () => {
      socket.off("receive-location");
      socket.off("order-status-updated");
    };
  }, [orderId, order?._id]);

  const steps = [
    { step: 1, label: "Order Placed", desc: "We have received your order", icon: "📝" },
    { step: 2, label: "Preparing", desc: "Chef is packing your fresh homemade tiffin", icon: "🍳" },
    { step: 3, label: "Out for Delivery", desc: "Rider is heading to your location", icon: "🚴‍♂️" },
    { step: 4, label: "Delivered", desc: "Enjoy your fresh warm meal!", icon: "🎁" }
  ];

  const getStatusStepNumber = (status) => {
    switch (status) {
      case "Order Placed": return 1;
      case "Preparing": return 2;
      case "Out for Delivery": return 3;
      case "Delivered": return 4;
      default: return 1;
    }
  };

  const currentStep = order ? getStatusStepNumber(order.orderStatus) : 1;

  const getProgressBarWidth = () => {
    if (currentStep === 1) return "0%";
    if (currentStep === 2) return "33%";
    if (currentStep === 3) return "66%";
    return "100%";
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-slate-50 text-slate-900 pt-28 flex flex-col justify-between font-sans">
        <Navbar />
        <main className="max-w-4xl w-full mx-auto p-8 flex-grow flex items-center justify-center">
          <div className="text-slate-400 font-bold text-lg animate-pulse">Loading live tracking details...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen w-full bg-slate-50 text-slate-900 pt-28 flex flex-col justify-between font-sans">
        <Navbar />
        <main className="max-w-4xl w-full mx-auto p-8 flex-grow text-center space-y-4">
          <h2 className="text-xl font-black text-slate-800">Order Not Found</h2>
          <p className="text-slate-500 text-sm">We couldn't find any recent orders to track.</p>
          <button onClick={() => navigate("/")} className="px-6 py-2.5 bg-orange-500 text-white font-bold rounded-xl">
            Back to Home
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900 pt-28 flex flex-col justify-between font-sans selection:bg-orange-500 selection:text-white">
      <Navbar />

      <main className="max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex-grow animate-fadeIn">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200/80 pb-6 mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-600 font-bold text-xs rounded-full uppercase tracking-wider mb-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              Live Tracking System
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Track Your Tiffin Order
            </h1>
            <p className="text-sm text-slate-500 font-medium mt-1">
              Order ID: <span className="text-slate-800 font-bold font-mono text-xs">{order._id}</span> • Placed on {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl px-5 py-3 shadow-sm flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-orange-500 animate-pulse"></div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Current Status</span>
              <span className="text-sm font-extrabold text-slate-800">
                {order.orderStatus}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-950 to-slate-900 rounded-[2.5rem] p-6 sm:p-8 text-white shadow-xl shadow-slate-950/10 mb-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="grid sm:grid-cols-2 gap-6 relative z-10 items-center">
            <div>
              <span className="text-xs font-bold text-orange-400 uppercase tracking-widest block mb-1">Order Status</span>
              <div className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-1">
                {order.orderStatus === "Delivered" ? "Delivered Successfully 🎉" : order.orderStatus}
              </div>
              <p className="text-xs text-slate-400 font-medium mt-2">
                {order.orderStatus === "Delivered" ? "Hope you enjoy your meal!" : "Your food is being prepared & handled with care."}
              </p>

              {driverLocation && order.orderStatus === "Out for Delivery" && (
                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold rounded-xl animate-pulse">
                  <span>📍 Driver GPS Connected:</span>
                  <span className="font-mono">{driverLocation.lat.toFixed(4)}, {driverLocation.lng.toFixed(4)}</span>
                </div>
              )}
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <span className="text-xs font-bold text-orange-300 uppercase tracking-wider block mb-1">Delivery Address</span>
              <p className="text-sm font-medium text-slate-200 leading-snug">
                {order.deliveryAddress?.houseNo}, {order.deliveryAddress?.street}, {order.deliveryAddress?.city}, {order.deliveryAddress?.state} - {order.deliveryAddress?.pincode}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-6 sm:p-10 shadow-sm mb-8">
          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-0">
            <div className="hidden md:block absolute top-[24px] left-[8%] right-[8%] h-1.5 bg-slate-100 z-0 rounded-full">
              <div 
                className="h-full bg-orange-500 rounded-full transition-all duration-700 ease-out shadow-sm" 
                style={{ width: getProgressBarWidth() }}
              />
            </div>

            {steps.map((item) => {
              const isCompleted = currentStep >= item.step;
              const isCurrent = currentStep === item.step;

              return (
                <div 
                  key={item.step} 
                  className="relative z-10 flex flex-row md:flex-col items-center gap-4 md:gap-3 w-full md:text-center group"
                >
                  <div 
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-md border-2 transition-all duration-500 ${
                      isCompleted 
                        ? "bg-orange-500 border-orange-500 text-white shadow-orange-500/30 scale-105" 
                        : "bg-slate-50 border-slate-200 text-slate-400"
                    } ${isCurrent ? "ring-4 ring-orange-500/20 animate-bounce" : ""}`}
                  >
                    <span>{item.icon}</span>
                  </div>

                  <div className="flex flex-col md:items-center">
                    <h3 className={`font-extrabold text-sm sm:text-base transition-colors ${isCompleted ? "text-slate-900" : "text-slate-400"}`}>
                      {item.label}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium max-w-[160px] md:mx-auto mt-0.5 leading-snug">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-6 sm:p-8 shadow-sm">
          <h2 className="text-base sm:text-lg font-black text-slate-900 border-b border-slate-100 pb-4 mb-6 flex items-center justify-between">
            <span>Items Purchased in this Order</span>
            <span className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
              {order.items?.length || 0} {order.items?.length === 1 ? 'Item' : 'Items'}
            </span>
          </h2>
          
          <div className="space-y-4">
            {order.items?.map((item, index) => (
              <div key={index} className="flex justify-between items-center bg-slate-50/70 p-4 rounded-2xl border border-slate-100 hover:border-slate-200 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-white border border-slate-200 shrink-0 shadow-sm flex items-center justify-center text-2xl">
                    🍲
                  </div>
                  <div>
                    <h4 className="font-black text-sm sm:text-base text-slate-900">{item.name}</h4>
                    <p className="text-xs font-bold text-slate-400 mt-0.5">Quantity: <span className="text-slate-700">{item.quantity}</span></p>
                  </div>
                </div>
                <span className="font-extrabold text-slate-900 text-sm sm:text-base pr-2 bg-white px-3 py-1.5 rounded-xl border border-slate-100 shadow-sm">
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center font-black text-base sm:text-lg">
            <span className="text-slate-600">Total Amount Paid</span>
            <span className="text-orange-600">₹{order.totalAmount}</span>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}