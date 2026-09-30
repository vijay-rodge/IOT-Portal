import { Router } from 'express';
import { getPlatformStats } from '../controllers/statsController.js';
import { authenticateJWT, requireRole } from '../middleware/auth.js';
import { UserRole } from '../models/User.js';

const router = Router();

router.get('/overview', authenticateJWT, requireRole(UserRole.ADMIN), getPlatformStats);

export default router;
