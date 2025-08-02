import { Injectable } from "@nestjs/common";
import { db } from "@finance/database";
import { SaveTransactionsParams } from "../../transactions/types/transactions.type";
import { BankAccountService } from "./bank-account.service";
import { CreditCardService } from "./credit-card.service";
import { CompanyValidatorHelper } from "../../transactions/helpers/company-validator.helper";
import { TransactionMapperHelper } from "../../transactions/helpers/transaction-mapper.helper";
import { TransactionsAccount } from "israeli-bank-scrapers/lib/transactions";
import { BankCompanyType } from "../../common/types/bank-company.type";
import { CreditCardCompanyType } from "../../common/types/credit-card-company.type";

@Injectable()
export class TransactionPersistenceService {
  constructor(
    private bankAccountService: BankAccountService,
    private creditCardService: CreditCardService,
  ) {}

  async saveTransactions({
    accounts,
    companyType,
    userId,
  }: SaveTransactionsParams) {
    for (const account of accounts) {
      if (CompanyValidatorHelper.isBankAccount(companyType)) {
        await this.saveBankAccountTransactions(
          account,
          companyType,
          userId,
        );
      }

      if (CompanyValidatorHelper.isCreditCard(companyType)) {
        await this.saveCreditCardTransactions(
          account,
          companyType,
          userId,
        );
      }
    }
  }

  private async saveBankAccountTransactions(
    account: TransactionsAccount,
    companyType: BankCompanyType,
    userId: string,
  ) {
    CompanyValidatorHelper.validateBankAccountCompany(companyType);

    const bankAccount = await this.bankAccountService.upsertBankAccount(
      account.accountNumber,
      account.balance!,
      userId,
      companyType,
    );

    await db.$transaction(async (tx) => {
      account.txns.forEach((transaction) => tx.transactions.upsert({
        where: {
          identifier: transaction.identifier!.toString(),
        },
        create: TransactionMapperHelper.mapBankTransaction(
          transaction,
          userId,
          bankAccount.id,
        ),
        update: {
          description: transaction.description,
          timestamp: new Date(transaction.date).toISOString(),
          status: transaction.status,
          original_amount: transaction.originalAmount,
          original_currency: transaction.originalCurrency,
          charged_amount: transaction.chargedAmount,
          charged_currency: transaction.chargedCurrency,
        }
      }))
    });
  }

  private async saveCreditCardTransactions(
    account: TransactionsAccount,
    companyType: CreditCardCompanyType,
    userId: string,
  ) {
    CompanyValidatorHelper.validateCreditCardCompany(companyType);

    const creditCard = await this.creditCardService.upsertCreditCard(
      account.accountNumber,
      userId,
      companyType,
    );

    await db.$transaction(async (tx) => {
      account.txns.forEach((transaction) => tx.transactions.upsert({
        where: {
          identifier: transaction.identifier!.toString(),
        },
        create: TransactionMapperHelper.mapCreditCardTransaction(
          transaction,
          userId,
          creditCard.id,
        ),
        update: {
          description: transaction.description,
          timestamp: new Date(transaction.date).toISOString(),
          status: transaction.status,
          original_amount: transaction.originalAmount,
          original_currency: transaction.originalCurrency,
          charged_amount: transaction.chargedAmount,
          charged_currency: transaction.chargedCurrency,
        }
      }));
    });
  }
}