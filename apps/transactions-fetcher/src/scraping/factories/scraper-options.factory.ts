import { Injectable } from "@nestjs/common";
import { CompanyTypes, ScraperOptions } from "israeli-bank-scrapers";
import puppeteer from "puppeteer";

@Injectable()
export class ScraperOptionsFactory {
  async createOptions(companyType: CompanyTypes): Promise<ScraperOptions> {
    const browser = await puppeteer.launch();
    const browserContext = await browser.createBrowserContext();

    return {
      companyId: companyType,
      startDate: new Date("2025-01-01"),
      combineInstallments: false,
      browser: browserContext as any,
      timeout: 120000,
      defaultTimeout: 120000,
      skipCloseBrowser: true,
    };
  }
}