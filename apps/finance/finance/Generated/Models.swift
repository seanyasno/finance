//
// Models.swift
// finance
//
// Generated from OpenAPI spec
// Run: cd apps/api && npm run generate:swift
//
// This file is AUTO-GENERATED from the API.
// Changes will be overwritten on next generation.
//

import Foundation
import SwiftUI

// MARK: - Transaction Models

/// Transaction from API
struct Transaction: Codable, Identifiable, Hashable {
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
    let creditCard: TransactionCreditCard?
    let categoryId: String?
    let category: TransactionCategory?

    /// Nested credit card in transaction response
    struct TransactionCreditCard: Codable, Hashable {
        let id: String
        let cardNumber: String
        let company: String
    }

    /// Nested category in transaction response
    struct TransactionCategory: Codable, Hashable {
        let id: String
        let name: String
        let icon: String?
        let color: String?
        let isDefault: Bool
    }

    // Computed properties
    var formattedAmount: String {
        String(format: "%.2f %@", chargedAmount, chargedCurrency ?? originalCurrency)
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
        description ?? "Unknown Merchant"
    }

    var date: Date {
        ISO8601DateFormatter().date(from: timestamp) ?? Date()
    }

    var categoryName: String {
        category?.name ?? "Uncategorized"
    }
}

// MARK: - Credit Card Models

/// Credit card model
struct CreditCard: Codable, Identifiable, Hashable {
    let id: String
    let cardNumber: String
    let company: String
    let billingCycleStartDay: Int?
    let createdAt: String?

    // Computed properties
    var displayName: String {
        "\(company) ****\(String(cardNumber.suffix(4)))"
    }

    var effectiveBillingCycleDay: Int {
        billingCycleStartDay ?? 1
    }
}

// MARK: - Category Models

/// Category model
struct Category: Codable, Identifiable {
    let id: String
    let name: String
    let icon: String?
    let color: String?
    let isDefault: Bool

    // Computed properties
    var displayIcon: String {
        icon ?? "tag"
    }

    var displayColor: Color {
        if let colorHex = color {
            return Color(hex: colorHex) ?? .blue
        }
        return .blue
    }
}

// MARK: - Statistics Models

/// Full spending summary response
struct SpendingSummary: Codable {
    let months: [MonthlySpending]
    let comparison: MonthComparison
    let trends: SpendingTrends
}

/// Single month's spending data
struct MonthlySpending: Codable, Identifiable {
    let month: String
    let monthLabel: String
    let total: Double
    let categoryBreakdown: [CategorySpending]

    var id: String { month }

    var formattedTotal: String {
        String(format: "%.0f", total)
    }
}

/// Category spending within a month
struct CategorySpending: Codable, Identifiable {
    let categoryId: String?
    let categoryName: String
    let amount: Double
    let percentage: Int
    let transactionCount: Int

    var id: String { categoryId ?? "uncategorized" }
}

/// Trend direction enum
enum TrendDirection: String, Codable {
    case up
    case down
    case stable
}

/// Month-over-month comparison
struct MonthComparison: Codable {
    let currentMonth: String
    let previousMonth: String?
    let currentTotal: Double
    let previousTotal: Double?
    let changeAmount: Double?
    let changePercent: Int?
    let trend: TrendDirection
    let categoryComparisons: [CategoryComparison]
}

/// Category comparison in month comparison
struct CategoryComparison: Codable, Identifiable {
    let categoryId: String?
    let categoryName: String
    let currentAmount: Double
    let previousAmount: Double?
    let changeAmount: Double?
    let changePercent: Int?
    let trend: TrendDirection

    var id: String { categoryId ?? "uncategorized" }
}

/// Spending trends
struct SpendingTrends: Codable {
    let overall: TrendDirection
    let overallAverageMonthly: Double
    let categoryTrends: [CategoryTrend]
}

/// Category trend
struct CategoryTrend: Codable, Identifiable {
    let categoryId: String?
    let categoryName: String
    let trend: TrendDirection
    let averageMonthly: Double
    let currentMonth: Double
    let changePercent: Int

    var id: String { categoryId ?? "uncategorized" }
}

// MARK: - User/Auth Models

/// User model
struct User: Codable, Identifiable {
    let id: String
    let email: String
    let firstName: String?
    let lastName: String?
    let createdAt: String?
}

/// Login request
struct LoginRequest: Codable {
    let email: String
    let password: String
}

/// Register request
struct RegisterRequest: Codable {
    let email: String
    let password: String
    let firstName: String?
    let lastName: String?
}

/// Auth response
struct AuthResponse: Codable {
    let user: User?
    let message: String?
}

// MARK: - Request DTOs

/// Update transaction request
struct UpdateTransactionRequest: Codable {
    let categoryId: String?
    let notes: String?
}

/// Update credit card request
struct UpdateCreditCardRequest: Codable {
    let billingCycleStartDay: Int?
}

/// Create category request
struct CreateCategoryRequest: Codable {
    let name: String
    let icon: String?
    let color: String?
}

// MARK: - Response Wrappers

/// Transactions list response
struct TransactionsResponse: Codable {
    let transactions: [Transaction]
}

/// Credit cards list response
struct CreditCardsResponse: Codable {
    let creditCards: [CreditCard]
}

/// Categories list response
struct CategoriesResponse: Codable {
    let categories: [Category]
}

/// User response
struct UserResponse: Codable {
    let user: User?
}

/// Message response
struct MessageResponse: Codable {
    let message: String
}

// MARK: - Client-Only Models (Not from API)

/// Billing cycle configuration (client-side only)
struct BillingCycle: Identifiable, Equatable {
    let startDate: Date
    let endDate: Date
    let card: CreditCard?

    var id: String {
        let formatter = ISO8601DateFormatter()
        let cardId = card?.id ?? "all"
        return "\(cardId)-\(formatter.string(from: startDate))"
    }

    var displayPeriod: String {
        let formatter = DateFormatter()
        formatter.dateFormat = "MMM d"
        let endFormatter = DateFormatter()
        endFormatter.dateFormat = "MMM d, yyyy"
        return "\(formatter.string(from: startDate)) - \(endFormatter.string(from: endDate))"
    }

    var daysRemaining: Int {
        let calendar = Calendar.current
        let today = calendar.startOfDay(for: Date())
        let end = calendar.startOfDay(for: endDate)
        if today > end { return 0 }
        let components = calendar.dateComponents([.day], from: today, to: end)
        return max(0, (components.day ?? 0) + 1)
    }

    var isCurrent: Bool {
        let today = Date()
        return today >= startDate && today <= endDate
    }

    static func forCard(_ card: CreditCard, offset: Int = 0) -> BillingCycle {
        let billingDay = card.effectiveBillingCycleDay
        return calculateCycle(billingDay: billingDay, offset: offset, card: card)
    }

    static func calendarMonth(offset: Int = 0) -> BillingCycle {
        return calculateCycle(billingDay: 1, offset: offset, card: nil)
    }

    private static func calculateCycle(billingDay: Int, offset: Int, card: CreditCard?) -> BillingCycle {
        let calendar = Calendar.current
        let today = Date()
        var components = calendar.dateComponents([.year, .month, .day], from: today)
        let currentDay = components.day ?? 1
        var monthOffset = offset
        if currentDay < billingDay { monthOffset -= 1 }
        components.day = min(billingDay, daysInMonth(year: components.year!, month: components.month!))
        if let adjustedDate = calendar.date(from: components),
           let startDate = calendar.date(byAdding: .month, value: monthOffset, to: adjustedDate),
           let nextCycleStart = calendar.date(byAdding: .month, value: 1, to: startDate),
           let endDate = calendar.date(byAdding: .day, value: -1, to: nextCycleStart) {
            return BillingCycle(startDate: startDate, endDate: endDate, card: card)
        }
        let fallbackStart = calendar.date(from: DateComponents(year: components.year, month: components.month, day: 1))!
        let fallbackEnd = calendar.date(byAdding: DateComponents(month: 1, day: -1), to: fallbackStart)!
        return BillingCycle(startDate: fallbackStart, endDate: fallbackEnd, card: card)
    }

    private static func daysInMonth(year: Int, month: Int) -> Int {
        let calendar = Calendar.current
        let components = DateComponents(year: year, month: month)
        if let date = calendar.date(from: components),
           let range = calendar.range(of: .day, in: .month, for: date) {
            return range.count
        }
        return 30
    }
}

/// View mode for billing cycle views
enum BillingCycleViewMode: String, CaseIterable, Identifiable {
    case combined = "All Cards"
    case singleCard = "Single Card"
    case calendarMonth = "Calendar Month"

    var id: String { rawValue }
}

// MARK: - Nested Type Extensions

extension Transaction.TransactionCategory {
    var displayIcon: String {
        icon ?? "tag"
    }

    var displayColor: Color {
        if let colorHex = color {
            return Color(hex: colorHex) ?? .blue
        }
        return .blue
    }
}

// MARK: - Utility Extensions

extension Color {
    init?(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3: (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6: (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8: (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default: return nil
        }
        self.init(.sRGB, red: Double(r) / 255, green: Double(g) / 255, blue: Double(b) / 255, opacity: Double(a) / 255)
    }
}
