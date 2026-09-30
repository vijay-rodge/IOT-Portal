import { Router } from 'express';
import {
  getAllCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { authenticateJWT, requireRole } from '../middleware/auth.js';
import { UserRole } from '../models/User.js';
import { validate } from '../middleware/validate.js';
import { createCategorySchema, updateCategorySchema } from '../validators/categoryValidator.js';

const router = Router();

// Public routes
router.get('/', getAllCategories);
router.get('/:slug', getCategoryBySlug);

// Admin routes
router.post(
  '/',
  authenticateJWT,
  requireRole(UserRole.ADMIN),
  validate(createCategorySchema),
  createCategory
);

router.put(
  '/:id',
  authenticateJWT,
  requireRole(UserRole.ADMIN),
  validate(updateCategorySchema),
  updateCategory
);

router.delete(
  '/:id',
  authenticateJWT,
  requireRole(UserRole.ADMIN),
  deleteCategory
);

export default router;
