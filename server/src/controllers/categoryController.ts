import { Request, Response, NextFunction } from 'express';
import { Category } from '../models/Category.js';
import { Device } from '../models/Device.js';
import { slugify } from '../utils/slugify.js';
import { AppError } from '../middleware/errorHandler.js';

// Get all categories with updated device counts
export const getAllCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const categories = await Category.find().sort({ order: 1, name: 1 });

    // Aggregate real-time device counts for accuracy
    const counts = await Device.aggregate([
      { $match: { published: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    const countMap = new Map(counts.map((c) => [c._id.toString(), c.count]));

    const categoriesWithCount = categories.map((cat) => ({
      _id: cat._id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      icon: cat.icon || 'Cpu',
      deviceCount: countMap.get(cat._id.toString()) || 0,
      order: cat.order,
      createdAt: cat.createdAt,
    }));

    res.status(200).json({
      success: true,
      data: {
        categories: categoriesWithCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get single category by slug
export const getCategoryBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { slug } = req.params;
    const category = await Category.findOne({ slug });

    if (!category) {
      throw new AppError('Category not found.', 404);
    }

    const deviceCount = await Device.countDocuments({
      category: category._id,
      published: true,
    });

    res.status(200).json({
      success: true,
      data: {
        category: {
          ...category.toObject(),
          deviceCount,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Create category
export const createCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, description, icon, order } = req.body;
    const slug = slugify(name);

    const existing = await Category.findOne({
      $or: [{ name }, { slug }],
    });

    if (existing) {
      throw new AppError('A category with this name or slug already exists.', 409);
    }

    const category = await Category.create({
      name: name.trim(),
      slug,
      description: description.trim(),
      icon: icon || 'Cpu',
      order: order !== undefined ? order : 0,
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully.',
      data: { category },
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Update category
export const updateCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, icon, order } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      throw new AppError('Category not found.', 404);
    }

    if (name && name !== category.name) {
      category.name = name.trim();
      category.slug = slugify(name);
    }
    if (description !== undefined) category.description = description.trim();
    if (icon !== undefined) category.icon = icon;
    if (order !== undefined) category.order = order;

    await category.save();

    res.status(200).json({
      success: true,
      message: 'Category updated successfully.',
      data: { category },
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Delete category
export const deleteCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const devicesCount = await Device.countDocuments({ category: id });
    if (devicesCount > 0) {
      throw new AppError(
        `Cannot delete this category because it has ${devicesCount} associated device(s). Reassign or delete the devices first.`,
        400
      );
    }

    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      throw new AppError('Category not found.', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
