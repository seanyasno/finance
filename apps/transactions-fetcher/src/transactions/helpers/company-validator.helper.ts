import { CompanyTypes } from "israeli-bank-scrapers";
import { BANK_COMPANIES, CREDIT_CARD_COMPANIES } from "../../common/constants/company-types.constant";
import { BankCompanyType } from "../../common/types/bank-company.type";
import { CreditCardCompanyType } from "../../common/types/credit-card-company.type";

export class CompanyValidatorHelper {
  static isBankAccount(companyType: CompanyTypes): companyType is BankCompanyType {
    return (BANK_COMPANIES as unknown as CompanyTypes[]).includes(companyType);
  }

  static isCreditCard(companyType: CompanyTypes): companyType is CreditCardCompanyType {
    return (CREDIT_CARD_COMPANIES as unknown as CompanyTypes[]).includes(companyType);
  }

  static validateBankAccountCompany(companyType: CompanyTypes): void {
    if (!this.isBankAccount(companyType)) {
      throw new Error(
        `Company type ${companyType} does not support bank accounts with balance.`,
      );
    }
  }

  static validateCreditCardCompany(companyType: CompanyTypes): void {
    if (!this.isCreditCard(companyType)) {
      throw new Error(
        `Company type ${companyType} does not support credit card transactions.`,
      );
    }
  }
}