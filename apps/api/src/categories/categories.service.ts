import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@finance/database';
import { CreateCategoryDto } from './dto';

interface DefaultCategory {
  name: string;
  icon: string;
  color: string;
}

const DEFAULT_CATEGORIES: DefaultCategory[] = [
  { name: 'food', icon: 'fork.knife', color: '#FF9500' },
  { name: 'clothes', icon: 'tshirt.fill', color: '#AF52DE' },
  { name: 'transit', icon: 'car.fill', color: '#007AFF' },
  { name: 'subscriptions', icon: 'repeat', color: '#5856D6' },
  { name: 'entertainment', icon: 'film.fill', color: '#FF2D55' },
  { name: 'health', icon: 'heart.fill', color: '#FF3B30' },
  { name: 'bills', icon: 'doc.text.fill', color: '#34C759' },
  { name: 'other', icon: 'ellipsis.circle.fill', color: '#8E8E93' },
];

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async seedDefaults() {
    // Check if defaults already exist to avoid re-seeding
    const existingCount = await this.prisma.categories.count({
      where: { is_default: true },
    });

    if (existingCount >= DEFAULT_CATEGORIES.length) {
      return; // Already seeded
    }

    // Seed each default category individually to ensure idempotency
    for (const category of DEFAULT_CATEGORIES) {
      const existing = await this.prisma.categories.findFirst({
        where: {
          name: category.name,
          is_default: true,
          user_id: null,
        },
      });

      if (!existing) {
        await this.prisma.categories.create({
          data: {
            name: category.name,
            icon: category.icon,
            color: category.color,
            is_default: true,
            user_id: null,
          },
        });
      }
    }
  }

  async findAll(userId: string) {
    const categories = await this.prisma.categories.findMany({
      where: {
        OR: [
          { is_default: true }, // All default categories
          { user_id: userId }, // User's custom categories
        ],
      },
      orderBy: [{ is_default: 'desc' }, { name: 'asc' }],
    });

    // Map snake_case to camelCase
    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      icon: category.icon,
      color: category.color,
      isDefault: category.is_default,
    }));
  }

  async create(userId: string, data: CreateCategoryDto) {
    const category = await this.prisma.categories.create({
      data: {
        name: data.name,
        icon: data.icon ?? null,
        color: data.color ?? null,
        is_default: false,
        user_id: userId,
      },
    });

    // Map snake_case to camelCase
    return {
      id: category.id,
      name: category.name,
      icon: category.icon,
      color: category.color,
      isDefault: category.is_default,
    };
  }

  async delete(userId: string, categoryId: string) {
    // Find the category first
    const category = await this.prisma.categories.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new ForbiddenException('Category not found');
    }

    // Check if it's a default category
    if (category.is_default) {
      throw new ForbiddenException('Cannot delete default categories');
    }

    // Check if it belongs to the user
    if (category.user_id !== userId) {
      throw new ForbiddenException("Cannot delete another user's category");
    }

    // Delete the category
    await this.prisma.categories.delete({
      where: { id: categoryId },
    });
  }
}
