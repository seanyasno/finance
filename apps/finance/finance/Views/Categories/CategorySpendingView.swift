//
//  CategorySpendingView.swift
//  finance
//
//  Created by Sean Yasnogorodski on 31/01/2026.
//

import SwiftUI

struct CategorySpendingView: View {
    @StateObject private var transactionService = TransactionService()
    @StateObject private var categoryService = CategoryService()

    var body: some View {
        Group {
            if transactionService.isLoading {
                ProgressView("Loading...")
            } else if let error = transactionService.error {
                VStack(spacing: 16) {
                    Image(systemName: "exclamationmark.triangle")
                        .font(.system(size: 50))
                        .foregroundColor(.orange)
                    Text("Error")
                        .font(.headline)
                    Text(error)
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                        .multilineTextAlignment(.center)
                        .padding(.horizontal)
                    Button("Retry") {
                        Task {
                            await loadData()
                        }
                    }
                    .buttonStyle(.borderedProminent)
                }
            } else if transactionService.transactions.isEmpty {
                ContentUnavailableView(
                    "No Transactions",
                    systemImage: "chart.pie",
                    description: Text("Your spending breakdown will appear here")
                )
            } else {
                List {
                    ForEach(groupedByCategory) { group in
                        Section {
                            DisclosureGroup {
                                ForEach(group.transactions) { transaction in
                                    NavigationLink {
                                        TransactionDetailView(
                                            transaction: transaction,
                                            transactionService: transactionService
                                        )
                                    } label: {
                                        TransactionRowView(transaction: transaction)
                                    }
                                }
                            } label: {
                                CategorySpendingRow(
                                    category: group.category,
                                    total: group.total,
                                    count: group.transactions.count
                                )
                            }
                        }
                    }
                }
                .refreshable {
                    await loadData()
                }
            }
        }
        .navigationTitle("Spending by Category")
        .task {
            await loadData()
        }
    }

    // MARK: - Private Helpers

    private struct CategoryGroup: Identifiable {
        let category: Category?
        let transactions: [Transaction]

        var id: String {
            category?.id ?? "uncategorized"
        }

        var total: Double {
            transactions.reduce(0) { $0 + $1.chargedAmount }
        }
    }

    private var groupedByCategory: [CategoryGroup] {
        let grouped = Dictionary(grouping: transactionService.transactions) { $0.categoryId }

        var result: [CategoryGroup] = []

        // Add categorized groups
        for (categoryId, transactions) in grouped {
            if let categoryId = categoryId,
               let category = categoryService.categories.first(where: { $0.id == categoryId }) {
                result.append(CategoryGroup(category: category, transactions: transactions))
            }
        }

        // Sort by total spending (highest first)
        result.sort { $0.total > $1.total }

        // Add uncategorized at the end
        if let uncategorized = grouped[nil], !uncategorized.isEmpty {
            result.append(CategoryGroup(category: nil, transactions: uncategorized))
        }

        return result
    }

    private func loadData() async {
        await withTaskGroup(of: Void.self) { group in
            group.addTask { await transactionService.fetchTransactions() }
            group.addTask { await categoryService.fetchCategories() }
        }
    }
}

// MARK: - CategorySpendingRow

struct CategorySpendingRow: View {
    let category: Category?
    let total: Double
    let count: Int

    var body: some View {
        HStack {
            if let category = category {
                Image(systemName: category.displayIcon)
                    .foregroundColor(category.displayColor)
                    .frame(width: 30)
                Text(category.name)
            } else {
                Image(systemName: "questionmark.circle")
                    .foregroundColor(.secondary)
                    .frame(width: 30)
                Text("Uncategorized")
                    .foregroundColor(.secondary)
            }

            Spacer()

            VStack(alignment: .trailing) {
                Text(formattedTotal)
                    .font(.headline)
                Text("\(count) transactions")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
        }
    }

    private var formattedTotal: String {
        // Use same currency formatting as Transaction.formattedAmount
        String(format: "₪%.2f", total)
    }
}

#Preview {
    NavigationStack {
        CategorySpendingView()
    }
}
