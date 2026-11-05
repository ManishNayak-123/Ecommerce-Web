// // // Utils/Api.js
// // const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://ecommerce-web-g9rx.onrender.com";
// // export const USER_API_END_POINT = `${API_BASE_URL}/api/v1/user`;
// // export const FOOD_API_END_POINT = `${API_BASE_URL}/api/v1/food`;
// // export const ORDER_API_END_POINT = `${API_BASE_URL}/api/v1/payment`;
// // export const CONTACT_API_END_POINT = `${API_BASE_URL}/api/v1/info`;
// // export const ANALYTICS_API_END_POINT = `${API_BASE_URL}/api/v1/admin`;
// // export const DRIVER_API_END_POINT = `${API_BASE_URL}/api/v1/driver`;

// // Utils/Api.js
// const API_BASE_URL = 
//   import.meta.env.VITE_API_BASE_URL || 
//   (window.location.hostname === "localhost" 
//     ? "http://localhost:8000" 
//     : "https://ecommerce-web-3-py45.onrender.com");

// export const USER_API_END_POINT = `${API_BASE_URL}/api/v1/user`;
// export const FOOD_API_END_POINT = `${API_BASE_URL}/api/v1/food`;
// export const ORDER_API_END_POINT = `${API_BASE_URL}/api/v1/payment`;
// export const CONTACT_API_END_POINT = `${API_BASE_URL}/api/v1/info`;
// export const ANALYTICS_API_END_POINT = `${API_BASE_URL}/api/v1/admin`;
// export const DRIVER_API_END_POINT = `${API_BASE_URL}/api/v1/driver`;

// Utils/Api.js
const rawBaseUrl = 
  import.meta.env.VITE_API_BASE_URL || 
  (window.location.hostname === "localhost" 
    ? "http://localhost:8000" 
    : "https://ecommerce-web-3-py45.onrender.com");

// 🛠️ Automatically remove any trailing slash to prevent double-slash (//) routing bugs
const API_BASE_URL = rawBaseUrl.replace(/\/+$/, "");

export const USER_API_END_POINT = `${API_BASE_URL}/api/v1/user`;
export const FOOD_API_END_POINT = `${API_BASE_URL}/api/v1/food`;
export const ORDER_API_END_POINT = `${API_BASE_URL}/api/v1/payment`;
export const CONTACT_API_END_POINT = `${API_BASE_URL}/api/v1/info`;
export const ANALYTICS_API_END_POINT = `${API_BASE_URL}/api/v1/admin`;
export const DRIVER_API_END_POINT = `${API_BASE_URL}/api/v1/driver`;