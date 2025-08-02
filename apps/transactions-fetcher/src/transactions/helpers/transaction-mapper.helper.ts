import { Prisma } from "@finance/database";
import { Transaction } from "israeli-bank-scrapers/lib/transactions";

const TransactionSource = {
  BANK_ACCOUNT: "bank_account",
  CREDIT_CARD: "credit_card",
} as const;

export class TransactionMapperHelper {
  static mapBankTransaction(
    transaction: Transaction,
    userId: string,
    bankAccountId: string,
  ): Prisma.transactionsCreateManyInput {
    return {
      user_id: userId,
      description: transaction.description,
      timestamp: new Date(transaction.date).toISOString(),
      status: transaction.status,
      original_amount: transaction.originalAmount,
      original_currency: transaction.originalCurrency,
      charged_amount: transaction.chargedAmount,
      charged_currency: transaction.chargedCurrency,
      source: TransactionSource.BANK_ACCOUNT,
      bank_account_id: bankAccountId,
      identifier: transaction.identifier!.toString(),
    };
  }

  static mapCreditCardTransaction(
    transaction: Transaction,
    userId: string,
    creditCardId: string,
  ): Prisma.transactionsCreateManyInput {
    return {
      user_id: userId,
      description: transaction.description,
      timestamp: new Date(transaction.date).toISOString(),
      status: transaction.status,
      original_amount: transaction.originalAmount,
      original_currency: transaction.originalCurrency,
      charged_amount: transaction.chargedAmount,
      charged_currency: transaction.chargedCurrency,
      source: TransactionSource.CREDIT_CARD,
      credit_card_id: creditCardId,
      identifier: transaction.identifier!.toString(),
    };
  }
}