// routes/contactRoutes.js
import express from "express";
import { submitContactInquiry } from "../controllers/contactController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";
const contactRouter = express.Router();


// POST: /api/contact
contactRouter.post('/contact', submitContactInquiry,isAuthenticated);
export default contactRouter;
