import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@finance/database';
import { TransactionQueryDto, UpdateTransactionDto } from './dto';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string, query: TransactionQueryDto) {
    const whereClause: any = {
      user_id: userId,
    };

    // Add date filters if provided
    if (query.startDate || query.endDate) {
      whereClause.timestamp = {};
      if (query.startDate) {
        whereClause.timestamp.gte = new Date(query.startDate);
      }
      if (query.endDate) {
        whereClause.timestamp.lte = new Date(query.endDate);
      }
    }

    // Add credit card filter if provided
    if (query.creditCardId) {
      whereClause.credit_card_id = query.creditCardId;
    }

    // Add search filter if provided
    if (query.search) {
      whereClause.OR = [
        {
          description: {
            contains: query.search,
            mode: 'insensitive' as const,
          },
        },
        {
          notes: {
            contains: query.search,
            mode: 'insensitive' as const,
          },
        },
      ];
    }

    const transactions = await this.prisma.transactions.findMany({
      where: whereClause,
      orderBy: {
        timestamp: 'desc',
      },
      include: {
        credit_card: true,
        category: true,
      },
    });

    // Map database fields to camelCase for response
    return transactions.map((transaction) => ({
      id: transaction.id,
      description: transaction.description,
      timestamp: transaction.timestamp,
      notes: transaction.notes,
      originalAmount: transaction.original_amount,
      originalCurrency: transaction.original_currency,
      chargedAmount: transaction.charged_amount,
      chargedCurrency: transaction.charged_currency,
      status: transaction.status,
      creditCardId: transaction.credit_card_id,
      creditCard: transaction.credit_card
        ? {
            id: transaction.credit_card.id,
            cardNumber: transaction.credit_card.card_number,
            company: transaction.credit_card.company,
          }
        : null,
      categoryId: transaction.category_id,
      category: transaction.category
        ? {
            id: transaction.category.id,
            name: transaction.category.name,
            icon: transaction.category.icon,
            color: transaction.category.color,
            isDefault: transaction.category.is_default,
          }
        : null,
    }));
  }

  async update(
    userId: string,
    transactionId: string,
    data: UpdateTransactionDto,
  ) {
    // Verify transaction exists and belongs to user
    const existingTransaction = await this.prisma.transactions.findFirst({
      where: {
        id: transactionId,
        user_id: userId,
      },
    });

    if (!existingTransaction) {
      throw new NotFoundException('Transaction not found');
    }

    // If categoryId is provided, verify it exists and is valid for this user
    if (data.categoryId !== undefined && data.categoryId !== null) {
      const category = await this.prisma.categories.findFirst({
        where: {
          id: data.categoryId,
          OR: [{ is_default: true }, { user_id: userId }],
        },
      });

      if (!category) {
        throw new BadRequestException('Invalid category');
      }
    }

    // Update the transaction
    const updateData: {
      category_id?: string | null;
      notes?: string | null;
    } = {};

    if (data.categoryId !== undefined) {
      updateData.category_id = data.categoryId;
    }
    if (data.notes !== undefined) {
      updateData.notes = data.notes;
    }

    const updatedTransaction = await this.prisma.transactions.update({
      where: { id: transactionId },
      data: updateData,
      include: {
        credit_card: true,
        category: true,
      },
    });

    // Map to camelCase
    return {
      id: updatedTransaction.id,
      description: updatedTransaction.description,
      timestamp: updatedTransaction.timestamp,
      notes: updatedTransaction.notes,
      originalAmount: updatedTransaction.original_amount,
      originalCurrency: updatedTransaction.original_currency,
      chargedAmount: updatedTransaction.charged_amount,
      chargedCurrency: updatedTransaction.charged_currency,
      status: updatedTransaction.status,
      creditCardId: updatedTransaction.credit_card_id,
      creditCard: updatedTransaction.credit_card
        ? {
            id: updatedTransaction.credit_card.id,
            cardNumber: updatedTransaction.credit_card.card_number,
            company: updatedTransaction.credit_card.company,
          }
        : null,
      categoryId: updatedTransaction.category_id,
      category: updatedTransaction.category
        ? {
            id: updatedTransaction.category.id,
            name: updatedTransaction.category.name,
            icon: updatedTransaction.category.icon,
            color: updatedTransaction.category.color,
            isDefault: updatedTransaction.category.is_default,
          }
        : null,
    };
  }
}
