// import React, { useEffect, useRef, useState } from "react";
// import { useDispatch } from "react-redux";
// import { addToCart } from "./ReduxToolKit/cartSlice.js";
// import axios from "axios";
// import { FOOD_API_END_POINT } from "./Utils/Api";
// import toast from "react-hot-toast";

// // Derive backend host origin from FOOD_API_END_POINT safely
// const BACKEND_HOST = FOOD_API_END_POINT
//   ? FOOD_API_END_POINT.replace(/\/api\/v1\/.*$/, "").replace(/\/+$/, "")
//   : "";

// // Enhanced helper function to accurately pull the uploaded image from various database schemas
// function resolveFoodImage(item, index = 0) {
//   // Check all possible ways an image could be nested or named in your database model
//   const imageVal =
//     item?.image?.url ||
//     item?.image?.secure_url ||
//     item?.image?.path ||
//     (typeof item?.image === "string" ? item.image : null) ||
//     item?.imageUrl ||
//     item?.imgUrl ||
//     item?.photo ||
//     item?.img ||
//     item?.avatar ||
//     item?.foodImage;

//   if (typeof imageVal !== "string" || !imageVal.trim()) {
//     // Fallback only if no image exists in the database record
//     const fallbacks = [
//       "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=300&auto=format&fit=crop",
//       "https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=300&auto=format&fit=crop",
//       "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=300&auto=format&fit=crop",
//       "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=300&auto=format&fit=crop",
//     ];
//     return fallbacks[index % fallbacks.length];
//   }

//   const trimmed = imageVal.trim();

//   // If it's already a full web URL or base64 string, return it directly
//   if (
//     trimmed.startsWith("http://") ||
//     trimmed.startsWith("https://") ||
//     trimmed.startsWith("data:image/")
//   ) {
//     return trimmed;
//   }

//   // Otherwise, prefix it with your backend host URL for local uploads (e.g., multer/uploads folder)
//   const normalized = trimmed.replace(/\\/g, "/").replace(/^\/+/, "");
//   return `${BACKEND_HOST}/${normalized}`;
// }

// export default function TiffinAppDownloadBanner({ onScrollToMeals }) {
//   const dispatch = useDispatch();
//   const phoneSectionRef = useRef(null);
//   const [phoneInView, setPhoneInView] = useState(false);
//   const [highlightPhone, setHighlightPhone] = useState(false);
//   const [meals, setMeals] = useState([]);
//   const [loadingMeals, setLoadingMeals] = useState(true);

//   // Intersection Observer for phone slide-up animation
//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setPhoneInView(true);
//         }
//       },
//       { threshold: 0.2 }
//     );

//     if (phoneSectionRef.current) {
//       observer.observe(phoneSectionRef.current);
//     }

//     return () => {
//       if (phoneSectionRef.current) {
//         observer.unobserve(phoneSectionRef.current);
//       }
//     };
//   }, []);

//   // Fetch meals from backend API
//   useEffect(() => {
//     const fetchMealsFromBackend = async () => {
//       try {
//         setLoadingMeals(true);
//         const response = await axios.get(`${FOOD_API_END_POINT}/all`);

//         const fetchedData =
//           Array.isArray(response.data) ? response.data :
//           Array.isArray(response.data?.foods) ? response.data.foods :
//           Array.isArray(response.data?.meals) ? response.data.meals :
//           Array.isArray(response.data?.foodItems) ? response.data.foodItems :
//           Array.isArray(response.data?.data) ? response.data.data : [];

//         setMeals(fetchedData);
//       } catch (error) {
//         console.error("Failed to load backend meals:", error);
//         setMeals([
//           {
//             _id: "1",
//             title: "Healthy Veg Tiffin",
//             price: 99,
//             description: "Fresh chapatis, seasonal sabzi, dal tadka, and steamed rice.",
//           },
//           {
//             _id: "2",
//             title: "Protein Rich Meal Box",
//             price: 149,
//             description: "High protein paneer/chicken curry, sprouts salad, and curd.",
//           },
//           {
//             _id: "3",
//             title: "Home Style Special Dinner",
//             price: 129,
//             description: "Comforting dinner thali with special dal makhani and dessert.",
//           },
//           {
//             _id: "4",
//             title: "South Indian Thali",
//             price: 119,
//             description: "Idly, sambar, coconut chutney, and crispy vada.",
//           },
//         ]);
//       } finally {
//         setLoadingMeals(false);
//       }
//     };

//     fetchMealsFromBackend();
//   }, []);

//   return (
//     <section
//       ref={phoneSectionRef}
//       id="app-pricing-phone"
//       className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-zinc-900 to-orange-950 py-20 px-6 sm:px-12 text-white rounded-t-[3.5rem] rounded-b-[3rem] my-16 max-w-7xl mx-auto shadow-2xl border-t-4 border-orange-500 scroll-mt-24"
//     >
//       <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
//       <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

//       <div className="relative z-10 grid lg:grid-cols-12 gap-12 items-center">
//         {/* Left Call to Action */}
//         <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
//           <span className="inline-block px-4 py-1.5 bg-orange-500/20 text-orange-400 border border-orange-500/30 font-extrabold text-xs rounded-full uppercase tracking-widest">
//             📱 Get The TiffinBox App
//           </span>
//           <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
//             Better tiffin experience, <br />
//             <span className="text-orange-500">on your phone</span>
//           </h2>
//           <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
//             Scan the QR code or download our mobile app to browse backend menu pricing and instantly add items to your cart.
//           </p>

//           <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
//             <div className="bg-white p-3 rounded-2xl shadow-xl flex items-center gap-3">
//               <div className="w-16 h-16 bg-slate-900 rounded-lg flex items-center justify-center text-white text-[10px] font-bold text-center p-1">
//                 [ QR CODE ]
//               </div>
//               <div className="text-left text-slate-900 pr-2">
//                 <p className="text-xs text-slate-500 font-bold uppercase">Simple Scan</p>
//                 <p className="text-sm font-black">Download App</p>
//                 <p className="text-xs text-orange-600 font-bold">Free iOS & Android</p>
//               </div>
//             </div>

//             <div className="flex flex-col gap-2">
//               <button className="bg-black border border-white/20 hover:bg-white/10 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition flex items-center gap-3">
//                 <span></span> App Store
//               </button>
//               <button className="bg-black border border-white/20 hover:bg-white/10 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition flex items-center gap-3">
//                 <span>▶</span> Google Play
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Right Column: Phone Mockup */}
//         <div className="lg:col-span-5 flex justify-center relative">
//           <div
//             className={`w-72 sm:w-80 h-[520px] bg-slate-950 rounded-[3rem] border-8 border-slate-800 shadow-2xl p-4 relative overflow-hidden transition-all duration-1000 transform ${
//               phoneInView ? "translate-y-0 opacity-100 scale-100" : "translate-y-24 opacity-0 scale-95"
//             } ${highlightPhone ? "ring-4 ring-orange-500 ring-offset-4 ring-offset-slate-900" : ""}`}
//           >
//             {/* Speaker Notch */}
//             <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-4 bg-slate-800 rounded-full z-20" />

//             {/* Mobile Screen */}
//             <div className="w-full h-full bg-slate-900 rounded-[2.2rem] pt-8 px-3 flex flex-col justify-between text-left overflow-y-auto custom-scrollbar relative">
//               <div className="space-y-3 pb-12">
//                 <div className="flex items-center justify-between border-b border-slate-800 pb-2">
//                   <span className="text-xs font-bold text-orange-400">TiffinBox Live Cart 🛒</span>
//                   <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">Backend Sync</span>
//                 </div>

//                 <p className="text-[11px] font-semibold text-slate-400">Tap `+` to add meal to your cart:</p>

//                 {loadingMeals ? (
//                   <div className="flex justify-center items-center py-16">
//                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
//                   </div>
//                 ) : meals.length === 0 ? (
//                   <p className="text-xs text-slate-500 text-center py-10">No items available from database.</p>
//                 ) : (
//                   <div className="space-y-2.5">
//                     {meals.map((meal, index) => {
//                       const mealId = meal._id || meal.id;
//                       const mealTitle = meal.title || meal.name || meal.foodName || "Delicious Tiffin";
//                       const rawPrice = meal.price !== undefined ? meal.price : 99;
//                       const mealPrice = typeof rawPrice === "number" ? `₹${rawPrice}` : rawPrice;
//                       const mealImage = resolveFoodImage(meal, index);

//                       return (
//                         <div
//                           key={mealId || index}
//                           className="bg-slate-800/90 border border-slate-700/80 p-2.5 rounded-2xl flex items-center justify-between shadow-md"
//                         >
//                           <div className="flex items-center gap-2.5 overflow-hidden">
//                             <img
//                               src={mealImage}
//                               alt={mealTitle}
//                               onError={(e) => {
//                                 e.target.onerror = null;
//                                 e.target.src = "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=300&auto=format&fit=crop";
//                               }}
//                               className="w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-700"
//                             />
//                             <div className="truncate pr-1">
//                               <p className="text-xs font-bold text-white truncate">{mealTitle}</p>
//                               <p className="text-[10px] font-extrabold text-orange-400">{mealPrice} <span className="text-slate-400 font-normal">/ meal</span></p>
//                             </div>
//                           </div>

//                           <button
//                             type="button"
//                             onClick={() => {
//                               dispatch(addToCart({ id: mealId, title: mealTitle, price: mealPrice, image: mealImage }));
//                               toast.success(`${mealTitle} added to cart!`);
//                             }}
//                             className="bg-orange-500 hover:bg-orange-600 active:scale-95 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 shadow transition cursor-pointer"
//                             title="Add to cart"
//                           >
//                             +
//                           </button>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 )}
//               </div>

//               {/* Down Arrow Button */}
//               {meals.length >= 3 && (
//                 <div className="absolute bottom-2 left-0 right-0 flex justify-center pb-1 bg-gradient-to-t from-slate-900 via-slate-900/90 to-transparent pt-4 pointer-events-auto">
//                   <button
//                     type="button"
//                     onClick={onScrollToMeals}
//                     className="bg-orange-500 hover:bg-orange-600 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-xl animate-bounce-arrow transition cursor-pointer"
//                     title="View all meals"
//                   >
//                     ↓
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "./ReduxToolKit/cartSlice.js";
import axios from "axios";
import { FOOD_API_END_POINT } from "./Utils/Api";
import toast from "react-hot-toast";

// Derive backend host origin from FOOD_API_END_POINT safely
const BACKEND_HOST = FOOD_API_END_POINT
  ? FOOD_API_END_POINT.replace(/\/api\/v1\/.*$/, "").replace(/\/+$/, "")
  : "";

// Enhanced helper function to accurately pull the uploaded image from various database schemas
function resolveFoodImage(item, index = 0) {
  const imageVal =
    item?.image?.url ||
    item?.image?.secure_url ||
    item?.image?.path ||
    (typeof item?.image === "string" ? item.image : null) ||
    item?.imageUrl ||
    item?.imgUrl ||
    item?.photo ||
    item?.img ||
    item?.avatar ||
    item?.foodImage;

  if (typeof imageVal !== "string" || !imageVal.trim()) {
    const fallbacks = [
      "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=300&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=300&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=300&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=300&auto=format&fit=crop",
    ];
    return fallbacks[index % fallbacks.length];
  }

  const trimmed = imageVal.trim();

  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:image/")
  ) {
    return trimmed;
  }

  const normalized = trimmed.replace(/\\/g, "/").replace(/^\/+/, "");
  return `${BACKEND_HOST}/${normalized}`;
}

export default function TiffinAppDownloadBanner({ onScrollToMeals }) {
  const dispatch = useDispatch();
  const phoneSectionRef = useRef(null);
  const [phoneInView, setPhoneInView] = useState(false);
  const [highlightPhone, setHighlightPhone] = useState(false);
  const [meals, setMeals] = useState([]);
  const [loadingMeals, setLoadingMeals] = useState(true);

  // Intersection Observer for phone slide-up animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPhoneInView(true);
        }
      },
      { threshold: 0.2 }
    );

    if (phoneSectionRef.current) {
      observer.observe(phoneSectionRef.current);
    }

    return () => {
      if (phoneSectionRef.current) {
        observer.unobserve(phoneSectionRef.current);
      }
    };
  }, []);

  // Fetch meals from backend API
  useEffect(() => {
    const fetchMealsFromBackend = async () => {
      try {
        setLoadingMeals(true);
        const response = await axios.get(`${FOOD_API_END_POINT}/all`);

        const fetchedData =
          Array.isArray(response.data) ? response.data :
          Array.isArray(response.data?.foods) ? response.data.foods :
          Array.isArray(response.data?.meals) ? response.data.meals :
          Array.isArray(response.data?.foodItems) ? response.data.foodItems :
          Array.isArray(response.data?.data) ? response.data.data : [];

        setMeals(fetchedData);
      } catch (error) {
        console.error("Failed to load backend meals:", error);
        setMeals([
          {
            _id: "1",
            title: "Healthy Veg Tiffin",
            price: 99,
            description: "Fresh chapatis, seasonal sabzi, dal tadka, and steamed rice.",
          },
          {
            _id: "2",
            title: "Protein Rich Meal Box",
            price: 149,
            description: "High protein paneer/chicken curry, sprouts salad, and curd.",
          },
          {
            _id: "3",
            title: "Home Style Special Dinner",
            price: 129,
            description: "Comforting dinner thali with special dal makhani and dessert.",
          },
          {
            _id: "4",
            title: "South Indian Thali",
            price: 119,
            description: "Idly, sambar, coconut chutney, and crispy vada.",
          },
        ]);
      } finally {
        setLoadingMeals(false);
      }
    };

    fetchMealsFromBackend();
  }, []);

  // Handler to check authentication before adding to cart
  const handleAddToCart = (mealId, mealTitle, mealPrice, mealImage) => {
    // Check if user is registered/logged in (adjust key name depending on your project setup, e.g., token, user, etc.)
    const token = localStorage.getItem("token") || localStorage.getItem("user");

    if (!token) {
      toast.error("Please login or register first to add items!");
      // Redirect user to your login route (modify '/login' to match your router path)
      window.location.href = "/login"; 
      return;
    }

    // If authenticated, proceed with adding to cart
    dispatch(addToCart({ id: mealId, title: mealTitle, price: mealPrice, image: mealImage }));
    toast.success(`${mealTitle} added to cart!`);
  };

  return (
    <section
      ref={phoneSectionRef}
      id="app-pricing-phone"
      className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-zinc-900 to-orange-950 py-20 px-6 sm:px-12 text-white rounded-t-[3.5rem] rounded-b-[3rem] my-16 max-w-7xl mx-auto shadow-2xl border-t-4 border-orange-500 scroll-mt-24"
    >
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid lg:grid-cols-12 gap-12 items-center">
        {/* Left Call to Action */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          <span className="inline-block px-4 py-1.5 bg-orange-500/20 text-orange-400 border border-orange-500/30 font-extrabold text-xs rounded-full uppercase tracking-widest">
            📱 Get The TiffinBox App
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Better tiffin experience, <br />
            <span className="text-orange-500">on your phone</span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Scan the QR code or download our mobile app to browse backend menu pricing and instantly add items to your cart.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
            <div className="bg-white p-3 rounded-2xl shadow-xl flex items-center gap-3">
              <div className="w-16 h-16 bg-slate-900 rounded-lg flex items-center justify-center text-white text-[10px] font-bold text-center p-1">
                [ QR CODE ]
              </div>
              <div className="text-left text-slate-900 pr-2">
                <p className="text-xs text-slate-500 font-bold uppercase">Simple Scan</p>
                <p className="text-sm font-black">Download App</p>
                <p className="text-xs text-orange-600 font-bold">Free iOS & Android</p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button className="bg-black border border-white/20 hover:bg-white/10 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition flex items-center gap-3">
                <span></span> App Store
              </button>
              <button className="bg-black border border-white/20 hover:bg-white/10 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition flex items-center gap-3">
                <span>▶</span> Google Play
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Phone Mockup */}
        <div className="lg:col-span-5 flex justify-center relative">
          <div
            className={`w-72 sm:w-80 h-[520px] bg-slate-950 rounded-[3rem] border-8 border-slate-800 shadow-2xl p-4 relative overflow-hidden transition-all duration-1000 transform ${
              phoneInView ? "translate-y-0 opacity-100 scale-100" : "translate-y-24 opacity-0 scale-95"
            } ${highlightPhone ? "ring-4 ring-orange-500 ring-offset-4 ring-offset-slate-900" : ""}`}
          >
            {/* Speaker Notch */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-4 bg-slate-800 rounded-full z-20" />

            {/* Mobile Screen */}
            <div className="w-full h-full bg-slate-900 rounded-[2.2rem] pt-8 px-3 flex flex-col justify-between text-left overflow-y-auto custom-scrollbar relative">
              <div className="space-y-3 pb-12">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-bold text-orange-400">TiffinBox Live Cart 🛒</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">Backend Sync</span>
                </div>

                <p className="text-[11px] font-semibold text-slate-400">Tap `+` to add meal to your cart:</p>

                {loadingMeals ? (
                  <div className="flex justify-center items-center py-16">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
                  </div>
                ) : meals.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-10">No items available from database.</p>
                ) : (
                  <div className="space-y-2.5">
                    {meals.map((meal, index) => {
                      const mealId = meal._id || meal.id;
                      const mealTitle = meal.title || meal.name || meal.foodName || "Delicious Tiffin";
                      const rawPrice = meal.price !== undefined ? meal.price : 99;
                      const mealPrice = typeof rawPrice === "number" ? `₹${rawPrice}` : rawPrice;
                      const mealImage = resolveFoodImage(meal, index);

                      return (
                        <div
                          key={mealId || index}
                          className="bg-slate-800/90 border border-slate-700/80 p-2.5 rounded-2xl flex items-center justify-between shadow-md"
                        >
                          <div className="flex items-center gap-2.5 overflow-hidden">
                            <img
                              src={mealImage}
                              alt={mealTitle}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=300&auto=format&fit=crop";
                              }}
                              className="w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-700"
                            />
                            <div className="truncate pr-1">
                              <p className="text-xs font-bold text-white truncate">{mealTitle}</p>
                              <p className="text-[10px] font-extrabold text-orange-400">{mealPrice} <span className="text-slate-400 font-normal">/ meal</span></p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleAddToCart(mealId, mealTitle, mealPrice, mealImage)}
                            className="bg-orange-500 hover:bg-orange-600 active:scale-95 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 shadow transition cursor-pointer"
                            title="Add to cart"
                          >
                            +
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Down Arrow Button */}
              {meals.length >= 3 && (
                <div className="absolute bottom-2 left-0 right-0 flex justify-center pb-1 bg-gradient-to-t from-slate-900 via-slate-900/90 to-transparent pt-4 pointer-events-auto">
                  <button
                    type="button"
                    onClick={onScrollToMeals}
                    className="bg-orange-500 hover:bg-orange-600 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-xl animate-bounce-arrow transition cursor-pointer"
                    title="View all meals"
                  >
                    ↓
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}