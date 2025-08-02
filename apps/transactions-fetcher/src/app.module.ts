import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TransactionsModule } from './transactions/transactions.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [ConfigModule, TransactionsModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}