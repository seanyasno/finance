import { CompanyTypes } from "israeli-bank-scrapers";
import { TransactionsAccount } from "israeli-bank-scrapers/lib/transactions";

export type FetchedTransactions = {
  discountTransactions: TransactionsAccount[];
  oneZeroTransactions: TransactionsAccount[];
  isracardTransactions: TransactionsAccount[];
  maxTransactions: TransactionsAccount[];
  visaCalTransactions: TransactionsAccount[];
};

export type SaveTransactionsParams = {
  accounts: TransactionsAccount[];
  companyType: CompanyTypes;
  userId: string;
};
