import { Module } from "@nestjs/common";
import { BankAccountService } from "./services/bank-account.service";
import { CreditCardService } from "./services/credit-card.service";
import { TransactionPersistenceService } from "./services/transaction-persistence.service";

@Module({
  providers: [
    BankAccountService,
    CreditCardService,
    TransactionPersistenceService,
  ],
  exports: [
    BankAccountService,
    CreditCardService,
    TransactionPersistenceService,
  ],
})
export class DatabaseModule {}