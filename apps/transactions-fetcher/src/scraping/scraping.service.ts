import { Injectable } from "@nestjs/common";
import { CompanyTypes, createScraper } from "israeli-bank-scrapers";
import { TransactionsAccount } from "israeli-bank-scrapers/lib/transactions";
import { isNullOrUndefined, withDefault } from "@finance/libs";
import { DiscountStrategy } from "./strategies/discount.strategy";
import { IsracardStrategy } from "./strategies/isracard.strategy";
import { MaxStrategy } from "./strategies/max.strategy";
import { OneZeroStrategy } from "./strategies/one-zero.strategy";
import { ScrapingStrategy } from "./types/scraping-strategy.type";

@Injectable()
export class ScrapingService {
  private strategies: Map<CompanyTypes, ScrapingStrategy> = new Map();

  constructor(
    private discountStrategy: DiscountStrategy,
    private isracardStrategy: IsracardStrategy,
    private maxStrategy: MaxStrategy,
    private oneZeroStrategy: OneZeroStrategy,
  ) {
    this.strategies.set(CompanyTypes.discount, this.discountStrategy);
    this.strategies.set(CompanyTypes.isracard, this.isracardStrategy);
    this.strategies.set(CompanyTypes.max, this.maxStrategy);
    this.strategies.set(CompanyTypes.oneZero, this.oneZeroStrategy);
  }

  async scrapeCompany(
    companyType: CompanyTypes,
    mock = true,
  ): Promise<TransactionsAccount[]> {
    const strategy = this.getStrategy(companyType);

    if (mock) {
      return this.getMockTransactions(strategy);
    }

    return this.scrapeRealTransactions(strategy);
  }

  private getStrategy(companyType: CompanyTypes): ScrapingStrategy {
    const strategy = this.strategies.get(companyType);

    if (isNullOrUndefined(strategy)) {
      throw new Error(`Unsupported company type: ${companyType}`);
    }

    return strategy;
  }

  private getMockTransactions(
    strategy: ScrapingStrategy,
  ): TransactionsAccount[] {
    const mockData = strategy.getMockData();
    const parsedMockData = JSON.parse(mockData) as TransactionsAccount[];

    return withDefault(parsedMockData, []);
  }

  private async scrapeRealTransactions(
    strategy: ScrapingStrategy,
  ): Promise<TransactionsAccount[]> {
    try {
      const options = await strategy.getOptions();
      const credentials = strategy.getCredentials();

      console.log(`Scraping transactions for ${options.companyId}...`);
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
}
