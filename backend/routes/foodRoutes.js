
import express from "express";
// import upload from "../middleware/multer.js";
import { uploadFood, getFoods } from "../controllers/foodController.js";
import uploadCloud from "../middleware/multer.js";

const foodRouter = express.Router();

foodRouter.post("/upload", uploadCloud.single("image"), uploadFood);
foodRouter.get("/all", getFoods);

export default foodRouter;