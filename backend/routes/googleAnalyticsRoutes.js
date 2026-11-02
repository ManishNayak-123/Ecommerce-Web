// routes/analyticsRoutes.js
import express from 'express';
import { isAuthenticated } from '../middleware/authMiddleware.js';
import { getAdminAnalytics } from '../controllers/googleAnalytics.js';
const analyticsRouter = express.Router();


// GET: /api/admin/analytics
analyticsRouter.get('/google_analytics', getAdminAnalytics,isAuthenticated);

export default analyticsRouter;