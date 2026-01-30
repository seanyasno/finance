import { Injectable } from '@nestjs/common';
import { PrismaService } from '@finance/database';

@Injectable()
export class CreditCardsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string) {
    const creditCards = await this.prisma.credit_cards.findMany({
      where: {
        user_id: userId,
      },
      orderBy: {
        created_at: 'asc',
      },
    });

    // Map database fields to camelCase for response
    return creditCards.map((card) => ({
      id: card.id,
      cardNumber: card.card_number,
      company: card.company,
      createdAt: card.created_at,
    }));
  }
}
