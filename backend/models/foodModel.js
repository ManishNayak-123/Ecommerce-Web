
import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
  {
    
    title: { 
      type: String, 
      required: true, 
      trim: true 
    },
    category: { 
      type: String, 
      required: true, 
      enum: ["North Indian", "South Indian", "Fitness Special", "north indian", "south indian", "fitness special"] 
    },
    type: { 
      type: String, 
      required: true, 
      enum: ["veg", "non-veg"] 
    },
    price: { 
      type: Number, 
      required: true 
    },
    calories: { 
      type: String, 
      required: true 
    },
    image: { 
      type: String, 
      required: true 
    },
    description: { 
      type: String, 
      required: true 
    },
    rating: { 
      type: String,
      default: "4.8" 
    },
    reviews: { 
      type: Number, 
      default: 15 
    },
    isPopular: { 
      type: Boolean, 
      default: false 
    },
  },
  { timestamps: true }
);

const Food = mongoose.model("Food", foodSchema);
export default Food;
