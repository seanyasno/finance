import Foundation
import Combine

@MainActor
class CategoryService: ObservableObject {
    private let apiService: APIService

    @Published var categories: [Category] = []
    @Published var isLoading = false
    @Published var error: String?

    init(apiService: APIService = .shared) {
        self.apiService = apiService
    }

    // MARK: - Computed Properties

    var defaultCategories: [Category] {
        return categories.filter { $0.isDefault }
    }

    var customCategories: [Category] {
        return categories.filter { !$0.isDefault }
    }

    // MARK: - Fetch Categories

    func fetchCategories() async {
        isLoading = true
        error = nil

        do {
            let response: CategoriesResponse = try await apiService.get("/categories", authenticated: true)
            categories = response.categories
            isLoading = false

        } catch let apiError as APIError {
            handleAPIError(apiError)
        } catch {
            self.error = "An unexpected error occurred: \(error.localizedDescription)"
            isLoading = false
        }
    }

    // MARK: - Create Category

    func createCategory(name: String, icon: String?, color: String?) async -> Bool {
        error = nil

        do {
            let request = CreateCategoryRequest(name: name, icon: icon, color: color)
            let _: Category = try await apiService.post("/categories", body: request, authenticated: true)

            // Refresh the categories list
            await fetchCategories()
            return true

        } catch let apiError as APIError {
            handleAPIError(apiError)
            return false
        } catch {
            self.error = "An unexpected error occurred: \(error.localizedDescription)"
            return false
        }
    }

    // MARK: - Delete Category

    func deleteCategory(id: String) async -> Bool {
        error = nil

        do {
            struct EmptyResponse: Codable {}
            let _: EmptyResponse = try await apiService.request(
                "/categories/\(id)",
                method: "DELETE",
                authenticated: true
            )

            // Refresh the categories list
            await fetchCategories()
            return true

        } catch let apiError as APIError {
            handleAPIError(apiError)
            return false
        } catch {
            self.error = "An unexpected error occurred: \(error.localizedDescription)"
            return false
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
