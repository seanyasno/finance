import { Injectable } from "@nestjs/common";
import {
  CompanyTypes,
  createScraper,
  ScraperCredentials,
  ScraperOptions,
} from "israeli-bank-scrapers";
import { TransactionsAccount } from "israeli-bank-scrapers/lib/transactions";
import { isNotNullOrUndefined, withDefault } from "@finance/libs";
import { ConfigService } from "@nestjs/config";
import puppeteer from "puppeteer";
import { db, Prisma } from "@finance/database";
import { prompt } from "enquirer";

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  async workflow() {
    const {
      discountTransactions,
      oneZeroTransactions,
      isracardTransactions,
      maxTransactions,
    } = await this.fetchTransactions();

    // await this.saveTransactionsToDatabase(
    //   discountTransactions,
    //   CompanyTypes.discount,
    // );
    // await this.saveTransactionsToDatabase(
    //   oneZeroTransactions,
    //   CompanyTypes.oneZero,
    // );
    // await this.saveTransactionsToDatabase(
    //   isracardTransactions,
    //   CompanyTypes.isracard,
    // );
    // await this.saveTransactionsToDatabase(maxTransactions, CompanyTypes.max);

    return {
      message: "Workflow completed successfully",
    };
  }

  async fetchTransactions() {
    const discountTransactions = await this.scrapeCompany(
      CompanyTypes.discount,
      true,
    );
    const oneZeroTransactions = await this.scrapeCompany(
      CompanyTypes.oneZero,
      true,
    );
    const isracardTransactions = await this.scrapeCompany(
      CompanyTypes.isracard,
      true,
    );
    const maxTransactions = await this.scrapeCompany(CompanyTypes.max, true);

    return {
      discountTransactions,
      oneZeroTransactions,
      isracardTransactions,
      maxTransactions,
    };
  }

  async saveTransactionsToDatabase(
    accounts: TransactionsAccount[],
    companyType: CompanyTypes,
  ) {
    const userId = this.configService.get("USER_ID_MOCK", "");

    for (const account of accounts) {
      if (isNotNullOrUndefined(account.balance)) {
        if (
          companyType !== CompanyTypes.discount &&
          companyType !== CompanyTypes.oneZero
        ) {
          throw new Error(
            `Company type ${companyType} does not support bank accounts with balance.`,
          );
        }

        const bankAccount = await this.upsertBankAccount(
          account.accountNumber,
          account.balance,
          userId,
          companyType,
        );

        await db.transactions.createMany({
          data: account.txns.map(
            (transaction) =>
              ({
                user_id: userId,
                description: transaction.description,
                timestamp: new Date(transaction.date).toISOString(),
                status: transaction.status,
                original_amount: transaction.originalAmount,
                original_currency: transaction.originalCurrency,
                charged_amount: transaction.chargedAmount,
                charged_currency: transaction.chargedCurrency,
                source: "bank_account",
                bank_account_id: bankAccount.id,
              }) satisfies Prisma.transactionsCreateManyInput,
          ),
          skipDuplicates: true,
        });
      } else {
        if (
          companyType !== CompanyTypes.max &&
          companyType !== CompanyTypes.isracard &&
          companyType !== CompanyTypes.visaCal
        ) {
          throw new Error(
            `Company type ${companyType} does not support credit card transactions.`,
          );
        }

        const creditCard = await this.upsertCreditCard(
          account.accountNumber,
          userId,
          companyType,
        );

        await db.transactions.createMany({
          data: account.txns.map(
            (transaction) =>
              ({
                user_id: userId,
                description: transaction.description,
                timestamp: transaction.date,
                status: transaction.status,
                original_amount: transaction.originalAmount,
                original_currency: transaction.originalCurrency,
                charged_amount: transaction.chargedAmount,
                charged_currency: transaction.chargedCurrency,
                source: "credit_card",
                credit_card_id: creditCard.id,
              }) satisfies Prisma.transactionsCreateManyInput,
          ),
          skipDuplicates: true,
        });
      }
    }
  }

  async upsertBankAccount(
    accountNumber: string,
    balance: number,
    userId: string,
    companyType: Extract<
      CompanyTypes,
      CompanyTypes.discount | CompanyTypes.oneZero
    >,
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

  async upsertCreditCard(
    cardNumber: string,
    userId: string,
    companyType: Extract<
      CompanyTypes,
      CompanyTypes.max | CompanyTypes.isracard | CompanyTypes.visaCal
    >,
  ) {
    return db.credit_cards.upsert({
      where: {
        user_id_card_number: {
          user_id: userId,
          card_number: cardNumber,
        },
      },
      update: {},
      create: {
        card_number: cardNumber,
        company: companyType,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async scrapeCompany(companyType: CompanyTypes, mock = true) {
    if (mock) {
      const mockData = this.getUnparsedTransactionsMock(companyType);
      const parsedMockData = JSON.parse(mockData) as TransactionsAccount[];

      return withDefault(parsedMockData, []);
    }

    // if (companyType === CompanyTypes.oneZero) {
    //   const options = await this.getOptions(companyType);
    //   const scraper = createScraper(options);
    //
    //   await scraper.triggerTwoFactorAuth('phonenumberhere');
    //
    //   let otpCode;
    //   while (!otpCode) {
    //     console.log("Waiting for OTP code...");
    //
    //     const { newOtpCode } = (await prompt({
    //       type: "input",
    //       name: "newOtpCode",
    //       message: "Enter the OTP code sent to your phone:",
    //     })) as any;
    //
    //     otpCode = newOtpCode;
    //   }
    //
    //   const result = await scraper.getLongTermTwoFactorToken(otpCode);
    //
    //   await scraper.scrape()
    //
    //   return result;
    // }

    try {
      const options = await this.getOptions(companyType);
      const credentials = this.getCredentials(companyType);

      console.log(`Scraping transactions for ${companyType}...`);
      console.log("Using credentials:", credentials);

      const scraper = createScraper(options);
      const scrapeResult = await scraper.scrape(credentials);

      if (scrapeResult.success) {
        return withDefault(scrapeResult.accounts, []);
      }

      throw new Error(scrapeResult.errorType);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }

      throw new Error("Failed to fetch transactions: " + error);
    }
  }

  getUnparsedTransactionsMock(companyType: CompanyTypes) {
    switch (companyType) {
      case CompanyTypes.discount:
        return this.configService.get("DISCOUNT_TRANSACTIONS_MOCK", "");
      case CompanyTypes.isracard:
        return this.configService.get("ISRACARD_TRANSACTIONS_MOCK", "");
      case CompanyTypes.max:
        return this.configService.get("MAX_TRANSACTIONS_MOCK", "");
      case CompanyTypes.oneZero:
        return this.configService.get("ONE_ZERO_TRANSACTIONS_MOCK", "");
      default:
        throw new Error(`Unsupported company type: ${companyType}`);
    }
  }

  async getOptions(companyType: CompanyTypes): Promise<ScraperOptions> {
    const browser = await puppeteer.launch();
    const browserContext = await browser.createBrowserContext();

    return {
      companyId: companyType,
      startDate: new Date("2025-01-01"),
      combineInstallments: false,
      // showBrowser: true,
      browser: browserContext as any,
      timeout: 120000,
      defaultTimeout: 120000,
      skipCloseBrowser: true,
    };
  }

  getCredentials(companyType: CompanyTypes): ScraperCredentials {
    switch (companyType) {
      case CompanyTypes.discount:
        return {
          id: this.configService.get("DISCOUNT_ID", ""),
          password: this.configService.get("DISCOUNT_PASSWORD", ""),
          num: this.configService.get("DISCOUNT_NUM", ""),
        };
      case CompanyTypes.isracard:
        return {
          id: this.configService.get("ISRACARD_ID", ""),
          card6Digits: this.configService.get("ISRACARD_SIX_DIGITS", ""),
          password: this.configService.get("ISRACARD_PASSWORD", ""),
        };
      case CompanyTypes.max:
        return {
          username: this.configService.get("MAX_USERNAME", ""),
          password: this.configService.get("MAX_PASSWORD", ""),
        };
      case CompanyTypes.oneZero:
        return {
          email: this.configService.get("ONE_ZERO_EMAIL", ""),
          password: this.configService.get("ONE_ZERO_PASSWORD", ""),
          phoneNumber: this.configService.get("ONE_ZERO_PHONE_NUMBER", ""),
          otpLongTermToken: this.configService.get("ONE_ZERO_OTP_TOKEN", ""),
        };
      default:
        throw new Error(`Unsupported company type: ${companyType}`);
    }
  }
}
