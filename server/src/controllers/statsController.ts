import { Request, Response, NextFunction } from 'express';
import { Device } from '../models/Device.js';
import { Category } from '../models/Category.js';
import { User } from '../models/User.js';

export const getPlatformStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const [
      totalUsers,
      totalDevices,
      publishedDevices,
      totalCategories,
      recentDevices,
      popularDevices,
    ] = await Promise.all([
      User.countDocuments(),
      Device.countDocuments(),
      Device.countDocuments({ published: true }),
      Category.countDocuments(),
      Device.find().sort({ createdAt: -1 }).limit(5).populate('category', 'name slug'),
      Device.find({ published: true }).sort({ viewsCount: -1 }).limit(5).populate('category', 'name slug'),
    ]);

    // Aggregate protocols
    const protocolCounts = await Device.aggregate([
      { $unwind: '$communicationProtocols' },
      { $group: { _id: '$communicationProtocols', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]);

    // Aggregate difficulty
    const difficultyCounts = await Device.aggregate([
      { $group: { _id: '$difficultyLevel', count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalDevices,
          publishedDevices,
          draftDevices: totalDevices - publishedDevices,
          totalCategories,
        },
        protocolCounts: protocolCounts.map((p) => ({ protocol: p._id, count: p.count })),
        difficultyCounts: difficultyCounts.map((d) => ({ level: d._id, count: d.count })),
        recentDevices,
        popularDevices,
      },
    });
  } catch (error) {
    next(error);
  }
};
