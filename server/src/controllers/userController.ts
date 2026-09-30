import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { User, UserRole } from '../models/User.js';
import { Device } from '../models/Device.js';
import { AppError } from '../middleware/errorHandler.js';
import { formatUserResponse } from '../services/authService.js';

// Get Current User Profile
export const getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.user!.userId);
    if (!user) {
      throw new AppError('User not found.', 404);
    }

    res.status(200).json({
      success: true,
      data: { user: formatUserResponse(user) },
    });
  } catch (error) {
    next(error);
  }
};

// Update Profile
export const updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, profileImage } = req.body;
    const user = await User.findById(req.user!.userId);
    if (!user) {
      throw new AppError('User not found.', 404);
    }

    if (name) user.name = name.trim();
    if (profileImage !== undefined) user.profileImage = profileImage;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      data: { user: formatUserResponse(user) },
    });
  } catch (error) {
    next(error);
  }
};

// Get User Bookmarks
export const getBookmarks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.user!.userId).populate({
      path: 'bookmarks',
      populate: { path: 'category', select: 'name slug' },
    });

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    res.status(200).json({
      success: true,
      data: {
        bookmarks: user.bookmarks || [],
      },
    });
  } catch (error) {
    next(error);
  }
};

// Add Bookmark
export const addBookmark = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const deviceId = req.params.deviceId as string;

    if (!mongoose.Types.ObjectId.isValid(deviceId)) {
      throw new AppError('Invalid device ID.', 400);
    }

    const device = await Device.findById(deviceId);
    if (!device) {
      throw new AppError('Device not found.', 404);
    }

    const user = await User.findById(req.user!.userId);
    if (!user) {
      throw new AppError('User not found.', 404);
    }

    const idObj = new mongoose.Types.ObjectId(deviceId);
    if (!user.bookmarks.some((b) => b.toString() === deviceId)) {
      user.bookmarks.push(idObj);
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: 'Device bookmarked successfully.',
      data: { bookmarksCount: user.bookmarks.length },
    });
  } catch (error) {
    next(error);
  }
};

// Remove Bookmark
export const removeBookmark = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { deviceId } = req.params;

    const user = await User.findById(req.user!.userId);
    if (!user) {
      throw new AppError('User not found.', 404);
    }

    user.bookmarks = user.bookmarks.filter((b) => b.toString() !== deviceId);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Bookmark removed successfully.',
      data: { bookmarksCount: user.bookmarks.length },
    });
  } catch (error) {
    next(error);
  }
};

// Get Recently Viewed Devices
export const getRecentlyViewed = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.user!.userId).populate({
      path: 'recentlyViewed.device',
      populate: { path: 'category', select: 'name slug' },
    });

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    // Filter out null devices if any was deleted, and sort by most recent
    const validRecent = (user.recentlyViewed || [])
      .filter((item) => item.device !== null && item.device !== undefined)
      .sort((a, b) => new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime());

    res.status(200).json({
      success: true,
      data: {
        recentlyViewed: validRecent,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Add to Recently Viewed
export const addRecentlyViewed = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const deviceId = req.params.deviceId as string;

    if (!mongoose.Types.ObjectId.isValid(deviceId)) {
      throw new AppError('Invalid device ID.', 400);
    }

    const user = await User.findById(req.user!.userId);
    if (!user) {
      throw new AppError('User not found.', 404);
    }

    // Filter out any existing entry for this device
    const filtered = (user.recentlyViewed || []).filter(
      (item) => item.device.toString() !== deviceId
    );

    // Prepend new view at the beginning
    filtered.unshift({
      device: new mongoose.Types.ObjectId(deviceId),
      viewedAt: new Date(),
    });

    // Cap at 20 devices as required in Section 16
    user.recentlyViewed = filtered.slice(0, 20);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Recorded recently viewed device.',
    });
  } catch (error) {
    next(error);
  }
};

// Admin: List all users
export const getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 20;
    const search = (req.query.search as string) || '';

    const filter: any = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: {
        users: users.map(formatUserResponse),
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Update user role
export const updateUserRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!Object.values(UserRole).includes(role)) {
      throw new AppError('Invalid role specified.', 400);
    }

    const user = await User.findById(id);
    if (!user) {
      throw new AppError('User not found.', 404);
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User role updated to ${role}.`,
      data: { user: formatUserResponse(user) },
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Delete user
export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    // Prevent deleting self
    if (req.user?.userId === id) {
      throw new AppError('You cannot delete your own admin account.', 400);
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      throw new AppError('User not found.', 404);
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
