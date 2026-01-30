import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

// Credit Card DTO
export const CreditCardSchema = z.object({
  id: z.string().uuid(),
  cardNumber: z.string(),
  company: z.enum(['max', 'isracard', 'visaCal']),
  createdAt: z.date(),
});

export class CreditCardDto extends createZodDto(CreditCardSchema) {}

// Response DTO
export const CreditCardsResponseSchema = z.object({
  creditCards: z.array(CreditCardSchema),
});

export class CreditCardsResponseDto extends createZodDto(
  CreditCardsResponseSchema,
) {}
