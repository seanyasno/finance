import { Injectable, NotFoundException } from '@nestjs/common';
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
      billingCycleStartDay: card.billing_cycle_start_day,
      createdAt: card.created_at,
    }));
  }

  async update(
    userId: string,
    cardId: string,
    data: { billingCycleStartDay: number | null },
  ) {
    // First verify card belongs to user
    const card = await this.prisma.credit_cards.findFirst({
      where: { id: cardId, user_id: userId },
    });

    if (!card) {
      throw new NotFoundException('Credit card not found');
    }

    const updated = await this.prisma.credit_cards.update({
      where: { id: cardId },
      data: { billing_cycle_start_day: data.billingCycleStartDay },
    });

    return {
      id: updated.id,
      cardNumber: updated.card_number,
      company: updated.company,
      billingCycleStartDay: updated.billing_cycle_start_day,
      createdAt: updated.created_at,
    };
  }
}
