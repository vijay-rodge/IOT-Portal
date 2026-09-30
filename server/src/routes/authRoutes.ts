import { Router } from 'express';
import {
  register,
  login,
  refresh,
  logout,
  getMe,
  googleAuthUrl,
  googleCallback,
  googleVerifyToken,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js';
import { authenticateJWT } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { validate } from '../middleware/validate.js';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  googleAuthSchema,
} from '../validators/authValidator.js';

const router = Router();

router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', authenticateJWT, getMe);

// Google OAuth
router.get('/google', googleAuthUrl);
router.get('/google/callback', googleCallback);
router.post('/google/token', validate(googleAuthSchema), googleVerifyToken);

// Password Reset
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', authLimiter, validate(resetPasswordSchema), resetPassword);

export default router;
