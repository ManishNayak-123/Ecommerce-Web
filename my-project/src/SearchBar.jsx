
import React, { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router";

export default function SearchBar({ products = [], onSearch }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("search") || "";
  
  const [query, setQuery] = useState(initialQuery);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef(null);

  // Filter products based on user query within the context of your tiffin store
  const filteredProducts = query.trim()
    ? products.filter((item) => {
        const title = item.title || item.name || "";
        const desc = item.description || item.desc || "";
        return (
          title.toLowerCase().includes(query.toLowerCase()) ||
          desc.toLowerCase().includes(query.toLowerCase())
        );
      }).slice(0, 5) // Limit dropdown suggestions to top 5 matches
    : [
        // Default trending or popular tiffin suggestions when input is empty
        { id: "1", name: "Healthy Veg Tiffin", price: "₹99" },
        { id: "2", name: "Protein Rich Meal Box", price: "₹149" },
        { id: "3", name: "Home Style Special Dinner", price: "₹129" },
        { id: "4", name: "Monthly Subscription Plans", price: "Save 20%" },
      ];

  // Handle outside click to close suggestions dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    // Update URL search parameter (Enables shareable, SEO-friendly search states)
    setSearchParams({ search: trimmedQuery });
    if (onSearch) onSearch(trimmedQuery);
    setIsFocused(false);
  };

  const handleSelectSuggestion = (itemName) => {
    setQuery(itemName);
    setSearchParams({ search: itemName });
    setIsFocused(false);
    if (onSearch) onSearch(itemName);
  };

  const handleClear = () => {
    setQuery("");
    setSearchParams({});
    if (onSearch) onSearch("");
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto z-30 font-sans">
      {/* Search Input Form - Kept as a single horizontal row across mobile and desktop */}
      <form
        onSubmit={handleSubmit}
        className={`bg-white/95 backdrop-blur-md p-1.5 sm:p-2 rounded-full flex flex-row items-center w-full shadow-2xl border transition-all duration-300 ${
          isFocused ? "border-orange-500 ring-4 ring-orange-500/20" : "border-white/20"
        }`}
      >
        {/* Input & Search Icon */}
        <div className="flex items-center w-full px-3 sm:px-4 py-1">
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 shrink-0 mr-2 sm:mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>

          <input
            type="text"
            placeholder="Search healthy tiffins, meal plans..."
            value={query}
            onFocus={() => setIsFocused(true)}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsFocused(true);
            }}
            className="w-full bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none text-sm sm:text-lg font-medium"
          />

          {/* Clear button */}
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 p-1 text-xs font-bold rounded-full mr-2 cursor-pointer shrink-0"
            >
              ✕
            </button>
          )}
        </div>

        {/* Submit Button - Compact icon on mobile, full button on sm+ screens */}
        <button
          type="submit"
          className="bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold px-4 sm:px-8 py-2.5 sm:py-3.5 rounded-full transition-all duration-300 whitespace-nowrap text-sm sm:text-base shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <span className="hidden sm:inline">Search</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </form>

      {/* Live Contextual Suggestions Dropdown */}
      {isFocused && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
          <div className="p-3 text-xs font-bold text-gray-400 uppercase tracking-wider bg-slate-50 border-b border-gray-100">
            {query.trim() ? "Matching Tiffin Meals" : "Popular Tiffin Searches 🍲"}
          </div>

          {filteredProducts.length === 0 ? (
            <div className="p-4 text-sm text-gray-500 text-center">
              No tiffin meals found matching "{query}"
            </div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {filteredProducts.map((item, idx) => {
                const itemName = item.title || item.name;
                const itemPrice = item.price ? (typeof item.price === "number" ? `₹${item.price}` : item.price) : "";

                return (
                  <li key={item.id || item._id || idx}>
                    <button
                      type="button"
                      onClick={() => handleSelectSuggestion(itemName)}
                      className="w-full text-left px-5 py-3 text-gray-700 hover:bg-orange-50/80 hover:text-orange-600 font-medium text-sm transition flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-3 truncate">
                        <span className="text-orange-500 text-xs">🍲</span>
                        <span className="truncate">{itemName}</span>
                      </div>
                      {itemPrice && (
                        <span className="text-xs font-bold bg-orange-100 text-orange-700 px-2.5 py-1 rounded-full shrink-0">
                          {itemPrice}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}