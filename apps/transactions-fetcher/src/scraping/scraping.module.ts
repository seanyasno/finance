import { Module } from "@nestjs/common";
import { ScrapingService } from "./scraping.service";
import { DiscountStrategy } from "./strategies/discount.strategy";
import { IsracardStrategy } from "./strategies/isracard.strategy";
import { MaxStrategy } from "./strategies/max.strategy";
import { OneZeroStrategy } from "./strategies/one-zero.strategy";
import { ScraperOptionsFactory } from "./factories/scraper-options.factory";
import { ConfigModule } from "../config/config.module";

@Module({
  imports: [ConfigModule],
  providers: [
    ScrapingService,
    DiscountStrategy,
    IsracardStrategy,
    MaxStrategy,
    OneZeroStrategy,
    ScraperOptionsFactory,
  ],
  exports: [ScrapingService],
})
export class ScrapingModule {}