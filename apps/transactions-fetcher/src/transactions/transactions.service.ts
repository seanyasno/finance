import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CompanyTypes } from "israeli-bank-scrapers";
import { FetchedTransactions } from "./types/transactions.type";
import { ScrapingService } from "../scraping/scraping.service";
import { TransactionPersistenceService } from "../database/services/transaction-persistence.service";

@Injectable()
export class TransactionsService {
  constructor(
    private configService: ConfigService,
    private scrapingService: ScrapingService,
    private transactionPersistenceService: TransactionPersistenceService,
  ) {}

  async executeWorkflow(): Promise<{ message: string }> {
    const fetchedTransactions = await this.fetchAllTransactions();

    await this.saveAllTransactions(fetchedTransactions);

    return {
      message: "Workflow completed successfully",
    };
  }

  async fetchAllTransactions(): Promise<FetchedTransactions> {
    const [
      discountTransactions,
      oneZeroTransactions,
      isracardTransactions,
      maxTransactions,
      visaCalTransactions,
    ] = await Promise.all([
      this.scrapingService.scrapeCompany(CompanyTypes.discount, true),
      this.scrapingService.scrapeCompany(CompanyTypes.oneZero, true),
      this.scrapingService.scrapeCompany(CompanyTypes.isracard, false),
      this.scrapingService.scrapeCompany(CompanyTypes.max, false),
      this.scrapingService.scrapeCompany(CompanyTypes.visaCal, false),
    ]);

    return {
      discountTransactions,
      oneZeroTransactions,
      isracardTransactions,
      maxTransactions,
      visaCalTransactions,
    };
  }

  private async saveAllTransactions(
    fetchedTransactions: FetchedTransactions,
  ): Promise<void> {
    const userId = this.configService.get("USER_ID_MOCK", "");

    await Promise.all([
      this.transactionPersistenceService.saveTransactions({
        accounts: fetchedTransactions.discountTransactions,
        companyType: CompanyTypes.discount,
        userId,
      }),
      this.transactionPersistenceService.saveTransactions({
        accounts: fetchedTransactions.oneZeroTransactions,
        companyType: CompanyTypes.oneZero,
        userId,
      }),
      this.transactionPersistenceService.saveTransactions({
        accounts: fetchedTransactions.isracardTransactions,
        companyType: CompanyTypes.isracard,
        userId,
      }),
      this.transactionPersistenceService.saveTransactions({
        accounts: fetchedTransactions.maxTransactions,
        companyType: CompanyTypes.max,
        userId,
      }),
      this.transactionPersistenceService.saveTransactions({
        accounts: fetchedTransactions.visaCalTransactions,
        companyType: CompanyTypes.visaCal,
        userId,
      }),
    ]);
  }
}