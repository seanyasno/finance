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

extension Transaction: Identifiable, Hashable {
    public var id: String { _id }

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
        _description ?? "Unknown Merchant"
    }

    var date: Date {
        ISO8601DateFormatter().date(from: timestamp) ?? Date()
    }

    var categoryName: String {
        category?.name ?? "Uncategorized"
    }

    public func hash(into hasher: inout Hasher) {
        hasher.combine(_id)
    }

    public static func == (lhs: Transaction, rhs: Transaction) -> Bool {
        lhs._id == rhs._id
    }
}

// MARK: - Transaction Nested Types Extensions

extension TransactionCreditCard: Hashable {
    public func hash(into hasher: inout Hasher) {
        hasher.combine(id)
    }

    public static func == (lhs: TransactionCreditCard, rhs: TransactionCreditCard) -> Bool {
        lhs.id == rhs.id
    }
}

extension TransactionCategory: Hashable {
    var displayIcon: String {
        icon ?? "tag"
    }

    var displayColor: Color {
        if let colorHex = color {
            return Color(hex: colorHex) ?? .blue
        }
        return .blue
    }

    public func hash(into hasher: inout Hasher) {
        hasher.combine(id)
    }

    public static func == (lhs: TransactionCategory, rhs: TransactionCategory) -> Bool {
        lhs.id == rhs.id
    }
}

// MARK: - Credit Card Extensions

extension CreditCard: Identifiable, Hashable {
    public var id: String { _id }

    var displayName: String {
        "\(company) ****\(String(cardNumber.suffix(4)))"
    }

    var effectiveBillingCycleDay: Int {
        billingCycleStartDay ?? 1
    }

    public func hash(into hasher: inout Hasher) {
        hasher.combine(_id)
    }

    public static func == (lhs: CreditCard, rhs: CreditCard) -> Bool {
        lhs._id == rhs._id
    }
}

// MARK: - Category Extensions

extension Category: Identifiable {
    public var id: String { _id }

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
    public var id: String { _id }
}
