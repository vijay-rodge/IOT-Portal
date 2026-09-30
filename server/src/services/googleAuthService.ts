import { OAuth2Client } from 'google-auth-library';
import { ENV } from '../config/env.js';
import { User, UserRole, AuthProvider } from '../models/User.js';
import { RefreshToken } from '../models/RefreshToken.js';
import { signAccessToken, signRefreshToken } from '../utils/jwt.js';
import { AppError } from '../middleware/errorHandler.js';
import { formatUserResponse, UserResponse, AuthTokens } from './authService.js';

const client = new OAuth2Client(
  ENV.GOOGLE_CLIENT_ID,
  ENV.GOOGLE_CLIENT_SECRET,
  ENV.GOOGLE_CALLBACK_URL
);

export const getGoogleAuthUrl = (): string => {
  if (!ENV.GOOGLE_CLIENT_ID || !ENV.GOOGLE_CLIENT_SECRET) {
    throw new AppError(
      'Google OAuth is not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env',
      501
    );
  }

  return client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ],
  });
};

export const verifyGoogleIdTokenAndLogin = async (
  idToken: string
): Promise<{ user: UserResponse; tokens: AuthTokens }> => {
  if (!ENV.GOOGLE_CLIENT_ID) {
    throw new AppError('Google Client ID is not configured.', 500);
  }

  let payload;
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: ENV.GOOGLE_CLIENT_ID,
    });
    payload = ticket.getPayload();
  } catch (err: any) {
    throw new AppError(`Failed to verify Google token: ${err.message}`, 401);
  }

  if (!payload || !payload.email) {
    throw new AppError('Google authentication failed: missing email.', 400);
  }

  const email = payload.email.toLowerCase().trim();
  const googleId = payload.sub;
  const name = payload.name || payload.email.split('@')[0];
  const profileImage = payload.picture || '';

  let user = await User.findOne({
    $or: [{ googleId }, { email }],
  });

  if (user) {
    // If user existed with local auth, associate Google ID
    if (!user.googleId) {
      user.googleId = googleId;
      if (!user.profileImage && profileImage) {
        user.profileImage = profileImage;
      }
      await user.save();
    }
  } else {
    // Create new Google-authenticated user
    user = await User.create({
      name,
      email,
      googleId,
      profileImage,
      authProvider: AuthProvider.GOOGLE,
      role: UserRole.USER,
      isVerified: true,
    });
  }

  const tokenPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  const accessToken = signAccessToken(tokenPayload);
  const refreshToken = signRefreshToken(tokenPayload);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await RefreshToken.create({
    token: refreshToken,
    user: user._id,
    expiresAt,
  });

  return {
    user: formatUserResponse(user),
    tokens: { accessToken, refreshToken },
  };
};

export const handleGoogleAuthCodeCallback = async (
  code: string
): Promise<{ user: UserResponse; tokens: AuthTokens }> => {
  if (!ENV.GOOGLE_CLIENT_ID || !ENV.GOOGLE_CLIENT_SECRET) {
    throw new AppError('Google OAuth is not configured.', 500);
  }

  try {
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    if (!tokens.id_token) {
      throw new AppError('No ID token returned from Google.', 400);
    }

    return await verifyGoogleIdTokenAndLogin(tokens.id_token);
  } catch (error: any) {
    throw new AppError(`Google OAuth callback error: ${error.message}`, 400);
  }
};
