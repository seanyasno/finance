import { Module } from "@nestjs/common";
import { TransactionsController } from "./transactions.controller";
import { TransactionsService } from "./transactions.service";
import { ScrapingModule } from "../scraping/scraping.module";
import { DatabaseModule } from "../database/database.module";

@Module({
  imports: [ScrapingModule, DatabaseModule],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}