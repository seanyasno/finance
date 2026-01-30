import { Injectable } from '@nestjs/common';
import { PrismaService } from '@finance/database';
import { TransactionQueryDto } from './dto';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string, query: TransactionQueryDto) {
    const whereClause: {
      user_id: string;
      timestamp?: {
        gte?: Date;
        lte?: Date;
      };
      credit_card_id?: string;
    } = {
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

    const transactions = await this.prisma.transactions.findMany({
      where: whereClause,
      orderBy: {
        timestamp: 'desc',
      },
      include: {
        credit_card: true,
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
    }));
  }
}
