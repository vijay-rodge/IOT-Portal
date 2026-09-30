import { z } from 'zod';

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name is required').max(100),
    description: z.string().min(5, 'Description is required'),
    icon: z.string().optional(),
    order: z.number().optional(),
  }),
});

export const updateCategorySchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Category ID is required'),
  }),
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    description: z.string().min(5).optional(),
    icon: z.string().optional(),
    order: z.number().optional(),
  }),
});
