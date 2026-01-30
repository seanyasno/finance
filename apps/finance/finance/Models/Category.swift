import Foundation
import SwiftUI

struct Category: Codable, Identifiable {
    let id: String
    let name: String
    let icon: String?
    let color: String?
    let isDefault: Bool

    enum CodingKeys: String, CodingKey {
        case id, name, icon, color
        case isDefault
    }

    // MARK: - Computed Properties

    var displayIcon: String {
        return icon ?? "tag.fill"
    }

    var displayColor: Color {
        guard let color = color else {
            return .gray
        }

        // Parse hex color (format: #RRGGBB)
        let hex = color.trimmingCharacters(in: CharacterSet(charactersIn: "#"))

        guard hex.count == 6,
              let red = Int(hex.prefix(2), radix: 16),
              let green = Int(hex.dropFirst(2).prefix(2), radix: 16),
              let blue = Int(hex.suffix(2), radix: 16) else {
            return .gray
        }

        return Color(
            red: Double(red) / 255.0,
            green: Double(green) / 255.0,
            blue: Double(blue) / 255.0
        )
    }

    var isCustom: Bool {
        return !isDefault
    }
}

// MARK: - Response Wrappers

struct CategoriesResponse: Codable {
    let categories: [Category]
}

// MARK: - Request Models

struct CreateCategoryRequest: Codable {
    let name: String
    let icon: String?
    let color: String?
}
