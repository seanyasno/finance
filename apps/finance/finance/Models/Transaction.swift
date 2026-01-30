import Foundation

struct Transaction: Codable, Identifiable {
    let id: String
    let description: String?
    let timestamp: String
    let notes: String?
    let originalAmount: Double
    let originalCurrency: String
    let chargedAmount: Double
    let chargedCurrency: String?
    let status: String
    let creditCardId: String?
    let creditCard: CreditCard?
    let categoryId: String?
    let category: Category?

    enum CodingKeys: String, CodingKey {
        case id
        case description
        case timestamp
        case notes
        case originalAmount
        case originalCurrency
        case chargedAmount
        case chargedCurrency
        case status
        case creditCardId
        case creditCard
        case categoryId
        case category
    }

    // MARK: - Computed Properties

    var formattedAmount: String {
        let currencySymbol = currencySymbol(for: chargedCurrency ?? originalCurrency)
        return String(format: "%@%.2f", currencySymbol, chargedAmount)
    }

    var formattedDate: String {
        guard let date = ISO8601DateFormatter().date(from: timestamp) else {
            return timestamp
        }

        let formatter = DateFormatter()
        formatter.dateStyle = .medium
        formatter.timeStyle = .short
        return formatter.string(from: date)
    }

    var merchantName: String {
        return description ?? "Unknown"
    }

    var categoryName: String? {
        category?.name
    }

    // MARK: - Private Helpers

    private func currencySymbol(for currencyCode: String) -> String {
        switch currencyCode.uppercased() {
        case "USD": return "$"
        case "EUR": return "€"
        case "GBP": return "£"
        case "ILS": return "₪"
        default: return currencyCode + " "
        }
    }
}

// MARK: - Update Request

struct UpdateTransactionRequest: Codable {
    let categoryId: String?
    let notes: String?

    enum CodingKeys: String, CodingKey {
        case categoryId
        case notes
    }
}
