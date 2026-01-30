import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

// Category DTO
export const CategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  icon: z.string().nullable(),
  color: z.string().nullable(),
  isDefault: z.boolean(),
});

export class CategoryDto extends createZodDto(CategorySchema) {}

// Create Category DTO
export const CreateCategorySchema = z.object({
  name: z.string().min(1).max(50),
  icon: z.string().optional(),
  color: z.string().optional(),
});

export class CreateCategoryDto extends createZodDto(CreateCategorySchema) {}

// Response DTO
export const CategoriesResponseSchema = z.object({
  categories: z.array(CategorySchema),
});

export class CategoriesResponseDto extends createZodDto(
  CategoriesResponseSchema,
) {}
