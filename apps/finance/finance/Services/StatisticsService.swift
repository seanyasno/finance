import Foundation
import Combine

// MARK: - Response Models

struct CategorySpending: Codable, Identifiable {
    let categoryId: String?
    let categoryName: String
    let amount: Double
    let percentage: Int
    let transactionCount: Int

    var id: String { categoryId ?? "uncategorized" }
}

struct MonthlySpending: Codable, Identifiable {
    let month: String        // "2026-01" format
    let monthLabel: String   // "January 2026"
    let total: Double
    let categoryBreakdown: [CategorySpending]

    var id: String { month }

    var formattedTotal: String {
        String(format: "%.0f", total)
    }
}

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

struct CategoryTrend: Codable, Identifiable {
    let categoryId: String?
    let categoryName: String
    let trend: TrendDirection
    let averageMonthly: Double
    let currentMonth: Double
    let changePercent: Int

    var id: String { categoryId ?? "uncategorized" }
}

struct SpendingTrends: Codable {
    let overall: TrendDirection
    let overallAverageMonthly: Double
    let categoryTrends: [CategoryTrend]
}

enum TrendDirection: String, Codable {
    case up
    case down
    case stable
}

struct SpendingSummary: Codable {
    let months: [MonthlySpending]
    let comparison: MonthComparison
    let trends: SpendingTrends
}

struct SpendingSummaryResponse: Codable {
    let summary: SpendingSummary
}

// MARK: - Statistics Service

@MainActor
class StatisticsService: ObservableObject {
    private let apiService: APIService

    @Published var summary: SpendingSummary?
    @Published var isLoading = false
    @Published var error: String?

    init(apiService: APIService = .shared) {
        self.apiService = apiService
    }

    func fetchSpendingSummary() async {
        isLoading = true
        error = nil

        do {
            let response: SpendingSummary = try await apiService.get(
                "/statistics/spending-summary",
                authenticated: true
            )
            summary = response
            isLoading = false
        } catch let apiError as APIError {
            handleAPIError(apiError)
        } catch {
            self.error = "An unexpected error occurred: \(error.localizedDescription)"
            isLoading = false
        }
    }

    private func handleAPIError(_ error: APIError) {
        switch error {
        case .invalidURL:
            self.error = "Invalid URL"
        case .networkError(let underlyingError):
            self.error = "Network error: \(underlyingError.localizedDescription)"
        case .invalidResponse:
            self.error = "Invalid response from server"
        case .httpError(let statusCode, let message):
            self.error = message ?? "HTTP error: \(statusCode)"
        case .decodingError(let underlyingError):
            self.error = "Failed to decode response: \(underlyingError.localizedDescription)"
        }
        isLoading = false
    }
}
