import { Router } from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import deviceRoutes from './deviceRoutes.js';
import statsRoutes from './statsRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/devices', deviceRoutes);
router.use('/stats', statsRoutes);

import mongoose from 'mongoose';

// Health check endpoint
router.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.status(200).json({
    status: 'healthy',
    database: dbStatus,
    databaseHost: mongoose.connection.host || 'none',
    timestamp: new Date().toISOString(),
    service: 'IoT Knowledge Portal API',
  });
});

export default router;
