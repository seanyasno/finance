//
//  TransactionRowView.swift
//  finance
//
//  Created by Sean Yasnogorodski on 30/01/2026.
//

import SwiftUI

struct TransactionRowView: View {
    let transaction: Transaction
    let showCard: Bool

    init(transaction: Transaction, showCard: Bool = true) {
        self.transaction = transaction
        self.showCard = showCard
    }

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
                    if showCard, let card = transaction.creditCard {
                        CardLabel(card: card)
                    }
                    Text(transaction.formattedDate)
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
            }
            Spacer()
            HStack(spacing: 4) {
                if transaction.isPending {
                    Image(systemName: "clock.fill")
                        .font(.caption)
                        .foregroundColor(.orange)
                }
                Text(transaction.formattedAmount)
                    .font(.body)
                    .fontWeight(.medium)
            }
        }
        .padding(.vertical, 4)
    }
}

#Preview {
    VStack(spacing: 16) {
        Text("Completed Transaction")
            .font(.caption)
            .foregroundColor(.secondary)
        TransactionRowView(
            transaction: Transaction(
                id: "1",
                description: "Starbucks Coffee",
                timestamp: AnyCodable("2026-01-30T12:00:00Z"),
                notes: nil,
                originalAmount: 5.50,
                originalCurrency: "USD",
                chargedAmount: 5.50,
                chargedCurrency: "USD",
                status: .completed,
                creditCardId: "card1",
                creditCard: TransactionCreditCard(
                    id: "card1",
                    cardNumber: "1234567890123456",
                    company: .max
                ),
                categoryId: nil,
                category: nil
            )
        )

        Divider()

        Text("Pending Transaction")
            .font(.caption)
            .foregroundColor(.secondary)
        TransactionRowView(
            transaction: Transaction(
                id: "2",
                description: "Amazon Purchase",
                timestamp: AnyCodable("2026-02-02T10:00:00Z"),
                notes: nil,
                originalAmount: 29.99,
                originalCurrency: "USD",
                chargedAmount: 29.99,
                chargedCurrency: "USD",
                status: .pending,
                creditCardId: "card1",
                creditCard: TransactionCreditCard(
                    id: "card1",
                    cardNumber: "1234567890123456",
                    company: .max
                ),
                categoryId: nil,
                category: nil
            )
        )

        Divider()

        Text("Without Card Display (grouped by card)")
            .font(.caption)
            .foregroundColor(.secondary)
        TransactionRowView(
            transaction: Transaction(
                id: "3",
                description: "Target",
                timestamp: AnyCodable("2026-02-01T15:00:00Z"),
                notes: nil,
                originalAmount: 15.00,
                originalCurrency: "USD",
                chargedAmount: 15.00,
                chargedCurrency: "USD",
                status: .completed,
                creditCardId: "card1",
                creditCard: TransactionCreditCard(
                    id: "card1",
                    cardNumber: "1234567890123456",
                    company: .max
                ),
                categoryId: nil,
                category: nil
            ),
            showCard: false
        )
    }
    .padding()
}
