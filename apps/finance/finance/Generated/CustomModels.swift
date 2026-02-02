//
// CustomModels.swift
// finance
//
// Client-only models that are not part of the API
// This file is NOT auto-generated and should be maintained manually
//

import Foundation
import SwiftUI

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

        // First: Find the start of the CURRENT billing cycle
        // If we're before the billing day, current cycle started last month
        var baseMonthOffset = 0
        if currentDay < billingDay {
            baseMonthOffset = -1
        }

        // Combine base with navigation offset
        let totalMonthOffset = baseMonthOffset + offset

        components.day = min(billingDay, daysInMonth(year: components.year!, month: components.month!))
        if let adjustedDate = calendar.date(from: components),
           let startDate = calendar.date(byAdding: .month, value: totalMonthOffset, to: adjustedDate),
           let nextCycleStart = calendar.date(byAdding: .month, value: 1, to: startDate),
           let endDate = calendar.date(byAdding: .day, value: -1, to: nextCycleStart),
           let endOfDayDate = calendar.date(bySettingHour: 23, minute: 59, second: 59, of: endDate) {
            return BillingCycle(startDate: startDate, endDate: endOfDayDate, card: card)
        }
        let fallbackStart = calendar.date(from: DateComponents(year: components.year, month: components.month, day: 1))!
        let fallbackEnd = calendar.date(byAdding: DateComponents(month: 1, day: -1), to: fallbackStart)!
        let fallbackEndOfDay = calendar.date(bySettingHour: 23, minute: 59, second: 59, of: fallbackEnd)!
        return BillingCycle(startDate: fallbackStart, endDate: fallbackEndOfDay, card: card)
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

/// Empty request body for endpoints that don't require a body
struct EmptyBody: Codable {}

/// Empty response for endpoints that don't return data
struct EmptyResponse: Codable {}

/// Unified trend direction enum matching API trend values
enum TrendDirection: String, Codable, CaseIterable {
    case up = "up"
    case down = "down"
    case stable = "stable"
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
