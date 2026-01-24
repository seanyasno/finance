import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CompanyTypes, ScraperCredentials } from "israeli-bank-scrapers";
import { ScrapingStrategy } from "../types/scraping-strategy.type";
import { ScraperOptionsFactory } from "../factories/scraper-options.factory";
import { MockDataService } from "../../config/mock-data/mock-data.service";

@Injectable()
export class VisaCalStrategy implements ScrapingStrategy {
  constructor(
    private configService: ConfigService,
    private scraperOptionsFactory: ScraperOptionsFactory,
    private mockDataService: MockDataService,
  ) {}

  getCredentials(): ScraperCredentials {
    return {
      username: this.configService.get("VISA_CAL_USERNAME", ""),
      password: this.configService.get("VISA_CAL_PASSWORD", ""),
    };
  }

  async getOptions() {
    return this.scraperOptionsFactory.createOptions(CompanyTypes.visaCal);
  }

  getMockData(): string {
    return this.mockDataService.getMockTransactions(CompanyTypes.visaCal);
  }
}
