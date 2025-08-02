import { Injectable } from "@nestjs/common";
import { db } from "@finance/database";
import { BankCompanyType } from "../../common/types/bank-company.type";

@Injectable()
export class BankAccountService {
  async upsertBankAccount(
    accountNumber: string,
    balance: number,
    userId: string,
    companyType: BankCompanyType,
  ) {
    return db.bank_accounts.upsert({
      where: {
        user_id_account_number: {
          account_number: accountNumber,
          user_id: userId,
        },
      },
      update: { balance },
      create: {
        account_number: accountNumber,
        balance,
        company: companyType,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }
}