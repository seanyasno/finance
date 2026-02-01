#!/bin/bash

# Swift code generation from OpenAPI spec
# Generates a full Swift5 client with API methods using openapi-generator-cli

set -e

API_URL="http://localhost:3100/api-json"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
OUTPUT_DIR="$PROJECT_ROOT/apps/finance/finance/Generated"
TEMP_DIR="$OUTPUT_DIR/temp_openapi_client"

echo "🔍 Checking API server..."

# Health check - verify API is running
if ! curl -s -f "$API_URL" > /dev/null 2>&1; then
    echo "❌ Error: API server is not running or not accessible at $API_URL"
    echo ""
    echo "Please start the API server first:"
    echo "  cd apps/api && npm run dev"
    echo ""
    exit 1
fi

echo "✅ API server is running"

# Create output directory if needed
mkdir -p "$OUTPUT_DIR"

echo "🧹 Cleaning previous generated files..."
rm -rf "$OUTPUT_DIR/OpenAPI"
rm -f "$OUTPUT_DIR/ModelExtensions.swift"
rm -f "$OUTPUT_DIR/CustomModels.swift"

echo "📝 Generating Swift5 client with openapi-generator-cli..."

# Generate full Swift client to temp directory
# Configuration:
# - library=urlsession: Use URLSession instead of Alamofire
# - responseAs=Result: Return Result<T, Error> instead of callbacks
# - useSPMFileStructure=false: Don't use SPM file structure
# - useUuidFor=: Don't convert UUID strings to Swift UUID type
npx @openapitools/openapi-generator-cli generate \
    -i "$API_URL" \
    -g swift5 \
    -o "$TEMP_DIR" \
    --additional-properties=library=urlsession,responseAs=Result,useSPMFileStructure=false \
    --type-mappings=UUID=String

echo "✅ OpenAPI client generated successfully"

# Flatten structure - copy generated files to OpenAPI directory
echo "📁 Flattening generated client structure..."
mkdir -p "$OUTPUT_DIR/OpenAPI"
cp -r "$TEMP_DIR/Sources/OpenAPIClient/"*.swift "$OUTPUT_DIR/OpenAPI/" || true
cp -r "$TEMP_DIR/Sources/OpenAPIClient/APIs" "$OUTPUT_DIR/OpenAPI/" || true
cp -r "$TEMP_DIR/Sources/OpenAPIClient/Models" "$OUTPUT_DIR/OpenAPI/" || true

# Clean up temp directory
rm -rf "$TEMP_DIR"

echo "✅ Generated client flattened successfully"

# Create CustomModels.swift for client-only models
echo "📝 Creating CustomModels.swift for client-only models..."

cat > "$OUTPUT_DIR/CustomModels.swift" << 'SWIFT_EOF'
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
SWIFT_EOF

echo "✅ CustomModels.swift created"

# Create ModelExtensions.swift with type aliases and extensions
echo "📝 Creating ModelExtensions.swift with type aliases and extensions..."

cat > "$OUTPUT_DIR/ModelExtensions.swift" << 'SWIFT_EOF'
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
SWIFT_EOF

echo "✅ ModelExtensions.swift created"

echo ""
echo "✅ Swift client generation complete!"
echo "📁 Generated client: apps/finance/finance/Generated/OpenAPI/"
echo "📁 Model extensions: apps/finance/finance/Generated/ModelExtensions.swift"
echo "📁 Custom models: apps/finance/finance/Generated/CustomModels.swift"
echo ""
echo "✨ Generated client includes:"
echo "   - Full API methods (not just models)"
echo "   - Type-safe request/response handling"
echo "   - URLSession-based networking"
echo "   - Flattened structure for easy Xcode integration"
