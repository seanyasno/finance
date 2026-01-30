import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

// Nested credit card DTO for inclusion in transaction response
export const CreditCardInTransactionSchema = z.object({
  id: z.string().uuid(),
  cardNumber: z.string(),
  company: z.enum(['max', 'isracard', 'visaCal']),
});

export class CreditCardInTransactionDto extends createZodDto(
  CreditCardInTransactionSchema,
) {}

// Transaction DTO
export const TransactionSchema = z.object({
  id: z.string().uuid(),
  description: z.string().nullable(),
  timestamp: z.date(),
  notes: z.string().nullable(),
  originalAmount: z.number(),
  originalCurrency: z.string(),
  chargedAmount: z.number(),
  chargedCurrency: z.string().nullable(),
  status: z.enum(['completed', 'pending']),
  creditCardId: z.string().uuid().nullable(),
  creditCard: CreditCardInTransactionSchema.nullable(),
});

export class TransactionDto extends createZodDto(TransactionSchema) {}

// Query DTO for filtering transactions
export const TransactionQuerySchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  creditCardId: z.string().uuid().optional(),
});

export class TransactionQueryDto extends createZodDto(TransactionQuerySchema) {}

// Response DTO
export const TransactionsResponseSchema = z.object({
  transactions: z.array(TransactionSchema),
});

export class TransactionsResponseDto extends createZodDto(
  TransactionsResponseSchema,
) {}
