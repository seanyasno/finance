import { Module } from "@nestjs/common";
import { ConfigModule as NestConfigModule } from "@nestjs/config";
import { MockDataService } from "./mock-data/mock-data.service";

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [MockDataService],
  exports: [MockDataService],
})
export class ConfigModule {}