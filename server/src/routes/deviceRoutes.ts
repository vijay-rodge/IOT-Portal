import { Router } from 'express';
import {
  getDevices,
  searchDevices,
  getDeviceBySlug,
  getFeaturedDevices,
  createDevice,
  updateDevice,
  deleteDevice,
  togglePublishDevice,
} from '../controllers/deviceController.js';
import { authenticateJWT, optionalAuth, requireRole } from '../middleware/auth.js';
import { UserRole } from '../models/User.js';
import { validate } from '../middleware/validate.js';
import { createDeviceSchema, updateDeviceSchema } from '../validators/deviceValidator.js';

const router = Router();

// Public / optional auth routes
router.get('/', optionalAuth, getDevices);
router.get('/search', searchDevices);
router.get('/featured', getFeaturedDevices);
router.get('/:slug', optionalAuth, getDeviceBySlug);

// Admin-only routes
router.post(
  '/',
  authenticateJWT,
  requireRole(UserRole.ADMIN),
  validate(createDeviceSchema),
  createDevice
);

router.put(
  '/:id',
  authenticateJWT,
  requireRole(UserRole.ADMIN),
  validate(updateDeviceSchema),
  updateDevice
);

router.delete(
  '/:id',
  authenticateJWT,
  requireRole(UserRole.ADMIN),
  deleteDevice
);

router.patch(
  '/:id/publish',
  authenticateJWT,
  requireRole(UserRole.ADMIN),
  togglePublishDevice
);

export default router;
