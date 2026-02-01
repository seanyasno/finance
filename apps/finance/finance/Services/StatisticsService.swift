import Foundation
import Combine

// MARK: - Statistics Service

@MainActor
class StatisticsService: ObservableObject {
    @Published var summary: SpendingSummary?
    @Published var isLoading = false
    @Published var error: String?

    func fetchSpendingSummary() async {
        isLoading = true
        error = nil

        await withCheckedContinuation { continuation in
            StatisticsAPI.getSpendingSummary { result in
                Task { @MainActor in
                    switch result {
                    case .success(let response):
                        self.summary = response
                        self.isLoading = false

                    case .failure(let apiError):
                        self.handleOpenAPIError(apiError)
                    }
                    continuation.resume()
                }
            }
        }
    }

    private func handleOpenAPIError(_ error: ErrorResponse) {
        switch error {
        case .error(let statusCode, _, _, let underlyingError):
            self.error = "HTTP \(statusCode): \(underlyingError.localizedDescription)"
        }
        isLoading = false
    }
}
