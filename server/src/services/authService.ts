import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { User, IUser, UserRole, AuthProvider } from '../models/User.js';
import { RefreshToken } from '../models/RefreshToken.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { AppError } from '../middleware/errorHandler.js';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileImage?: string;
  authProvider: AuthProvider;
  isVerified: boolean;
  bookmarksCount: number;
}

export const formatUserResponse = (user: IUser): UserResponse => {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    profileImage: user.profileImage,
    authProvider: user.authProvider,
    isVerified: user.isVerified,
    bookmarksCount: user.bookmarks ? user.bookmarks.length : 0,
  };
};

export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
}): Promise<{ user: UserResponse; tokens: AuthTokens }> => {
  const normalizedEmail = data.email.toLowerCase().trim();

  // Check duplicate
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw new AppError('An account with this email address already exists.', 409);
  }

  // Hash password
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(data.password, salt);

  const newUser = await User.create({
    name: data.name.trim(),
    email: normalizedEmail,
    passwordHash,
    authProvider: AuthProvider.LOCAL,
    role: UserRole.USER,
    isVerified: true, // Mark verified for ease of educational portal
  });

  const tokenPayload = {
    userId: newUser._id.toString(),
    email: newUser.email,
    role: newUser.role,
  };

  const accessToken = signAccessToken(tokenPayload);
  const refreshToken = signRefreshToken(tokenPayload);

  // Store refresh token in DB (valid for 7 days)
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await RefreshToken.create({
    token: refreshToken,
    user: newUser._id,
    expiresAt,
  });

  return {
    user: formatUserResponse(newUser),
    tokens: { accessToken, refreshToken },
  };
};

export const loginUser = async (data: {
  email: string;
  password: string;
}): Promise<{ user: UserResponse; tokens: AuthTokens }> => {
  const normalizedEmail = data.email.toLowerCase().trim();

  // Explicitly select passwordHash
  const user = await User.findOne({ email: normalizedEmail }).select('+passwordHash');
  if (!user) {
    throw new AppError('Invalid email or password.', 401);
  }

  if (user.authProvider === AuthProvider.GOOGLE && !user.passwordHash) {
    throw new AppError('This account was created with Google. Please continue with Google.', 400);
  }

  const isMatch = await user.comparePassword(data.password);
  if (!isMatch) {
    throw new AppError('Invalid email or password.', 401);
  }

  const tokenPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  const accessToken = signAccessToken(tokenPayload);
  const refreshToken = signRefreshToken(tokenPayload);

  // Store refresh token
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

export const refreshSession = async (
  currentRefreshToken: string
): Promise<{ accessToken: string; newRefreshToken: string; user: UserResponse }> => {
  if (!currentRefreshToken) {
    throw new AppError('Refresh token is required.', 401);
  }

  // Verify JWT signature & expiration
  let payload;
  try {
    payload = verifyRefreshToken(currentRefreshToken);
  } catch (error) {
    throw new AppError('Invalid or expired refresh token.', 401);
  }

  // Check if token exists in DB
  const storedToken = await RefreshToken.findOne({ token: currentRefreshToken });
  if (!storedToken) {
    // Possible token reuse attack - delete all tokens for this user for security
    await RefreshToken.deleteMany({ user: payload.userId });
    throw new AppError('Invalid refresh session. Please log in again.', 401);
  }

  // Delete old refresh token (rotation)
  await RefreshToken.deleteOne({ _id: storedToken._id });

  const user = await User.findById(payload.userId);
  if (!user) {
    throw new AppError('User not found.', 404);
  }

  const tokenPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  const newAccessToken = signAccessToken(tokenPayload);
  const newRefreshToken = signRefreshToken(tokenPayload);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await RefreshToken.create({
    token: newRefreshToken,
    user: user._id,
    expiresAt,
  });

  return {
    accessToken: newAccessToken,
    newRefreshToken,
    user: formatUserResponse(user),
  };
};

export const logoutUser = async (refreshToken?: string): Promise<void> => {
  if (refreshToken) {
    await RefreshToken.deleteOne({ token: refreshToken });
  }
};

export const requestPasswordReset = async (email: string): Promise<string> => {
  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) {
    // Return dummy token so we don't leak user existence
    return 'instructions-sent';
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

  user.resetPasswordToken = tokenHash;
  user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  await user.save();

  // In production, an email would be sent. For this educational application, return the reset token
  return resetToken;
};

export const resetPasswordWithToken = async (
  rawToken: string,
  newPassword: string
): Promise<void> => {
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: tokenHash,
    resetPasswordExpires: { $gt: new Date() },
  });

  if (!user) {
    throw new AppError('Password reset token is invalid or has expired.', 400);
  }

  const salt = await bcrypt.genSalt(12);
  user.passwordHash = await bcrypt.hash(newPassword, salt);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  // Invalidate any active refresh tokens for security
  await RefreshToken.deleteMany({ user: user._id });
};
