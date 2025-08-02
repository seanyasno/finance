import { Injectable } from "@nestjs/common";
import { db } from "@finance/database";
import { CreditCardCompanyType } from "../../common/types/credit-card-company.type";

@Injectable()
export class CreditCardService {
  async upsertCreditCard(
    cardNumber: string,
    userId: string,
    companyType: CreditCardCompanyType,
  ) {
    return db.credit_cards.upsert({
      where: {
        user_id_card_number: {
          user_id: userId,
          card_number: cardNumber,
        },
      },
      update: {},
      create: {
        card_number: cardNumber,
        company: companyType,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }
}