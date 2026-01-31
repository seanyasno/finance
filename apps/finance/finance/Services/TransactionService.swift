import Foundation
import Combine

// MARK: - Response Wrappers

struct TransactionsResponse: Codable {
    let transactions: [Transaction]
}

struct CreditCardsResponse: Codable {
    let creditCards: [CreditCard]
}

struct UpdateCreditCardRequest: Codable {
    let billingCycleStartDay: Int?
}

// MARK: - TransactionService

@MainActor
class TransactionService: ObservableObject {
    private let apiService: APIService

    @Published var transactions: [Transaction] = []
    @Published var creditCards: [CreditCard] = []
    @Published var isLoading = false
    @Published var error: String?

    init(apiService: APIService = .shared) {
        self.apiService = apiService
    }

    // MARK: - Fetch Transactions

    func fetchTransactions(
        startDate: Date? = nil,
        endDate: Date? = nil,
        creditCardId: String? = nil
    ) async {
        isLoading = true
        error = nil

        do {
            // Build query string
            var queryParams: [String] = []

            if let startDate = startDate {
                let dateString = ISO8601DateFormatter().string(from: startDate)
                queryParams.append("startDate=\(dateString)")
            }

            if let endDate = endDate {
                let dateString = ISO8601DateFormatter().string(from: endDate)
                queryParams.append("endDate=\(dateString)")
            }

            if let creditCardId = creditCardId {
                queryParams.append("creditCardId=\(creditCardId)")
            }

            let queryString = queryParams.isEmpty ? "" : "?" + queryParams.joined(separator: "&")
            let endpoint = "/transactions\(queryString)"

            // Fetch transactions
            let response: TransactionsResponse = try await apiService.get(endpoint, authenticated: true)
            transactions = response.transactions
            isLoading = false

        } catch let apiError as APIError {
            handleAPIError(apiError)
        } catch {
            self.error = "An unexpected error occurred: \(error.localizedDescription)"
            isLoading = false
        }
    }

    // MARK: - Update Transaction

    func updateTransaction(id: String, categoryId: String?, notes: String?) async -> Transaction? {
        let request = UpdateTransactionRequest(categoryId: categoryId, notes: notes)

        do {
            let updated: Transaction = try await apiService.patch("/transactions/\(id)", body: request)
            // Update local array
            if let index = transactions.firstIndex(where: { $0.id == id }) {
                transactions[index] = updated
            }
            return updated
        } catch let apiError as APIError {
            handleAPIError(apiError)
            return nil
        } catch {
            self.error = "An unexpected error occurred: \(error.localizedDescription)"
            return nil
        }
    }

    // MARK: - Fetch Credit Cards

    func fetchCreditCards() async {
        isLoading = true
        error = nil

        do {
            let response: CreditCardsResponse = try await apiService.get("/credit-cards", authenticated: true)
            creditCards = response.creditCards
            isLoading = false

        } catch let apiError as APIError {
            handleAPIError(apiError)
        } catch {
            self.error = "An unexpected error occurred: \(error.localizedDescription)"
            isLoading = false
        }
    }

    // MARK: - Update Credit Card

    func updateCreditCard(id: String, billingCycleStartDay: Int?) async -> CreditCard? {
        let request = UpdateCreditCardRequest(billingCycleStartDay: billingCycleStartDay)

        do {
            let updated: CreditCard = try await apiService.patch("/credit-cards/\(id)", body: request)
            // Update local array
            if let index = creditCards.firstIndex(where: { $0.id == id }) {
                creditCards[index] = updated
            }
            return updated
        } catch let apiError as APIError {
            handleAPIError(apiError)
            return nil
        } catch {
            self.error = "An unexpected error occurred: \(error.localizedDescription)"
            return nil
        }
    }

    // MARK: - Error Handling

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
