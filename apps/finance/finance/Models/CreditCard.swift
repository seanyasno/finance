import Foundation

struct CreditCard: Codable, Identifiable, Hashable {
    let id: String
    let cardNumber: String
    let company: String
    let billingCycleStartDay: Int?
    let createdAt: String?

    enum CodingKeys: String, CodingKey {
        case id
        case cardNumber
        case company
        case billingCycleStartDay
        case createdAt
    }

    // MARK: - Computed Properties

    /// Returns the effective billing cycle start day (defaults to 1 if not set)
    var effectiveBillingCycleDay: Int {
        billingCycleStartDay ?? 1
    }

    /// Display name for the credit card (last 4 digits)
    var displayName: String {
        let last4 = String(cardNumber.suffix(4))
        return "\(company.capitalized) ****\(last4)"
    }
}
