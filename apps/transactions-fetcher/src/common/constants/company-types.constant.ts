import { CompanyTypes } from "israeli-bank-scrapers";

export const BANK_COMPANIES = [
  CompanyTypes.discount,
  CompanyTypes.oneZero,
] as const;

export const CREDIT_CARD_COMPANIES = [
  CompanyTypes.max,
  CompanyTypes.isracard,
  CompanyTypes.visaCal,
] as const;