
import React, { useState, useRef } from "react";
import AdminHeader from "./AdminHeader";
import Footer from "../Footer";
import axios from "axios";
import { FOOD_API_END_POINT } from "../Utils/Api";

export default function UploadFood() {
  const fileInputRef = useRef(null);
  
  // Updated state including prepTime, rating, and reviews alongside the food model fields
  const [formData, setFormData] = useState({
    title: "",
    category: "North Indian",
    type: "veg",
    price: "",
    calories: "500 kcal",
    prepTime: "20-25 min",
    rating: "4.8",
    reviews: 15,
    image: null,
    description: "",
    isPopular: false,
  });

  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file.');
        return;
      }
      
      setFormData((prev) => ({ ...prev, image: file }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");

    if (!formData.image) {
        alert("Please upload a product image.");
        setLoading(false);
        return;
    }

    try {
      const dataToSend = new FormData();
      dataToSend.append("title", formData.title);
      dataToSend.append("category", formData.category);
      dataToSend.append("type", formData.type);
      dataToSend.append("price", formData.price);
      dataToSend.append("calories", formData.calories);
      dataToSend.append("prepTime", formData.prepTime);
      dataToSend.append("rating", formData.rating);
      dataToSend.append("reviews", formData.reviews);
      dataToSend.append("image", formData.image);
      dataToSend.append("description", formData.description);
      dataToSend.append("isPopular", formData.isPopular);

      const token = localStorage.getItem("token");

      const response = await axios.post(`${FOOD_API_END_POINT}/upload`, dataToSend, {
        headers: { 
          "Content-Type": "multipart/form-data",
          ...(token && { Authorization: `Bearer ${token}` })
        },
      });

      if (response.data.success) {
        setSuccessMessage(`${formData.title} has been successfully published to your menu! 🎉`);

        setFormData({
          title: "",
          category: "North Indian",
          type: "veg",
          price: "",
          calories: "500 kcal",
          prepTime: "20-25 min",
          rating: "4.8",
          reviews: 15,
          image: null,
          description: "",
          isPopular: false,
        });
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error uploading food:", error);
      alert(error.response?.data?.message || "Failed to upload food item. Check connection.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "w-full px-5 py-3.5 border border-slate-200 rounded-xl text-sm bg-white hover:border-orange-300 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all duration-300 font-medium text-slate-800";
  const labelStyle = "block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2.5 ml-1";

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900 pt-28 flex flex-col justify-between font-sans">
      <AdminHeader />

      <main className="max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex-grow">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-100 text-orange-600 font-bold text-xs rounded-full uppercase tracking-wider mb-3 shadow-sm border border-orange-200">
            Admin Kitchen Portal 🛡️
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tighter">
            Craft a New Dish
          </h1>
          <p className="text-slate-500 text-sm sm:text-base max-w-lg mx-auto font-medium mt-2">
            Add items here so they instantly populate the live user meals page.
          </p>
        </div>

        {successMessage && (
          <div className="mb-8 p-5 bg-green-50 border-l-4 border-green-500 text-green-800 rounded-xl text-sm font-semibold shadow-lg flex items-center gap-3">
            <span>🎉</span> {successMessage}
          </div>
        )}

        <div className="bg-white rounded-[2rem] sm:rounded-[3rem] border border-slate-100 p-8 sm:p-12 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label htmlFor="title" className={labelStyle}>
                Meal / Dish Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                placeholder="e.g. Healthy Veg Tiffin"
                value={formData.title}
                onChange={handleChange}
                className={inputStyle}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className={labelStyle}>
                  Menu Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`${inputStyle} appearance-none cursor-pointer font-bold text-slate-800`}
                >
                  <option value="North Indian">North Indian</option>
                  <option value="South Indian">South Indian</option>
                  <option value="Fitness Special">Fitness Special</option>
                </select>
              </div>

              <div>
                <label htmlFor="type" className={labelStyle}>
                  Diet Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className={`${inputStyle} appearance-none cursor-pointer font-bold text-slate-800`}
                >
                  <option value="veg">🟢 Veg</option>
                  <option value="non-veg">🔴 Non-Veg</option>
                </select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="price" className={labelStyle}>
                  Price (₹)
                </label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">₹</span>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        required
                        placeholder="99"
                        value={formData.price}
                        onChange={handleChange}
                        className={`${inputStyle} pl-10`}
                    />
                </div>
              </div>

              <div>
                <label htmlFor="calories" className={labelStyle}>
                  Calories / Energy
                </label>
                <input
                  type="text"
                  id="calories"
                  name="calories"
                  required
                  placeholder="e.g. 520 kcal"
                  value={formData.calories}
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>
            </div>

            {/* Extra Fields Group: Prep Time, Rating, and Reviews */}
            <div className="grid sm:grid-cols-3 gap-6">
              <div>
                <label htmlFor="prepTime" className={labelStyle}>
                  Estimated Prep Time
                </label>
                <input
                  type="text"
                  id="prepTime"
                  name="prepTime"
                  placeholder="e.g. 20-25 min"
                  value={formData.prepTime}
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>

              <div>
                <label htmlFor="rating" className={labelStyle}>
                  Initial Rating
                </label>
                <input
                  type="text"
                  id="rating"
                  name="rating"
                  placeholder="e.g. 4.8"
                  value={formData.rating}
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>

              <div>
                <label htmlFor="reviews" className={labelStyle}>
                  Initial Reviews Count
                </label>
                <input
                  type="number"
                  id="reviews"
                  name="reviews"
                  placeholder="15"
                  value={formData.reviews}
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 items-end">
              <div className="relative flex items-center group bg-slate-50 border border-slate-200 rounded-xl p-4 cursor-pointer hover:border-orange-200 transition-colors">
                <input
                  type="checkbox"
                  id="isPopular"
                  name="isPopular"
                  checked={formData.isPopular}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[22px] after:left-[18px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                <label htmlFor="isPopular" className="ml-4 text-sm font-bold text-slate-700 select-none cursor-pointer">
                  Mark as Bestseller / Popular 🔥
                </label>
              </div>
            </div>

            <div>
              <label className={labelStyle}>
                Food Image
              </label>
              
              {!previewUrl ? (
                  <div 
                    className="relative group border-4 border-dashed border-slate-200 hover:border-orange-300 rounded-3xl p-10 flex flex-col items-center justify-center gap-4 text-center cursor-pointer transition-all bg-slate-50 hover:bg-orange-50/50"
                    onClick={() => fileInputRef.current.click()}
                  >
                    <div className="p-4 bg-white rounded-full shadow-md text-orange-500 group-hover:scale-110 transition-transform">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                        </svg>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-800">Click to upload food image</p>
                        <p className="text-xs font-medium text-slate-500">PNG, JPG or WEBP</p>
                    </div>
                  </div>
              ) : (
                  <div className="relative rounded-3xl overflow-hidden border border-slate-200 group shadow-inner">
                      <img 
                        src={previewUrl} 
                        alt="Food preview" 
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            type="button"
                            onClick={removeImage}
                            className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-xs font-bold hover:bg-white/40 transition-colors"
                          >
                            Remove & Change
                          </button>
                      </div>
                  </div>
              )}

              <input
                type="file"
                id="image"
                name="image"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileChange}
                className="sr-only"
              />
            </div>

            <div>
              <label htmlFor="description" className={labelStyle}>
                Dish Description / Ingredients Included
              </label>
              <textarea
                id="description"
                name="description"
                rows="4"
                required
                placeholder="e.g. 3 Roti, Rice, Daal, Seasonal Veg, Salad, and Pickle..."
                value={formData.description}
                onChange={handleChange}
                className={`${inputStyle} resize-none leading-relaxed`}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-5 rounded-2xl bg-slate-950 hover:bg-orange-600 active:scale-[0.98] text-white font-extrabold text-base shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {loading ? "Publishing to Menu..." : "Upload Food Item 🚀"}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}