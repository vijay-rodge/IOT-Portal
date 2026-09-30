import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Device, IDevice } from '../models/Device.js';
import { Category } from '../models/Category.js';
import { slugify } from '../utils/slugify.js';
import { AppError } from '../middleware/errorHandler.js';
import { UserRole } from '../models/User.js';

// Get devices with pagination and multi-filtering
export const getDevices = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string, 10) || 12));
    const skip = (page - 1) * limit;

    const {
      category,
      protocol,
      interface: iface,
      application,
      difficulty,
      manufacturer,
      tag,
      search,
      sort,
      includeUnpublished,
    } = req.query;

    const filter: any = {};

    // Published filter (only admins can view unpublished if requested)
    const isAdmin = req.user && req.user.role === UserRole.ADMIN;
    if (!isAdmin || includeUnpublished !== 'true') {
      filter.published = true;
    }

    // Category filter by slug or ObjectId
    if (category) {
      if (mongoose.Types.ObjectId.isValid(category as string)) {
        filter.category = new mongoose.Types.ObjectId(category as string);
      } else {
        const cat = await Category.findOne({ slug: category });
        if (cat) {
          filter.category = cat._id;
        } else {
          // If category not found, return empty results
          res.status(200).json({
            success: true,
            data: {
              devices: [],
              pagination: { total: 0, page, limit, totalPages: 0 },
            },
          });
          return;
        }
      }
    }

    // Communication protocol filter
    if (protocol) {
      filter.communicationProtocols = { $in: [new RegExp(`^${protocol}$`, 'i')] };
    }

    // Interface filter
    if (iface) {
      filter.interfaces = { $in: [new RegExp(`^${iface}$`, 'i')] };
    }

    // Application filter
    if (application) {
      filter.applications = { $in: [new RegExp(application as string, 'i')] };
    }

    // Difficulty filter
    if (difficulty) {
      filter.difficultyLevel = difficulty;
    }

    // Manufacturer filter
    if (manufacturer) {
      filter.manufacturer = { $regex: manufacturer as string, $options: 'i' };
    }

    // Tag filter
    if (tag) {
      filter.tags = { $in: [new RegExp(`^${tag}$`, 'i')] };
    }

    // Search query
    if (search && typeof search === 'string' && search.trim().length > 0) {
      const q = search.trim();
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { shortDescription: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } },
        { applications: { $in: [new RegExp(q, 'i')] } },
        { communicationProtocols: { $in: [new RegExp(q, 'i')] } },
        { manufacturer: { $regex: q, $options: 'i' } },
      ];
    }

    // Sorting
    let sortOptions: any = { createdAt: -1 };
    switch (sort) {
      case 'oldest':
        sortOptions = { createdAt: 1 };
        break;
      case 'name-asc':
        sortOptions = { name: 1 };
        break;
      case 'name-desc':
        sortOptions = { name: -1 };
        break;
      case 'views':
      case 'popular':
        sortOptions = { viewsCount: -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    const total = await Device.countDocuments(filter);
    const devices = await Device.find(filter)
      .populate('category', 'name slug icon')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean();

    res.status(200).json({
      success: true,
      data: {
        devices,
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

// Global Search with autocomplete / suggestions
export const searchDevices = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const q = (req.query.q as string || '').trim();

    if (!q) {
      res.status(200).json({
        success: true,
        data: { results: [], total: 0 },
      });
      return;
    }

    const filter: any = {
      published: true,
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { shortDescription: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } },
        { applications: { $in: [new RegExp(q, 'i')] } },
        { communicationProtocols: { $in: [new RegExp(q, 'i')] } },
        { manufacturer: { $regex: q, $options: 'i' } },
      ],
    };

    const results = await Device.find(filter)
      .populate('category', 'name slug icon')
      .select('name slug shortDescription category symbol tags difficultyLevel communicationProtocols voltage manufacturer')
      .limit(20)
      .lean();

    res.status(200).json({
      success: true,
      data: {
        results,
        total: results.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get single device by slug
export const getDeviceBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { slug } = req.params;

    const device = await Device.findOne({ slug })
      .populate('category', 'name slug icon description')
      .populate({
        path: 'relatedDevices',
        select: 'name slug shortDescription symbol difficultyLevel category communicationProtocols',
        populate: { path: 'category', select: 'name slug icon' },
      });

    if (!device) {
      throw new AppError('Device not found.', 404);
    }

    // Only allow admin to view unpublished device
    if (!device.published && (!req.user || req.user.role !== UserRole.ADMIN)) {
      throw new AppError('Device not found.', 404);
    }

    // Increment view count asynchronously
    Device.findByIdAndUpdate(device._id, { $inc: { viewsCount: 1 } }).exec();

    // If relatedDevices is empty, find 3 devices from same category
    let finalRelated = device.relatedDevices;
    if (!finalRelated || finalRelated.length === 0) {
      const autoRelated = await Device.find({
        category: (device.category as any)._id,
        _id: { $ne: device._id },
        published: true,
      })
        .limit(3)
        .populate('category', 'name slug icon')
        .select('name slug shortDescription symbol difficultyLevel category communicationProtocols')
        .lean();
      finalRelated = autoRelated as any;
    }

    const deviceObj = device.toObject();
    deviceObj.relatedDevices = finalRelated as any;

    res.status(200).json({
      success: true,
      data: {
        device: deviceObj,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get Featured Devices
export const getFeaturedDevices = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const featured = await Device.find({ published: true })
      .populate('category', 'name slug icon')
      .sort({ viewsCount: -1, createdAt: -1 })
      .limit(6)
      .lean();

    res.status(200).json({
      success: true,
      data: { devices: featured },
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Create device
export const createDevice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = req.body;
    const baseSlug = slugify(data.name);

    // Ensure unique slug
    let slug = baseSlug;
    let counter = 1;
    while (await Device.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const device = await Device.create({
      ...data,
      slug,
      viewsCount: 0,
    });

    const populated = await Device.findById(device._id).populate('category', 'name slug');

    res.status(201).json({
      success: true,
      message: 'Device created successfully.',
      data: { device: populated },
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Update device
export const updateDevice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const data = req.body;

    const device = await Device.findById(id);
    if (!device) {
      throw new AppError('Device not found.', 404);
    }

    // If name changed, update slug safely
    if (data.name && data.name !== device.name) {
      const baseSlug = slugify(data.name);
      let slug = baseSlug;
      let counter = 1;
      while (await Device.findOne({ slug, _id: { $ne: id } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      data.slug = slug;
    }

    const updated = await Device.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).populate('category', 'name slug');

    res.status(200).json({
      success: true,
      message: 'Device updated successfully.',
      data: { device: updated },
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Delete device
export const deleteDevice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const device = await Device.findByIdAndDelete(id);
    if (!device) {
      throw new AppError('Device not found.', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Device deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Toggle publish state
export const togglePublishDevice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const device = await Device.findById(id);

    if (!device) {
      throw new AppError('Device not found.', 404);
    }

    device.published = !device.published;
    await device.save();

    res.status(200).json({
      success: true,
      message: `Device is now ${device.published ? 'published' : 'unpublished'}.`,
      data: { published: device.published },
    });
  } catch (error) {
    next(error);
  }
};
