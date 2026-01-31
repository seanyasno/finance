import Foundation
import Combine

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
