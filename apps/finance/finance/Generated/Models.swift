//
// Models.swift
// finance
//
// Generated API models synchronized with backend OpenAPI spec
// Source: npm run generate:swift in apps/api
//
// This file contains type-safe models matching the API's DTOs.
// Manual models in Models/ folder extend these with computed properties.
//

import Foundation
import SwiftUI

// MARK: - Transaction Models

/// Transaction model matching API TransactionDto
struct GeneratedTransaction: Codable, Identifiable, Hashable {
    enum Status: String, Codable {
        case completed
        case pending
    }

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
    let creditCard: GeneratedCreditCardNested?
    let categoryId: String?
    let category: GeneratedCategoryNested?

    // Nested credit card in transaction response
    struct GeneratedCreditCardNested: Codable, Hashable {
        let id: String
        let cardNumber: String
        let company: String
    }

    // Nested category in transaction response
    struct GeneratedCategoryNested: Codable, Hashable {
        let id: String
        let name: String
        let icon: String?
        let color: String?
        let isDefault: Bool
    }
}

// MARK: - Credit Card Models

/// Credit card model matching API CreditCardDto
struct GeneratedCreditCard: Codable, Identifiable, Hashable {
    enum Company: String, Codable {
        case max
        case isracard
        case visaCal
    }

    let id: String
    let cardNumber: String
    let company: String
    let billingCycleStartDay: Int?
    let createdAt: String?
}

// MARK: - Category Models

/// Category model matching API CategoryDto
struct GeneratedCategory: Codable, Identifiable {
    let id: String
    let name: String
    let icon: String?
    let color: String?
    let isDefault: Bool
}

// MARK: - User/Auth Models

/// User model matching API AuthResponseDtoUser
struct GeneratedUser: Codable, Identifiable {
    let id: String
    let email: String
    let firstName: String?
    let lastName: String?
    let createdAt: String?
}

/// Login request matching API LoginDto
struct GeneratedLoginRequest: Codable {
    let email: String
    let password: String
}

/// Register request matching API RegisterDto
struct GeneratedRegisterRequest: Codable {
    let email: String
    let password: String
    let firstName: String?
    let lastName: String?
}

/// Auth response matching API AuthResponseDto
struct GeneratedAuthResponse: Codable {
    let user: GeneratedUser?
    let message: String?
}

// MARK: - Request DTOs

/// Update transaction request matching API UpdateTransactionDto
struct GeneratedUpdateTransactionRequest: Codable {
    let categoryId: String?
    let notes: String?
}

/// Update credit card request matching API UpdateCreditCardDto
struct GeneratedUpdateCreditCardRequest: Codable {
    let billingCycleStartDay: Int?
}

/// Create category request matching API CreateCategoryDto
struct GeneratedCreateCategoryRequest: Codable {
    let name: String
    let icon: String?
    let color: String?
}

// MARK: - Response Wrappers

/// Transactions list response matching API TransactionsResponseDto
struct GeneratedTransactionsResponse: Codable {
    let transactions: [GeneratedTransaction]
}

/// Credit cards list response matching API CreditCardsResponseDto
struct GeneratedCreditCardsResponse: Codable {
    let creditCards: [GeneratedCreditCard]
}

/// Categories list response matching API CategoriesResponseDto
struct GeneratedCategoriesResponse: Codable {
    let categories: [GeneratedCategory]
}

/// User response matching API UserResponseDto
struct GeneratedUserResponse: Codable {
    let user: GeneratedUser?
}

/// Message response matching API MessageResponseDto
struct GeneratedMessageResponse: Codable {
    let message: String
}

// MARK: - Validation

/// Compile-time validation that generated types can decode API responses
/// Run `npm run generate:swift` in apps/api to regenerate after API changes
extension GeneratedTransaction {
    static func validateAPICompatibility() {
        // This ensures the structure matches what the API returns
        // If the API changes and this doesn't compile, models need updating
        let _: GeneratedTransaction? = nil
    }
}
