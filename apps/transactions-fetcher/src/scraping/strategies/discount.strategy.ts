import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CompanyTypes, ScraperCredentials } from "israeli-bank-scrapers";
import { ScrapingStrategy } from "../types/scraping-strategy.type";
import { ScraperOptionsFactory } from "../factories/scraper-options.factory";
import { MockDataService } from "../../config/mock-data/mock-data.service";

@Injectable()
export class DiscountStrategy implements ScrapingStrategy {
  constructor(
    private configService: ConfigService,
    private scraperOptionsFactory: ScraperOptionsFactory,
    private mockDataService: MockDataService,
  ) {}

  getCredentials(): ScraperCredentials {
    return {
      id: this.configService.get("DISCOUNT_ID", ""),
      password: this.configService.get("DISCOUNT_PASSWORD", ""),
      num: this.configService.get("DISCOUNT_NUM", ""),
    };
  }

  async getOptions() {
    return this.scraperOptionsFactory.createOptions(CompanyTypes.discount);
  }

  getMockData(): string {
    return this.mockDataService.getMockTransactions(CompanyTypes.discount);
  }
}