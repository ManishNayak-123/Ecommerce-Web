
import express from "express";
import upload from "../middleware/multer.js";
import { uploadFood, getFoods } from "../controllers/foodController.js";

const foodRouter = express.Router();

foodRouter.post("/upload", upload.single("image"), uploadFood);
foodRouter.get("/all", getFoods);

export default foodRouter;