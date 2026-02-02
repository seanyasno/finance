//
// CardLabel.swift
// finance
//
// Reusable card label component displaying "CardName 1234" format
//

import SwiftUI

struct CardLabel: View {
    let companyName: String
    let last4Digits: String

    var body: some View {
        HStack(spacing: 4) {
            Text(companyName)
            Text(last4Digits)
                .monospaced()
        }
        .font(.caption)
        .foregroundColor(.secondary)
    }
}

// MARK: - Convenience Initializers

extension CardLabel {
    /// Create CardLabel from CreditCard model
    init(card: CreditCard) {
        self.companyName = card.company.rawValue
        self.last4Digits = String(card.cardNumber.suffix(4))
    }

    /// Create CardLabel from TransactionCreditCard model
    init(card: TransactionCreditCard) {
        self.companyName = card.company.rawValue
        self.last4Digits = String(card.cardNumber.suffix(4))
    }
}

// MARK: - Preview

#Preview {
    VStack(alignment: .leading, spacing: 16) {
        Text("Card Label Examples")
            .font(.headline)

        CardLabel(companyName: "Max", last4Digits: "1234")
        CardLabel(companyName: "Isracard", last4Digits: "5678")
        CardLabel(companyName: "Cal", last4Digits: "9012")

        Divider()

        Text("With Custom Styling")
            .font(.headline)

        CardLabel(companyName: "Max", last4Digits: "1234")
            .font(.body)
            .foregroundColor(.primary)

        CardLabel(companyName: "Isracard", last4Digits: "5678")
            .font(.subheadline)
            .foregroundColor(.blue)
    }
    .padding()
}
