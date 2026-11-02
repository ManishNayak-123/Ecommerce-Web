


// import React, { useState, useEffect } from "react";
// import Navbar from "./Navbar";
// import Footer from "./Footer";
// import { useDispatch, useSelector } from "react-redux"; // Added useSelector
// import { useNavigate } from "react-router"; // Added useNavigate
// import { addToCart } from "./ReduxToolKit/cartSlice";
// import axios from "axios";
// import { FOOD_API_END_POINT } from "./Utils/Api";

// const CATEGORIES = ["All", "North Indian", "South Indian", "Fitness Special"];
// const ITEMS_PER_PAGE = 9;

// // Helper function to correctly resolve backend dish images
// function resolveMealImage(meal) {
//   const imageVal =
//     meal?.image ||
//     meal?.imageUrl ||
//     meal?.photo ||
//     meal?.img ||
//     meal?.avatar;

//   if (typeof imageVal !== "string" || !imageVal.trim()) {
//     return "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop";
//   }

//   const trimmed = imageVal.trim();

//   if (
//     trimmed.startsWith("http://") ||
//     trimmed.startsWith("https://") ||
//     trimmed.startsWith("data:image/")
//   ) {
//     return trimmed;
//   }

//   const host = FOOD_API_END_POINT.replace(/\/api\/v1\/.*$/, "").replace(/\/+$/, "");
//   const normalized = trimmed.replace(/\\/g, "/").replace(/^\/+/, "");

//   return `${host}/uploads/${normalized}`;
// }

// export default function Meals() {
//   const [meals, setMeals] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeCategory, setActiveCategory] = useState("All");
//   const [dietFilter, setDietFilter] = useState("all");
//   const [currentPage, setCurrentPage] = useState(1);

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // 1. Get user authentication state from Redux (adjust path to match your store state key, e.g., state.auth.user)
//   const user = useSelector((state) => state.auth?.user || state.user?.user);

//   // 2. Add to Cart Handler with Auth Check
//   const handleAddToCart = (meal) => {
//     // Check Redux user state or localStorage token
//     const token = localStorage.getItem("token");

//     if (!user && !token) {
//       // Redirect to login form if user is not registered/logged in
//       navigate("/login");
//       return;
//     }

//     // Dispatch action if user is authenticated
//     dispatch(addToCart(meal));
//   };

//   // Fetch meals from backend
//   useEffect(() => {
//     const fetchMeals = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get(`${FOOD_API_END_POINT}/all`);

//         const fetchedData =
//           Array.isArray(response.data) ? response.data :
//           Array.isArray(response.data?.foods) ? response.data.foods :
//           Array.isArray(response.data?.meals) ? response.data.meals :
//           Array.isArray(response.data?.data) ? response.data.data : [];

//         setMeals(fetchedData);
//       } catch (error) {
//         console.error("Error fetching meals:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMeals();
//   }, []);

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [activeCategory, dietFilter]);

//   const filteredMeals = meals.filter((meal) => {
//     const matchesCategory =
//       activeCategory === "All" || meal.category === activeCategory;
//     const matchesDiet = dietFilter === "all" || meal.type === dietFilter;
//     return matchesCategory && matchesDiet;
//   });

//   const totalPages = Math.ceil(filteredMeals.length / ITEMS_PER_PAGE);
//   const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
//   const currentMeals = filteredMeals.slice(startIndex, startIndex + ITEMS_PER_PAGE);

//   return (
//     <div className="min-h-screen bg-orange-50/30 flex flex-col justify-between">
//       <div>
//         <Navbar />

//         <section className="py-12 px-4 sm:px-6 md:px-8 lg:px-16 max-w-7xl mx-auto w-full">
//           {/* Header & Filters */}
//           <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
//             <div>
//               <span className="text-orange-600 font-extrabold text-xs tracking-wider uppercase block mb-1">
//                 Our Menu Curations 🍲
//               </span>
//               <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
//                 Explore Popular <span className="text-orange-500">Meals</span>
//               </h2>
//               <p className="text-gray-500 text-xs sm:text-sm mt-1 max-w-lg">
//                 Freshly assembled home-style meals tailored to hit your nutrition benchmarks.
//               </p>
//             </div>

//             <div className="flex bg-white p-1 rounded-xl border border-gray-200/80 shadow-sm self-start md:self-auto shrink-0">
//               <button
//                 onClick={() => setDietFilter("all")}
//                 className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer ${
//                   dietFilter === "all"
//                     ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
//                     : "text-gray-600 hover:text-gray-900"
//                 }`}
//               >
//                 All Diets
//               </button>
//               <button
//                 onClick={() => setDietFilter("veg")}
//                 className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
//                   dietFilter === "veg"
//                     ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
//                     : "text-gray-600 hover:text-gray-900"
//                 }`}
//               >
//                 <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 border border-white" />
//                 Veg
//               </button>
//               <button
//                 onClick={() => setDietFilter("non-veg")}
//                 className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
//                   dietFilter === "non-veg"
//                     ? "bg-rose-600 text-white shadow-md shadow-rose-600/20"
//                     : "text-gray-600 hover:text-gray-900"
//                 }`}
//               >
//                 <span className="inline-block w-2 h-2 rounded-full bg-rose-400 border border-white" />
//                 Non-Veg
//               </button>
//             </div>
//           </div>

//           {/* Categories */}
//           <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
//             {CATEGORIES.map((cat) => (
//               <button
//                 key={cat}
//                 onClick={() => setActiveCategory(cat)}
//                 className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all duration-200 cursor-pointer ${
//                   activeCategory === cat
//                     ? "bg-gray-900 text-white shadow-md"
//                     : "bg-white text-gray-700 border border-gray-200 hover:bg-orange-100/50"
//                 }`}
//               >
//                 {cat}
//               </button>
//             ))}
//           </div>

//           {/* Loading / Cards Grid */}
//           {loading ? (
//             <div className="text-center py-20">
//               <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent" />
//               <p className="text-gray-500 mt-3 text-xs font-semibold">
//                 Loading delicious meals...
//               </p>
//             </div>
//           ) : filteredMeals.length > 0 ? (
//             <>
//               <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
//                 {currentMeals.map((meal) => {
//                   const mealId = meal._id || meal.id;
//                   const mealTitle = meal.title || meal.name;
//                   const mealPrice = meal.price;
//                   const mealImg = resolveMealImage(meal);

//                   return (
//                     <div
//                       key={mealId}
//                       className="bg-white rounded-2xl overflow-hidden border border-orange-100/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
//                     >
//                       <div className="overflow-hidden aspect-[16/10] relative w-full bg-gray-100">
//                         <img
//                           src={mealImg}
//                           alt={mealTitle}
//                           loading="lazy"
//                           onError={(e) => {
//                             e.target.onerror = null;
//                             e.target.src =
//                               "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop";
//                           }}
//                           className="h-full w-full object-cover group-hover:scale-105 transition duration-500 ease-out"
//                         />

//                         <div className="absolute top-3 left-3 right-3 flex justify-between items-center z-10">
//                           <div
//                             className={`p-1 bg-white/90 backdrop-blur-md rounded-md border flex items-center justify-center ${
//                               meal.type === "veg"
//                                 ? "border-emerald-500"
//                                 : "border-rose-500"
//                             }`}
//                           >
//                             <div
//                               className={`w-2.5 h-2.5 border flex items-center justify-center ${
//                                 meal.type === "veg"
//                                   ? "border-emerald-600"
//                                   : "border-rose-600"
//                               }`}
//                             >
//                               <div
//                                 className={`w-1 h-1 rounded-full ${
//                                   meal.type === "veg"
//                                     ? "bg-emerald-600"
//                                     : "bg-rose-600"
//                                 }`}
//                               />
//                             </div>
//                           </div>

//                           {meal.calories && (
//                             <span className="text-[10px] font-bold px-2.5 py-0.5 bg-black/70 backdrop-blur-md text-white rounded-full">
//                               ⚡ {meal.calories}
//                             </span>
//                           )}
//                         </div>
//                       </div>

//                       <div className="p-4 flex flex-col flex-grow justify-between">
//                         <div>
//                           <div className="flex items-center justify-between gap-2 mb-1.5">
//                             <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider bg-orange-50 px-2 py-0.5 rounded-md">
//                               {meal.category || "General"}
//                             </span>
//                             <div className="flex items-center gap-1 text-xs font-bold text-gray-800">
//                               <span className="text-amber-400">★</span>{" "}
//                               {meal.rating || "4.8"}
//                               <span className="text-gray-400 font-medium text-[10px]">
//                                 ({meal.reviews || 18})
//                               </span>
//                             </div>
//                           </div>

//                           <h3 className="text-base font-black text-gray-900 group-hover:text-orange-500 transition-colors line-clamp-1 mb-1">
//                             {mealTitle}
//                           </h3>

//                           <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-4">
//                             {meal.description ||
//                               "Freshly prepared home-style meal made with premium ingredients."}
//                           </p>
//                         </div>

//                         <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
//                           <div className="flex flex-col">
//                             <span className="text-[10px] text-gray-400 font-medium leading-none">
//                               Per Tiffin
//                             </span>
//                             <span className="text-lg font-black text-gray-900 tracking-tight">
//                               ₹{mealPrice}
//                             </span>
//                           </div>

//                           {/* Updated Add to Cart Button */}
//                           <button
//                             type="button"
//                             onClick={() => handleAddToCart(meal)}
//                             className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs tracking-wide transition transform active:scale-95 shadow-md shadow-orange-500/20 flex items-center gap-1.5 cursor-pointer"
//                           >
//                             <span>Add to Cart</span>
//                             <span className="text-sm font-black">+</span>
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>

//               {/* Pagination */}
//               {totalPages > 1 && (
//                 <div className="flex items-center justify-center gap-2 mt-10 pt-6 border-t border-gray-200/80">
//                   <button
//                     type="button"
//                     disabled={currentPage === 1}
//                     onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//                     className={`px-3.5 py-2 text-xs font-bold rounded-xl border transition cursor-pointer ${
//                       currentPage === 1
//                         ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
//                         : "bg-white text-gray-700 border-gray-300 hover:bg-orange-50 hover:border-orange-200"
//                     }`}
//                   >
//                     ← Prev
//                   </button>

//                   {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
//                     <button
//                       key={pageNum}
//                       type="button"
//                       onClick={() => setCurrentPage(pageNum)}
//                       className={`w-9 h-9 text-xs font-bold rounded-xl transition cursor-pointer ${
//                         currentPage === pageNum
//                           ? "bg-orange-500 text-white shadow-md shadow-orange-500/30"
//                           : "bg-white text-gray-700 border border-gray-200 hover:bg-orange-50"
//                       }`}
//                     >
//                       {pageNum}
//                     </button>
//                   ))}

//                   <button
//                     type="button"
//                     disabled={currentPage === totalPages}
//                     onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//                     className={`px-3.5 py-2 text-xs font-bold rounded-xl border transition cursor-pointer ${
//                       currentPage === totalPages
//                         ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
//                         : "bg-white text-gray-700 border-gray-300 hover:bg-orange-50 hover:border-orange-200"
//                     }`}
//                   >
//                     Next →
//                   </button>
//                 </div>
//               )}
//             </>
//           ) : (
//             <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8">
//               <div className="text-4xl mb-3">🍲</div>
//               <h3 className="text-lg font-bold text-gray-900 mb-1">
//                 No meals match your criteria
//               </h3>
//               <p className="text-gray-500 text-xs max-w-sm mx-auto">
//                 Try adjusting your cuisine categories or diet toggles to reveal our alternate tiffin packages.
//               </p>
//             </div>
//           )}
//         </section>
//       </div>

//       <Footer />
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { addToCart } from "./ReduxToolKit/cartSlice";
import axios from "axios";
import { FOOD_API_END_POINT } from "./Utils/Api";

const CATEGORIES = ["All", "North Indian", "South Indian", "Fitness Special"];
const ITEMS_PER_PAGE = 9;

// Helper function to correctly resolve backend dish images
function resolveMealImage(meal) {
  const imageVal =
    meal?.image ||
    meal?.imageUrl ||
    meal?.photo ||
    meal?.img ||
    meal?.avatar;

  if (typeof imageVal !== "string" || !imageVal.trim()) {
    return "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop";
  }

  const trimmed = imageVal.trim();

  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:image/")
  ) {
    return trimmed;
  }

  const host = FOOD_API_END_POINT.replace(/\/api\/v1\/.*$/, "").replace(/\/+$/, "");
  const normalized = trimmed.replace(/\\/g, "/").replace(/^\/+/, "");

  return `${host}/uploads/${normalized}`;
}

export default function Meals() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [dietFilter, setDietFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get user authentication state from Redux
  const user = useSelector((state) => state.auth?.user || state.user?.user);

  // Add to Cart Handler with Resolved Image URL
  const handleAddToCart = (meal) => {
    const token = localStorage.getItem("token");

    if (!user && !token) {
      navigate("/login");
      return;
    }

    // Ensure the cart receives the fully resolved image URL
    const resolvedImage = resolveMealImage(meal);
    const mealWithResolvedImage = {
      ...meal,
      image: resolvedImage,
    };

    dispatch(addToCart(mealWithResolvedImage));
  };

  // Fetch meals from backend
  useEffect(() => {
    const fetchMeals = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${FOOD_API_END_POINT}/all`);

        const fetchedData =
          Array.isArray(response.data) ? response.data :
          Array.isArray(response.data?.foods) ? response.data.foods :
          Array.isArray(response.data?.meals) ? response.data.meals :
          Array.isArray(response.data?.data) ? response.data.data : [];

        setMeals(fetchedData);
      } catch (error) {
        console.error("Error fetching meals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, dietFilter]);

  const filteredMeals = meals.filter((meal) => {
    const matchesCategory =
      activeCategory === "All" || meal.category === activeCategory;
    const matchesDiet = dietFilter === "all" || meal.type === dietFilter;
    return matchesCategory && matchesDiet;
  });

  const totalPages = Math.ceil(filteredMeals.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentMeals = filteredMeals.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-orange-50/30 flex flex-col justify-between">
      <div>
        <Navbar />

        <section className="py-12 px-4 sm:px-6 md:px-8 lg:px-16 max-w-7xl mx-auto w-full">
          {/* Header & Filters */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-orange-600 font-extrabold text-xs tracking-wider uppercase block mb-1">
                Our Menu Curations 🍲
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
                Explore Popular <span className="text-orange-500">Meals</span>
              </h2>
              <p className="text-gray-500 text-xs sm:text-sm mt-1 max-w-lg">
                Freshly assembled home-style meals tailored to hit your nutrition benchmarks.
              </p>
            </div>

            <div className="flex bg-white p-1 rounded-xl border border-gray-200/80 shadow-sm self-start md:self-auto shrink-0">
              <button
                onClick={() => setDietFilter("all")}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer ${
                  dietFilter === "all"
                    ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                All Diets
              </button>
              <button
                onClick={() => setDietFilter("veg")}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                  dietFilter === "veg"
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 border border-white" />
                Veg
              </button>
              <button
                onClick={() => setDietFilter("non-veg")}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                  dietFilter === "non-veg"
                    ? "bg-rose-600 text-white shadow-md shadow-rose-600/20"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <span className="inline-block w-2 h-2 rounded-full bg-rose-400 border border-white" />
                Non-Veg
              </button>
            </div>
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  activeCategory === cat
                    ? "bg-gray-900 text-white shadow-md"
                    : "bg-white text-gray-700 border border-gray-200 hover:bg-orange-100/50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Loading / Cards Grid */}
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent" />
              <p className="text-gray-500 mt-3 text-xs font-semibold">
                Loading delicious meals...
              </p>
            </div>
          ) : filteredMeals.length > 0 ? (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {currentMeals.map((meal) => {
                  const mealId = meal._id || meal.id;
                  const mealTitle = meal.title || meal.name;
                  const mealPrice = meal.price;
                  const mealImg = resolveMealImage(meal);

                  return (
                    <div
                      key={mealId}
                      className="bg-white rounded-2xl overflow-hidden border border-orange-100/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
                    >
                      <div className="overflow-hidden aspect-[16/10] relative w-full bg-gray-100">
                        <img
                          src={mealImg}
                          alt={mealTitle}
                          loading="lazy"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop";
                          }}
                          className="h-full w-full object-cover group-hover:scale-105 transition duration-500 ease-out"
                        />

                        <div className="absolute top-3 left-3 right-3 flex justify-between items-center z-10">
                          <div
                            className={`p-1 bg-white/90 backdrop-blur-md rounded-md border flex items-center justify-center ${
                              meal.type === "veg"
                                ? "border-emerald-500"
                                : "border-rose-500"
                            }`}
                          >
                            <div
                              className={`w-2.5 h-2.5 border flex items-center justify-center ${
                                meal.type === "veg"
                                  ? "border-emerald-600"
                                  : "border-rose-600"
                              }`}
                            >
                              <div
                                className={`w-1 h-1 rounded-full ${
                                  meal.type === "veg"
                                    ? "bg-emerald-600"
                                    : "bg-rose-600"
                                }`}
                              />
                            </div>
                          </div>

                          {meal.calories && (
                            <span className="text-[10px] font-bold px-2.5 py-0.5 bg-black/70 backdrop-blur-md text-white rounded-full">
                              ⚡ {meal.calories}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-4 flex flex-col flex-grow justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider bg-orange-50 px-2 py-0.5 rounded-md">
                              {meal.category || "General"}
                            </span>
                            <div className="flex items-center gap-1 text-xs font-bold text-gray-800">
                              <span className="text-amber-400">★</span>{" "}
                              {meal.rating || "4.8"}
                              <span className="text-gray-400 font-medium text-[10px]">
                                ({meal.reviews || 18})
                              </span>
                            </div>
                          </div>

                          <h3 className="text-base font-black text-gray-900 group-hover:text-orange-500 transition-colors line-clamp-1 mb-1">
                            {mealTitle}
                          </h3>

                          <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-4">
                            {meal.description ||
                              "Freshly prepared home-style meal made with premium ingredients."}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
                          <div className="flex flex-col">
                            <span className="text-[10px] text-gray-400 font-medium leading-none">
                              Per Tiffin
                            </span>
                            <span className="text-lg font-black text-gray-900 tracking-tight">
                              ₹{mealPrice}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleAddToCart(meal)}
                            className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs tracking-wide transition transform active:scale-95 shadow-md shadow-orange-500/20 flex items-center gap-1.5 cursor-pointer"
                          >
                            <span>Add to Cart</span>
                            <span className="text-sm font-black">+</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10 pt-6 border-t border-gray-200/80">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    className={`px-3.5 py-2 text-xs font-bold rounded-xl border transition cursor-pointer ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-orange-50 hover:border-orange-200"
                    }`}
                  >
                    ← Prev
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-9 h-9 text-xs font-bold rounded-xl transition cursor-pointer ${
                        currentPage === pageNum
                          ? "bg-orange-500 text-white shadow-md shadow-orange-500/30"
                          : "bg-white text-gray-700 border border-gray-200 hover:bg-orange-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    className={`px-3.5 py-2 text-xs font-bold rounded-xl border transition cursor-pointer ${
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-orange-50 hover:border-orange-200"
                    }`}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8">
              <div className="text-4xl mb-3">🍲</div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                No meals match your criteria
              </h3>
              <p className="text-gray-500 text-xs max-w-sm mx-auto">
                Try adjusting your cuisine categories or diet toggles to reveal our alternate tiffin packages.
              </p>
            </div>
          )}
        </section>
      </div>

      <Footer />
    </div>
  );
}