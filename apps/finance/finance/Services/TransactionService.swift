import Foundation
import Combine

// MARK: - TransactionService

@MainActor
class TransactionService: ObservableObject {
    @Published var transactions: [Transaction] = []
    @Published var creditCards: [CreditCard] = []
    @Published var isLoading = false
    @Published var error: String?

    // MARK: - Fetch Transactions

    func fetchTransactions(
        startDate: Date? = nil,
        endDate: Date? = nil,
        creditCardId: String? = nil,
        search: String? = nil
    ) async {
        isLoading = true
        error = nil

        await withCheckedContinuation { continuation in
            // Convert dates to ISO8601 strings
            let startDateString = startDate.map { ISO8601DateFormatter().string(from: $0) }
            let endDateString = endDate.map { ISO8601DateFormatter().string(from: $0) }

            TransactionsAPI.getTransactions(
                search: search,
                creditCardId: creditCardId,
                endDate: endDateString,
                startDate: startDateString
            ) { result in
                Task { @MainActor in
                    switch result {
                    case .success(let response):
                        self.transactions = response.transactions
                        self.isLoading = false

                    case .failure(let apiError):
                        self.handleOpenAPIError(apiError)
                    }
                    continuation.resume()
                }
            }
        }
    }

    // MARK: - Update Transaction

    func updateTransaction(id: String, categoryId: String?, notes: String?) async -> Bool {
        let request = UpdateTransactionRequest(categoryId: categoryId, notes: notes)

        return await withCheckedContinuation { continuation in
            TransactionsAPI.updateTransaction(id: id, updateTransactionDto: request) { result in
                Task { @MainActor in
                    switch result {
                    case .success:
                        // Refetch transactions to get updated data
                        // (API returns different DTO type than list type)
                        continuation.resume(returning: true)

                    case .failure(let apiError):
                        self.handleOpenAPIError(apiError)
                        continuation.resume(returning: false)
                    }
                }
            }
        }
    }

    // MARK: - Fetch Credit Cards

    func fetchCreditCards() async {
        isLoading = true
        error = nil

        await withCheckedContinuation { continuation in
            CreditCardsAPI.getCreditCards { result in
                Task { @MainActor in
                    switch result {
                    case .success(let response):
                        self.creditCards = response.creditCards
                        self.isLoading = false

                    case .failure(let apiError):
                        self.handleOpenAPIError(apiError)
                    }
                    continuation.resume()
                }
            }
        }
    }

    // MARK: - Update Credit Card

    func updateCreditCard(id: String, billingCycleStartDay: Int?) async -> Bool {
        let request = UpdateCreditCardRequest(billingCycleStartDay: billingCycleStartDay)

        return await withCheckedContinuation { continuation in
            CreditCardsAPI.updateCreditCard(id: id, updateCreditCardDto: request) { result in
                Task { @MainActor in
                    switch result {
                    case .success:
                        // Refetch credit cards to get updated data
                        // (API returns different DTO type than list type)
                        continuation.resume(returning: true)

                    case .failure(let apiError):
                        self.handleOpenAPIError(apiError)
                        continuation.resume(returning: false)
                    }
                }
            }
        }
    }

    // MARK: - Error Handling

    private func handleOpenAPIError(_ error: ErrorResponse) {
        switch error {
        case .error(let statusCode, _, _, let underlyingError):
            self.error = "HTTP \(statusCode): \(underlyingError.localizedDescription)"
        }
        isLoading = false
    }
}
