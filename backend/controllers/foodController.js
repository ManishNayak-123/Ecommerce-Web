
// import Food from "../models/foodModel.js";

// export const uploadFood = async (req, res) => {
//   try {
//     const { title, category, type, price, calories, description, isPopular } = req.body;
    
//     const image = req.file ? req.file.filename : "";

//     if (!image) {
//       return res.status(400).json({ success: false, message: "Image upload failed or file missing." });
//     }

//     const newFood = new Food({
//       title,
//       category,
//       type,
//       price: Number(price),
//       calories,
//       image,
//       description,
//       isPopular: isPopular === "true" || isPopular === true,
//     });

//     await newFood.save();

//     res.status(201).json({ 
//       success: true, 
//       message: "Food item uploaded successfully!", 
//       food: newFood 
//     });
//   } catch (error) {
//     console.error("Upload food error:", error);
//     res.status(500).json({ success: false, message: error.message || "Internal server error during upload." });
//   }
// };

// export const getFoods = async (req, res) => {
//   try {
//     const foods = await Food.find().sort({ createdAt: -1 });
//     res.status(200).json({ success: true, foods });
//   } catch (error) {
//     console.error("Fetch foods error:", error);
//     res.status(500).json({ success: false, message: "Failed to fetch foods." });
//   }
// };

import Food from "../models/foodModel.js";

export const uploadFood = async (req, res) => {
  try {
    const { title, category, type, price, calories, description, isPopular, prepTime, rating, reviews } = req.body;
    
// 🛠️ FIX: Retrieve the Cloudinary secure URL from req.file.path or req.file.secure_url
    const image = req.file ? (req.file.path || req.file.secure_url) : "";

    if (!image) {
      return res.status(400).json({ success: false, message: "Image upload failed or file missing." });
    }

    const newFood = new Food({
      title,
      category,
      type,
      price: Number(price),
      calories,
      prepTime,
      rating: rating ? Number(rating) : 4.8,
      reviews: reviews ? Number(reviews) : 15,
      image, // Saves the complete Cloudinary URL directly to MongoDB
      description,
      isPopular: isPopular === "true" || isPopular === true,
    });

    await newFood.save();

    res.status(201).json({ 
      success: true, 
      message: "Food item uploaded successfully!", 
      food: newFood 
    });
  } catch (error) {
    console.error("Upload food error:", error);
    res.status(500).json({ success: false, message: error.message || "Internal server error during upload." });
  }
};

export const getFoods = async (req, res) => {
  try {
    const foods = await Food.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, foods });
  } catch (error) {
    console.error("Fetch foods error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch foods." });
  }
};