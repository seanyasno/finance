import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CompanyTypes, ScraperCredentials } from "israeli-bank-scrapers";
import { ScrapingStrategy } from "../types/scraping-strategy.type";
import { ScraperOptionsFactory } from "../factories/scraper-options.factory";
import { MockDataService } from "../../config/mock-data/mock-data.service";

@Injectable()
export class IsracardStrategy implements ScrapingStrategy {
  constructor(
    private configService: ConfigService,
    private scraperOptionsFactory: ScraperOptionsFactory,
    private mockDataService: MockDataService,
  ) {}

  getCredentials(): ScraperCredentials {
    return {
      id: this.configService.get("ISRACARD_ID", ""),
      card6Digits: this.configService.get("ISRACARD_SIX_DIGITS", ""),
      password: this.configService.get("ISRACARD_PASSWORD", ""),
    };
  }

  async getOptions() {
    return this.scraperOptionsFactory.createOptions(CompanyTypes.isracard);
  }

  getMockData(): string {
    return this.mockDataService.getMockTransactions(CompanyTypes.isracard);
  }
}