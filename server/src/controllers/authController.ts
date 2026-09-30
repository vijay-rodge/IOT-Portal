import { Request, Response, NextFunction } from 'express';
import {
  registerUser,
  loginUser,
  refreshSession,
  logoutUser,
  requestPasswordReset,
  resetPasswordWithToken,
  formatUserResponse,
} from '../services/authService.js';
import {
  getGoogleAuthUrl,
  handleGoogleAuthCodeCallback,
  verifyGoogleIdTokenAndLogin,
} from '../services/googleAuthService.js';
import { User } from '../models/User.js';
import { ENV } from '../config/env.js';

const REFRESH_COOKIE_NAME = 'iot_portal_refresh_token';

const setRefreshTokenCookie = (res: Response, token: string): void => {
  res.cookie(REFRESH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: ENV.NODE_ENV === 'production',
    sameSite: ENV.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  });
};

const clearRefreshTokenCookie = (res: Response): void => {
  res.clearCookie(REFRESH_COOKIE_NAME, {
    httpOnly: true,
    secure: ENV.NODE_ENV === 'production',
    sameSite: ENV.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
  });
};

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { user, tokens } = await registerUser(req.body);
    setRefreshTokenCookie(res, tokens.refreshToken);

    res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to IoT Knowledge Portal.',
      data: {
        user,
        accessToken: tokens.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { user, tokens } = await loginUser(req.body);
    setRefreshTokenCookie(res, tokens.refreshToken);

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: {
        user,
        accessToken: tokens.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.cookies[REFRESH_COOKIE_NAME] || req.body.refreshToken;

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'No refresh token provided.',
      });
      return;
    }

    const { accessToken, newRefreshToken, user } = await refreshSession(token);
    setRefreshTokenCookie(res, newRefreshToken);

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully.',
      data: {
        user,
        accessToken,
      },
    });
  } catch (error) {
    clearRefreshTokenCookie(res);
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.cookies[REFRESH_COOKIE_NAME] || req.body.refreshToken;
    await logoutUser(token);
    clearRefreshTokenCookie(res);

    res.status(200).json({
      success: true,
      message: 'Logged out successfully.',
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated.',
      });
      return;
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        user: formatUserResponse(user),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const googleAuthUrl = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const url = getGoogleAuthUrl();
    res.status(200).json({
      success: true,
      data: { url },
    });
  } catch (error) {
    next(error);
  }
};

export const googleCallback = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const code = req.query.code as string;
    if (!code) {
      res.redirect(`${ENV.CLIENT_URL}/login?error=Google_authentication_failed`);
      return;
    }

    const { tokens } = await handleGoogleAuthCodeCallback(code);
    setRefreshTokenCookie(res, tokens.refreshToken);

    // Redirect to frontend with token in fragment or query
    res.redirect(`${ENV.CLIENT_URL}/oauth/callback?token=${tokens.accessToken}`);
  } catch (error: any) {
    res.redirect(`${ENV.CLIENT_URL}/login?error=${encodeURIComponent(error.message || 'OAuth error')}`);
  }
};

export const googleVerifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { credential } = req.body;
    if (!credential) {
      res.status(400).json({
        success: false,
        message: 'Google credential token is required.',
      });
      return;
    }

    const { user, tokens } = await verifyGoogleIdTokenAndLogin(credential);
    setRefreshTokenCookie(res, tokens.refreshToken);

    res.status(200).json({
      success: true,
      message: 'Google authentication successful.',
      data: {
        user,
        accessToken: tokens.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const resetToken = await requestPasswordReset(req.body.email);

    res.status(200).json({
      success: true,
      message: 'If an account exists with this email, password reset instructions have been generated.',
      // For local testing convenience in development mode, provide the token:
      ...(ENV.NODE_ENV !== 'production' ? { devResetToken: resetToken } : {}),
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await resetPasswordWithToken(req.body.token, req.body.password);

    res.status(200).json({
      success: true,
      message: 'Password has been reset successfully. Please log in with your new password.',
    });
  } catch (error) {
    next(error);
  }
};
