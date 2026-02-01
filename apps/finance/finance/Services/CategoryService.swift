import Foundation
import Combine

@MainActor
class CategoryService: ObservableObject {
    @Published var categories: [Category] = []
    @Published var isLoading = false
    @Published var error: String?

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

        await withCheckedContinuation { continuation in
            CategoriesAPI.getCategories { result in
                Task { @MainActor in
                    switch result {
                    case .success(let response):
                        self.categories = response.categories
                        print("📦 CategoryService: Fetched \(self.categories.count) categories")
                        print("   - Default: \(self.defaultCategories.count)")
                        print("   - Custom: \(self.customCategories.count)")
                        for category in self.categories {
                            print("   - \(category.name) (isDefault: \(category.isDefault))")
                        }
                        self.isLoading = false

                    case .failure(let apiError):
                        print("❌ CategoryService: Error fetching categories - \(apiError)")
                        self.handleOpenAPIError(apiError)
                    }
                    continuation.resume()
                }
            }
        }
    }

    // MARK: - Create Category

    func createCategory(name: String, icon: String?, color: String?) async -> Bool {
        error = nil

        return await withCheckedContinuation { continuation in
            let request = CreateCategoryRequest(name: name, icon: icon, color: color)
            print("📤 CategoryService: Creating category '\(name)'")

            CategoriesAPI.create(createCategoryDto: request) { result in
                Task { @MainActor in
                    switch result {
                    case .success(let createdCategory):
                        print("✅ CategoryService: Created category - id: \(createdCategory.id), isDefault: \(createdCategory.isDefault)")

                        // Refresh the categories list
                        await self.fetchCategories()
                        continuation.resume(returning: true)

                    case .failure(let apiError):
                        print("❌ CategoryService: Error creating category - \(apiError)")
                        self.handleOpenAPIError(apiError)
                        continuation.resume(returning: false)
                    }
                }
            }
        }
    }

    // MARK: - Delete Category

    func deleteCategory(id: String) async -> Bool {
        error = nil

        return await withCheckedContinuation { continuation in
            CategoriesAPI.delete(id: id) { result in
                Task { @MainActor in
                    switch result {
                    case .success:
                        // Refresh the categories list
                        await self.fetchCategories()
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
