import { Module, OnModuleInit } from '@nestjs/common';
import { DatabaseModule } from '@finance/database';
import { AuthModule } from '../auth/auth.module';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule implements OnModuleInit {
  constructor(private readonly categoriesService: CategoriesService) {}

  async onModuleInit() {
    await this.categoriesService.seedDefaults();
  }
}
