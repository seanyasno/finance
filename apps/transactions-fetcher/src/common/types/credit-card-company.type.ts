import { CompanyTypes } from "israeli-bank-scrapers";

export type CreditCardCompanyType = Extract<
  CompanyTypes,
  CompanyTypes.max | CompanyTypes.isracard | CompanyTypes.visaCal
>;