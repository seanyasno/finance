import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CompanyTypes, ScraperCredentials } from "israeli-bank-scrapers";
import { ScrapingStrategy } from "../types/scraping-strategy.type";
import { ScraperOptionsFactory } from "../factories/scraper-options.factory";
import { MockDataService } from "../../config/mock-data/mock-data.service";

@Injectable()
export class MaxStrategy implements ScrapingStrategy {
  constructor(
    private configService: ConfigService,
    private scraperOptionsFactory: ScraperOptionsFactory,
    private mockDataService: MockDataService,
  ) {}

  getCredentials(): ScraperCredentials {
    return {
      username: this.configService.get("MAX_USERNAME", ""),
      password: this.configService.get("MAX_PASSWORD", ""),
    };
  }

  async getOptions() {
    return this.scraperOptionsFactory.createOptions(CompanyTypes.max);
  }

  getMockData(): string {
    return this.mockDataService.getMockTransactions(CompanyTypes.max);
  }
}