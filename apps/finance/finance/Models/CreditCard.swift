import Foundation

struct CreditCard: Codable, Identifiable, Hashable {
    let id: String
    let cardNumber: String
    let company: String
    let createdAt: String?

    enum CodingKeys: String, CodingKey {
        case id
        case cardNumber
        case company
        case createdAt
    }
}
