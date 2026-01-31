//
//  TransactionRowView.swift
//  finance
//
//  Created by Sean Yasnogorodski on 30/01/2026.
//

import SwiftUI

struct TransactionRowView: View {
    let transaction: Transaction

    var body: some View {
        HStack {
            VStack(alignment: .leading, spacing: 4) {
                HStack(spacing: 6) {
                    Text(transaction.merchantName)
                        .font(.headline)
                    if let category = transaction.category {
                        Image(systemName: category.displayIcon)
                            .foregroundColor(category.displayColor)
                            .font(.caption)
                    }
                }
                HStack(spacing: 8) {
                    if let card = transaction.creditCard {
                        Text("****\(card.cardNumber.suffix(4))")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                    Text(transaction.formattedDate)
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
            }
            Spacer()
            Text(transaction.formattedAmount)
                .font(.body)
                .fontWeight(.medium)
        }
        .padding(.vertical, 4)
    }
}

#Preview {
    TransactionRowView(
        transaction: Transaction(
            id: "1",
            description: "Starbucks Coffee",
            timestamp: "2026-01-30T12:00:00Z",
            notes: nil,
            originalAmount: 5.50,
            originalCurrency: "USD",
            chargedAmount: 5.50,
            chargedCurrency: "USD",
            status: "completed",
            creditCardId: "card1",
            creditCard: CreditCard(
                id: "card1",
                cardNumber: "1234567890123456",
                company: "Visa",
                billingCycleStartDay: nil,
                createdAt: nil
            ),
            categoryId: nil,
            category: nil
        )
    )
    .padding()
}
