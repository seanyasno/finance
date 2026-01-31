import SwiftUI

struct CategoryListView: View {
    @StateObject private var categoryService = CategoryService()
    @State private var showCreateSheet = false

    var body: some View {
        NavigationStack {
            Group {
                if categoryService.isLoading && categoryService.categories.isEmpty {
                    ProgressView("Loading categories...")
                } else if let error = categoryService.error, categoryService.categories.isEmpty {
                    ContentUnavailableView {
                        Label("Error Loading Categories", systemImage: "exclamationmark.triangle")
                    } description: {
                        Text(error)
                    } actions: {
                        Button("Retry") {
                            Task {
                                await categoryService.fetchCategories()
                            }
                        }
                    }
                } else if categoryService.categories.isEmpty {
                    ContentUnavailableView {
                        Label("No Categories", systemImage: "tag")
                    } description: {
                        Text("Create your first category to organize transactions")
                    } actions: {
                        Button("Create Category") {
                            showCreateSheet = true
                        }
                        .buttonStyle(.borderedProminent)
                    }
                } else {
                    List {
                        // Default Categories Section
                        if !categoryService.defaultCategories.isEmpty {
                            Section("Default Categories") {
                                ForEach(categoryService.defaultCategories) { category in
                                    CategoryRowView(category: category)
                                }
                            }
                        }

                        // Custom Categories Section
                        if !categoryService.customCategories.isEmpty {
                            Section("My Categories") {
                                ForEach(categoryService.customCategories) { category in
                                    CategoryRowView(category: category)
                                }
                                .onDelete { indexSet in
                                    deleteCategories(at: indexSet)
                                }
                            }
                        }
                    }
                    .refreshable {
                        await categoryService.fetchCategories()
                    }
                }
            }
            .navigationTitle("Categories")
            .toolbar {
                ToolbarItem(placement: .primaryAction) {
                    Button {
                        showCreateSheet = true
                    } label: {
                        Image(systemName: "plus")
                    }
                }
            }
            .sheet(isPresented: $showCreateSheet) {
                CreateCategoryView(categoryService: categoryService)
            }
            .task {
                await categoryService.fetchCategories()
            }
        }
    }

    private func deleteCategories(at offsets: IndexSet) {
        let categoriesToDelete = offsets.map { categoryService.customCategories[$0] }

        Task {
            for category in categoriesToDelete {
                let _ = await categoryService.deleteCategory(id: category.id)
            }
        }
    }
}

#Preview {
    CategoryListView()
}
