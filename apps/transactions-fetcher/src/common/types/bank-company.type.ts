import { CompanyTypes } from "israeli-bank-scrapers";

export type BankCompanyType = Extract<
  CompanyTypes,
  CompanyTypes.discount | CompanyTypes.oneZero
>;