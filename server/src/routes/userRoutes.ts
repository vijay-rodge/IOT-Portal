import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  getBookmarks,
  addBookmark,
  removeBookmark,
  getRecentlyViewed,
  addRecentlyViewed,
  getAllUsers,
  updateUserRole,
  deleteUser,
} from '../controllers/userController.js';
import { authenticateJWT, requireRole } from '../middleware/auth.js';
import { UserRole } from '../models/User.js';

const router = Router();

// Authenticated user routes
router.use(authenticateJWT);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// Bookmarks
router.get('/bookmarks', getBookmarks);
router.post('/bookmarks/:deviceId', addBookmark);
router.delete('/bookmarks/:deviceId', removeBookmark);

// Recently Viewed
router.get('/recently-viewed', getRecentlyViewed);
router.post('/recently-viewed/:deviceId', addRecentlyViewed);

// Admin-only user management routes
router.get('/admin/all', requireRole(UserRole.ADMIN), getAllUsers);
router.put('/admin/:id/role', requireRole(UserRole.ADMIN), updateUserRole);
router.delete('/admin/:id', requireRole(UserRole.ADMIN), deleteUser);

export default router;
