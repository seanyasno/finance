import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CompanyTypes } from "israeli-bank-scrapers";

@Injectable()
export class MockDataService {
  constructor(private configService: ConfigService) {}

  getMockTransactions(companyType: CompanyTypes): string {
    switch (companyType) {
      case CompanyTypes.discount:
        return this.configService.get("DISCOUNT_TRANSACTIONS_MOCK", "");
      case CompanyTypes.isracard:
        return this.configService.get("ISRACARD_TRANSACTIONS_MOCK", "");
      case CompanyTypes.max:
        return this.configService.get("MAX_TRANSACTIONS_MOCK", "");
      case CompanyTypes.oneZero:
        return this.configService.get("ONE_ZERO_TRANSACTIONS_MOCK", "");
      case CompanyTypes.visaCal:
        return this.configService.get("VISA_CAL_TRANSACTIONS_MOCK", "");
      default:
        throw new Error(`Unsupported company type: ${companyType}`);
    }
  }
}