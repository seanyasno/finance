import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CompanyTypes, ScraperCredentials } from "israeli-bank-scrapers";
import { ScrapingStrategy } from "../types/scraping-strategy.type";
import { ScraperOptionsFactory } from "../factories/scraper-options.factory";
import { MockDataService } from "../../config/mock-data/mock-data.service";

@Injectable()
export class OneZeroStrategy implements ScrapingStrategy {
  constructor(
    private configService: ConfigService,
    private scraperOptionsFactory: ScraperOptionsFactory,
    private mockDataService: MockDataService,
  ) {}

  getCredentials(): ScraperCredentials {
    return {
      email: this.configService.get("ONE_ZERO_EMAIL", ""),
      password: this.configService.get("ONE_ZERO_PASSWORD", ""),
      phoneNumber: this.configService.get("ONE_ZERO_PHONE_NUMBER", ""),
      otpLongTermToken: this.configService.get("ONE_ZERO_OTP_TOKEN", ""),
    };
  }

  async getOptions() {
    return this.scraperOptionsFactory.createOptions(CompanyTypes.oneZero);
  }

  getMockData(): string {
    return this.mockDataService.getMockTransactions(CompanyTypes.oneZero);
  }
}