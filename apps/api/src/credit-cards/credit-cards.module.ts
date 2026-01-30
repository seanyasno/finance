import { Module } from '@nestjs/common';
import { DatabaseModule } from '@finance/database';
import { AuthModule } from '../auth/auth.module';
import { CreditCardsController } from './credit-cards.controller';
import { CreditCardsService } from './credit-cards.service';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [CreditCardsController],
  providers: [CreditCardsService],
})
export class CreditCardsModule {}
