//
// ModelExtensions.swift
// finance
//
// Type aliases and extensions for generated OpenAPI models
// Bridges generated DTOs to simple names used throughout the app
//

import Foundation
import SwiftUI

// MARK: - Type Aliases (Generated -> Simple Names)

// Transaction models
typealias Transaction = TransactionsResponseDtoTransactionsInner
typealias TransactionCreditCard = TransactionsResponseDtoTransactionsInnerCreditCard
typealias TransactionCategory = TransactionsResponseDtoTransactionsInnerCategory

// Credit card models
typealias CreditCard = CreditCardsResponseDtoCreditCardsInner

// Category models
typealias Category = CategoriesResponseDtoCategoriesInner

// Statistics models
typealias SpendingSummary = SpendingSummaryDto
typealias MonthlySpending = SpendingSummaryDtoMonthsInner
typealias CategorySpending = SpendingSummaryDtoMonthsInnerCategoryBreakdownInner
typealias MonthComparison = SpendingSummaryDtoComparison
typealias CategoryComparison = SpendingSummaryDtoComparisonCategoryComparisonsInner
typealias SpendingTrends = SpendingSummaryDtoTrends
typealias CategoryTrend = SpendingSummaryDtoTrendsCategoryTrendsInner

// User/Auth models
typealias User = AuthResponseDtoUser

// Request DTOs
typealias LoginRequest = LoginDto
typealias RegisterRequest = RegisterDto
typealias UpdateTransactionRequest = UpdateTransactionDto
typealias UpdateCreditCardRequest = UpdateCreditCardDto
typealias CreateCategoryRequest = CreateCategoryDto

// Response wrappers
typealias TransactionsResponse = TransactionsResponseDto
typealias CreditCardsResponse = CreditCardsResponseDto
typealias CategoriesResponse = CategoriesResponseDto
typealias UserResponse = UserResponseDto
typealias AuthResponse = AuthResponseDto
typealias MessageResponse = MessageResponseDto

// MARK: - Transaction Extensions

extension Transaction: Identifiable {
    // Generated model already has 'id' property

    var formattedAmount: String {
        String(format: "%.2f %@", chargedAmount, chargedCurrency ?? originalCurrency)
    }

    var formattedDate: String {
        return DateFormatting.formatShortDate(date)
    }

    var merchantName: String {
        description ?? "Unknown Merchant"
    }

    var date: Date {
        guard let timestampString = timestamp as? String else {
            return Date()
        }
        return ISO8601DateFormatter().date(from: timestampString) ?? Date()
    }

    var dateGroupingKey: String {
        return DateFormatting.dateGroupingKey(date)
    }

    var sectionHeaderTitle: String {
        return DateFormatting.sectionHeader(for: date)
    }

    var categoryName: String {
        category?.name ?? "Uncategorized"
    }
}

// MARK: - Transaction Nested Types Extensions

extension TransactionCategory {
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

// MARK: - Credit Card Extensions

extension CreditCard: Identifiable {
    // Generated model already has 'id' property

    var displayName: String {
        "\(company.rawValue) ****\(String(cardNumber.suffix(4)))"
    }

    var effectiveBillingCycleDay: Int {
        billingCycleStartDay ?? 1
    }
}

// MARK: - Category Extensions

extension Category: Identifiable {
    // Generated model already has 'id' property

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

// MARK: - Statistics Extensions

extension MonthlySpending: Identifiable {
    public var id: String { month }

    var formattedTotal: String {
        String(format: "%.0f", total)
    }
}

extension CategorySpending: Identifiable {
    public var id: String { categoryId ?? "uncategorized" }
}

extension CategoryComparison: Identifiable {
    public var id: String { categoryId ?? "uncategorized" }
}

extension CategoryTrend: Identifiable {
    public var id: String { categoryId ?? "uncategorized" }
}

// MARK: - User Extensions

extension User: Identifiable {
    // Generated model already has 'id' property
}

// MARK: - Trend Direction Conversions

extension SpendingSummaryDtoComparison {
    var trendDirection: TrendDirection {
        TrendDirection(rawValue: trend.rawValue) ?? .stable
    }
}

extension SpendingSummaryDtoTrends {
    var overallTrend: TrendDirection {
        TrendDirection(rawValue: overall.rawValue) ?? .stable
    }
}

extension SpendingSummaryDtoComparisonCategoryComparisonsInner {
    var trendDirection: TrendDirection {
        TrendDirection(rawValue: trend.rawValue) ?? .stable
    }
}

extension SpendingSummaryDtoTrendsCategoryTrendsInner {
    var trendDirection: TrendDirection {
        TrendDirection(rawValue: trend.rawValue) ?? .stable
    }
}
