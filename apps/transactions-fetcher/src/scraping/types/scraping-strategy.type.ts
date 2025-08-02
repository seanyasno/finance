import { ScraperCredentials, ScraperOptions } from "israeli-bank-scrapers";

export type ScrapingStrategy = {
  getCredentials(): ScraperCredentials;
  getOptions(): Promise<ScraperOptions>;
  getMockData(): string;
};
