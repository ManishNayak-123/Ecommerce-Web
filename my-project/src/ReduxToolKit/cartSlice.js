

// import { createSlice } from "@reduxjs/toolkit";

// // Helper function to load cart from localStorage safely
// const loadCartFromStorage = () => {
//   try {
//     const savedCart = localStorage.getItem("cart_items");
//     if (savedCart) {
//       const items = JSON.parse(savedCart);
//       const totalCount = items.reduce((total, item) => total + item.quantity, 0);
//       return { items, totalCount };
//     }
//   } catch (error) {
//     console.error("Failed to load cart from localStorage:", error);
//   }
//   return { items: [], totalCount: 0 };
// };

// // Helper function to save cart to localStorage
// const saveCartToStorage = (items) => {
//   try {
//     localStorage.setItem("cart_items", JSON.stringify(items));
//   } catch (error) {
//     console.error("Failed to save cart to localStorage:", error);
//   }
// };

// const initialState = loadCartFromStorage();

// const cartSlice = createSlice({
//   name: "cart",
//   initialState,
//   reducers: {
//     addToCart: (state, action) => {
//       const payload = action.payload;
      
//       // 🛠️ FIX: Support both MongoDB '_id' and frontend 'id' so items don't conflict
//       const itemId = payload.id || payload._id;

//       // Check if this specific item already exists in the cart list
//       const existingItem = state.items.find(
//         (item) => item.id === itemId || item._id === itemId
//       );

//       if (existingItem) {
//         // If it's the exact same item, increase its quantity
//         existingItem.quantity += 1;
//       } else {
//         // If it's a different item, push it as a brand new entry in the list
//         state.items.push({ 
//           ...payload, 
//           id: itemId, // Normalize ID
//           image: payload.image || "", // Ensure image string is preserved
//           quantity: 1 
//         });
//       }

//       // Re-calculate total count and sync with localStorage
//       state.totalCount = state.items.reduce((total, item) => total + item.quantity, 0);
//       saveCartToStorage(state.items);
//     },

//     updateQuantity: (state, action) => {
//       const { id, quantity } = action.payload;
//       const item = state.items.find((item) => item.id === id || item._id === id);
      
//       if (item && quantity > 0) {
//         item.quantity = quantity;
//       }
      
//       state.totalCount = state.items.reduce((total, item) => total + item.quantity, 0);
//       saveCartToStorage(state.items);
//     },

//     removeFromCart: (state, action) => {
//       const targetId = action.payload;
//       state.items = state.items.filter((item) => item.id !== targetId && item._id !== targetId);
//       state.totalCount = state.items.reduce((total, item) => total + item.quantity, 0);
//       saveCartToStorage(state.items);
//     },

//     clearCart: (state) => {
//       state.items = [];
//       state.totalCount = 0;
//       localStorage.removeItem("cart_items");
//     }
//   },
// });

// export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions;
// export default cartSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const loadCartFromStorage = () => {
  try {
    const savedCart = localStorage.getItem("cart_items");
    if (savedCart) {
      const items = JSON.parse(savedCart);
      const totalCount = items.reduce((total, item) => total + item.quantity, 0);
      return { items, totalCount };
    }
  } catch (error) {
    console.error("Failed to load cart from localStorage:", error);
  }
  return { items: [], totalCount: 0 };
};

const saveCartToStorage = (items) => {
  try {
    localStorage.setItem("cart_items", JSON.stringify(items));
  } catch (error) {
    console.error("Failed to save cart to localStorage:", error);
  }
};

const initialState = loadCartFromStorage();

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const payload = action.payload;
      const itemId = payload.id || payload._id;

      const existingItem = state.items.find(
        (item) => item.id === itemId || item._id === itemId
      );

      if (existingItem) {
        existingItem.quantity += 1;
        // Keep image updated if modified
        if (payload.image) existingItem.image = payload.image;
      } else {
        state.items.push({ 
          ...payload, 
          id: itemId, 
          image: payload.image || "", 
          quantity: 1 
        });
      }

      state.totalCount = state.items.reduce((total, item) => total + item.quantity, 0);
      saveCartToStorage(state.items);
    },

    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id || item._id === id);
      
      if (item && quantity > 0) {
        item.quantity = quantity;
      }
      
      state.totalCount = state.items.reduce((total, item) => total + item.quantity, 0);
      saveCartToStorage(state.items);
    },

    removeFromCart: (state, action) => {
      const targetId = action.payload;
      state.items = state.items.filter((item) => item.id !== targetId && item._id !== targetId);
      state.totalCount = state.items.reduce((total, item) => total + item.quantity, 0);
      saveCartToStorage(state.items);
    },

    clearCart: (state) => {
      state.items = [];
      state.totalCount = 0;
      localStorage.removeItem("cart_items");
    }
  },
});

export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;