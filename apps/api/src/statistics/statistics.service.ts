import { Injectable } from '@nestjs/common';
import { PrismaService } from '@finance/database';
import { SpendingSummaryDto, CategorySpendingDto, MonthlySpendingDto } from './dto';

@Injectable()
export class StatisticsService {
  constructor(private prisma: PrismaService) {}

  async getSpendingSummary(userId: string): Promise<SpendingSummaryDto> {
    // Get last 5 months of data
    const now = new Date();
    const fiveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 4, 1);

    // Fetch all transactions in range
    const transactions = await this.prisma.transactions.findMany({
      where: {
        user_id: userId,
        timestamp: { gte: fiveMonthsAgo },
      },
      include: { category: true },
      orderBy: { timestamp: 'desc' },
    });

    // Group transactions by month
    const monthlyData = this.groupByMonth(transactions);

    // Build monthly spending array (last 5 months, chronological)
    const months: MonthlySpendingDto[] = [];
    for (let i = 4; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = this.formatMonthKey(monthDate);
      const monthLabel = this.formatMonthLabel(monthDate);
      const monthTransactions = monthlyData.get(monthKey) || [];

      months.push({
        month: monthKey,
        monthLabel,
        total: this.sumAmount(monthTransactions),
        categoryBreakdown: this.getCategoryBreakdown(monthTransactions),
      });
    }

    // Calculate comparison (current vs previous month)
    const currentMonthIndex = months.length - 1;
    const previousMonthIndex = months.length - 2;

    if (currentMonthIndex < 0 || previousMonthIndex < 0) {
      throw new Error('Insufficient data for comparison');
    }

    const currentMonth = months[currentMonthIndex]!;
    const previousMonth = months[previousMonthIndex]!;

    const comparison = this.calculateComparison(currentMonth, previousMonth);

    // Calculate trends across all 5 months
    const trends = this.calculateTrends(months);

    return { months, comparison, trends };
  }

  private groupByMonth(transactions: any[]): Map<string, any[]> {
    const grouped = new Map<string, any[]>();
    for (const transaction of transactions) {
      const monthKey = this.formatMonthKey(new Date(transaction.timestamp));
      if (!grouped.has(monthKey)) {
        grouped.set(monthKey, []);
      }
      grouped.get(monthKey)!.push(transaction);
    }
    return grouped;
  }

  private formatMonthKey(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  }

  private formatMonthLabel(date: Date): string {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  private sumAmount(transactions: any[]): number {
    return transactions.reduce((sum, transaction) => sum + (transaction.charged_amount || 0), 0);
  }

  private getCategoryBreakdown(transactions: any[]): CategorySpendingDto[] {
    const byCategory = new Map<string | null, { name: string; amount: number; count: number }>();
    const total = this.sumAmount(transactions);

    for (const transaction of transactions) {
      const categoryId = transaction.category_id;
      const categoryName = transaction.category?.name || 'Uncategorized';

      if (!byCategory.has(categoryId)) {
        byCategory.set(categoryId, { name: categoryName, amount: 0, count: 0 });
      }
      const category = byCategory.get(categoryId)!;
      category.amount += transaction.charged_amount || 0;
      category.count += 1;
    }

    return Array.from(byCategory.entries())
      .map(([categoryId, data]) => ({
        categoryId,
        categoryName: data.name,
        amount: data.amount,
        percentage: total > 0 ? Math.round((data.amount / total) * 100) : 0,
        transactionCount: data.count,
      }))
      .sort((a, b) => b.amount - a.amount);
  }

  private calculateComparison(current: MonthlySpendingDto, previous: MonthlySpendingDto) {
    const changeAmount = previous.total > 0 ? current.total - previous.total : null;
    const changePercent = previous.total > 0
      ? Math.round(((current.total - previous.total) / previous.total) * 100)
      : null;

    const trend = this.determineTrend(changePercent);

    // Build category comparisons
    const allCategories = new Set([
      ...current.categoryBreakdown.map(category => category.categoryId),
      ...previous.categoryBreakdown.map(category => category.categoryId),
    ]);

    const categoryComparisons = Array.from(allCategories).map(categoryId => {
      const currentCategory = current.categoryBreakdown.find(category => category.categoryId === categoryId);
      const previousCategory = previous.categoryBreakdown.find(category => category.categoryId === categoryId);

      const currentAmount = currentCategory?.amount || 0;
      const previousAmount = previousCategory?.amount || null;
      const categoryChangeAmount = previousAmount !== null ? currentAmount - previousAmount : null;
      const categoryChangePercent = previousAmount && previousAmount > 0
        ? Math.round(((currentAmount - previousAmount) / previousAmount) * 100)
        : null;

      return {
        categoryId,
        categoryName: currentCategory?.categoryName || previousCategory?.categoryName || 'Unknown',
        currentAmount,
        previousAmount,
        changeAmount: categoryChangeAmount,
        changePercent: categoryChangePercent,
        trend: this.determineTrend(categoryChangePercent),
      };
    }).sort((a, b) => b.currentAmount - a.currentAmount);

    return {
      currentMonth: current.month,
      previousMonth: previous.month,
      currentTotal: current.total,
      previousTotal: previous.total,
      changeAmount,
      changePercent,
      trend,
      categoryComparisons,
    };
  }

  private calculateTrends(months: MonthlySpendingDto[]) {
    const totals = months.map(month => month.total);
    const average = totals.reduce((sum, total) => sum + total, 0) / totals.length;
    const currentMonthTotal = totals[totals.length - 1] || 0;

    // Simple trend: compare current to average
    const overallChangePercent = average > 0
      ? Math.round(((currentMonthTotal - average) / average) * 100)
      : 0;
    const overall = this.determineTrend(overallChangePercent);

    // Category trends
    const allCategories = new Map<string | null, { name: string; monthlyAmounts: number[] }>();

    for (let i = 0; i < months.length; i++) {
      const month = months[i];
      if (!month) continue;

      for (const category of month.categoryBreakdown) {
        if (!allCategories.has(category.categoryId)) {
          allCategories.set(category.categoryId, {
            name: category.categoryName,
            monthlyAmounts: new Array(months.length).fill(0)
          });
        }
        allCategories.get(category.categoryId)!.monthlyAmounts[i] = category.amount;
      }
    }

    const categoryTrends = Array.from(allCategories.entries()).map(([categoryId, data]) => {
      const categoryAverage = data.monthlyAmounts.reduce((sum, amount) => sum + amount, 0) / data.monthlyAmounts.length;
      const categoryCurrent = data.monthlyAmounts[data.monthlyAmounts.length - 1] || 0;
      const categoryChangePercent = categoryAverage > 0
        ? Math.round(((categoryCurrent - categoryAverage) / categoryAverage) * 100)
        : 0;

      return {
        categoryId,
        categoryName: data.name,
        trend: this.determineTrend(categoryChangePercent),
        averageMonthly: Math.round(categoryAverage * 100) / 100,
        currentMonth: categoryCurrent,
        changePercent: categoryChangePercent,
      };
    }).sort((a, b) => b.currentMonth - a.currentMonth);

    return {
      overall,
      overallAverageMonthly: Math.round(average * 100) / 100,
      categoryTrends,
    };
  }

  private determineTrend(changePercent: number | null): 'up' | 'down' | 'stable' {
    if (changePercent === null) return 'stable';
    if (changePercent > 5) return 'up';
    if (changePercent < -5) return 'down';
    return 'stable';
  }
}
