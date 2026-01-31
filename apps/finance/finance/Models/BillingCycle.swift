//
//  BillingCycle.swift
//  finance
//

import Foundation

/// Represents a billing cycle period with start and end dates
struct BillingCycle: Identifiable, Equatable {
    let startDate: Date
    let endDate: Date
    let card: CreditCard?  // nil for calendar month or combined view

    var id: String {
        let formatter = ISO8601DateFormatter()
        let cardId = card?.id ?? "all"
        return "\(cardId)-\(formatter.string(from: startDate))"
    }

    /// Display string for the period (e.g., "Jan 15 - Feb 14, 2026")
    var displayPeriod: String {
        let formatter = DateFormatter()
        formatter.dateFormat = "MMM d"

        let endFormatter = DateFormatter()
        endFormatter.dateFormat = "MMM d, yyyy"

        return "\(formatter.string(from: startDate)) - \(endFormatter.string(from: endDate))"
    }

    /// Days remaining in the cycle (0 if period has ended)
    var daysRemaining: Int {
        let calendar = Calendar.current
        let today = calendar.startOfDay(for: Date())
        let end = calendar.startOfDay(for: endDate)

        if today > end {
            return 0
        }

        let components = calendar.dateComponents([.day], from: today, to: end)
        return max(0, (components.day ?? 0) + 1)  // +1 to include end date
    }

    /// Whether this is the current (in-progress) cycle
    var isCurrent: Bool {
        let today = Date()
        return today >= startDate && today <= endDate
    }

    // MARK: - Static Factory Methods

    /// Creates a billing cycle for a specific card and offset (0 = current, -1 = previous, etc.)
    static func forCard(_ card: CreditCard, offset: Int = 0) -> BillingCycle {
        let billingDay = card.effectiveBillingCycleDay
        return calculateCycle(billingDay: billingDay, offset: offset, card: card)
    }

    /// Creates a calendar month cycle (1st to end of month)
    static func calendarMonth(offset: Int = 0) -> BillingCycle {
        return calculateCycle(billingDay: 1, offset: offset, card: nil)
    }

    /// Calculate the billing cycle dates for a given billing day and offset
    private static func calculateCycle(billingDay: Int, offset: Int, card: CreditCard?) -> BillingCycle {
        let calendar = Calendar.current
        let today = Date()

        // Get current month/year
        var components = calendar.dateComponents([.year, .month, .day], from: today)
        let currentDay = components.day ?? 1

        // Determine which cycle we're in
        // If today is before billing day, we're in the previous month's cycle
        var monthOffset = offset
        if currentDay < billingDay {
            monthOffset -= 1
        }

        // Calculate start date
        components.day = min(billingDay, daysInMonth(year: components.year!, month: components.month!))
        if let adjustedDate = calendar.date(from: components),
           let startDate = calendar.date(byAdding: .month, value: monthOffset, to: adjustedDate) {

            // End date is one day before next cycle starts
            if let nextCycleStart = calendar.date(byAdding: .month, value: 1, to: startDate),
               let endDate = calendar.date(byAdding: .day, value: -1, to: nextCycleStart) {

                return BillingCycle(startDate: startDate, endDate: endDate, card: card)
            }
        }

        // Fallback: shouldn't happen, but return current month
        let fallbackStart = calendar.date(from: DateComponents(year: components.year, month: components.month, day: 1))!
        let fallbackEnd = calendar.date(byAdding: DateComponents(month: 1, day: -1), to: fallbackStart)!
        return BillingCycle(startDate: fallbackStart, endDate: fallbackEnd, card: card)
    }

    /// Get number of days in a specific month
    private static func daysInMonth(year: Int, month: Int) -> Int {
        let calendar = Calendar.current
        let components = DateComponents(year: year, month: month)
        if let date = calendar.date(from: components),
           let range = calendar.range(of: .day, in: .month, for: date) {
            return range.count
        }
        return 30  // Fallback
    }
}

// MARK: - View Mode

enum BillingCycleViewMode: String, CaseIterable, Identifiable {
    case combined = "All Cards"
    case singleCard = "Single Card"
    case calendarMonth = "Calendar Month"

    var id: String { rawValue }
}
