import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

// Category spending within a month
const CategorySpendingSchema = z.object({
  categoryId: z.string().nullable(),
  categoryName: z.string(),
  amount: z.number(),
  percentage: z.number(),
  transactionCount: z.number(),
});

// Single month data
const MonthlySpendingSchema = z.object({
  month: z.string(),           // "2026-01" format
  monthLabel: z.string(),      // "January 2026" display format
  total: z.number(),
  categoryBreakdown: z.array(CategorySpendingSchema),
});

// Trend direction enum
const TrendDirectionSchema = z.enum(['up', 'down', 'stable']);

// Category trend
const CategoryTrendSchema = z.object({
  categoryId: z.string().nullable(),
  categoryName: z.string(),
  trend: TrendDirectionSchema,
  averageMonthly: z.number(),
  currentMonth: z.number(),
  changePercent: z.number(),
});

// Month-over-month comparison
const MonthComparisonSchema = z.object({
  currentMonth: z.string(),
  previousMonth: z.string().nullable(),
  currentTotal: z.number(),
  previousTotal: z.number().nullable(),
  changeAmount: z.number().nullable(),
  changePercent: z.number().nullable(),
  trend: TrendDirectionSchema,
  categoryComparisons: z.array(z.object({
    categoryId: z.string().nullable(),
    categoryName: z.string(),
    currentAmount: z.number(),
    previousAmount: z.number().nullable(),
    changeAmount: z.number().nullable(),
    changePercent: z.number().nullable(),
    trend: TrendDirectionSchema,
  })),
});

// Full spending summary response
const SpendingSummarySchema = z.object({
  months: z.array(MonthlySpendingSchema),
  comparison: MonthComparisonSchema,
  trends: z.object({
    overall: TrendDirectionSchema,
    overallAverageMonthly: z.number(),
    categoryTrends: z.array(CategoryTrendSchema),
  }),
});

export class CategorySpendingDto extends createZodDto(CategorySpendingSchema) {}
export class MonthlySpendingDto extends createZodDto(MonthlySpendingSchema) {}
export class MonthComparisonDto extends createZodDto(MonthComparisonSchema) {}
export class SpendingSummaryDto extends createZodDto(SpendingSummarySchema) {}
