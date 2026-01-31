//
//  BillingCycleSummaryView.swift
//  finance
//

import SwiftUI

struct BillingCycleSummaryView: View {
    let transactions: [Transaction]
    let categories: [Category]
    let transactionService: TransactionService

    var body: some View {
        if transactions.isEmpty {
            ContentUnavailableView(
                "No Transactions",
                systemImage: "creditcard.trianglebadge.exclamationmark",
                description: Text("No transactions in this billing period")
            )
        } else {
            List {
                // Total spending header
                Section {
                    HStack {
                        Text("Total Spending")
                            .font(.headline)
                        Spacer()
                        Text(formattedTotal)
                            .font(.title2)
                            .fontWeight(.bold)
                    }
                    .padding(.vertical, 8)
                }

                // Category breakdown
                Section("By Category") {
                    ForEach(groupedByCategory) { group in
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
                            HStack {
                                if let category = group.category {
                                    Image(systemName: category.displayIcon)
                                        .foregroundColor(category.displayColor)
                                        .frame(width: 24)
                                    Text(category.name)
                                } else {
                                    Image(systemName: "questionmark.circle")
                                        .foregroundColor(.secondary)
                                        .frame(width: 24)
                                    Text("Uncategorized")
                                        .foregroundColor(.secondary)
                                }

                                Spacer()

                                VStack(alignment: .trailing) {
                                    Text(formatAmount(group.total))
                                        .fontWeight(.medium)
                                    Text("\(group.percentage)%")
                                        .font(.caption)
                                        .foregroundColor(.secondary)
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    // MARK: - Computed Properties

    private var totalSpending: Double {
        transactions.reduce(0) { $0 + $1.chargedAmount }
    }

    private var formattedTotal: String {
        formatAmount(totalSpending)
    }

    private struct CategoryGroup: Identifiable {
        let category: Category?
        let transactions: [Transaction]
        let percentage: Int

        var id: String { category?.id ?? "uncategorized" }
        var total: Double { transactions.reduce(0) { $0 + $1.chargedAmount } }
    }

    private var groupedByCategory: [CategoryGroup] {
        let grouped = Dictionary(grouping: transactions) { $0.categoryId }
        let total = totalSpending

        var result: [CategoryGroup] = []

        for (categoryId, transactions) in grouped {
            let category = categoryId.flatMap { id in
                categories.first { $0.id == id }
            }
            let groupTotal = transactions.reduce(0) { $0 + $1.chargedAmount }
            let percentage = total > 0 ? Int((groupTotal / total) * 100) : 0

            result.append(CategoryGroup(
                category: category,
                transactions: transactions,
                percentage: percentage
            ))
        }

        // Sort by total (highest first), uncategorized at end
        result.sort { first, second in
            if first.category == nil { return false }
            if second.category == nil { return true }
            return first.total > second.total
        }

        return result
    }

    private func formatAmount(_ amount: Double) -> String {
        String(format: "₪%.2f", amount)
    }
}

#Preview {
    NavigationStack {
        BillingCycleSummaryView(
            transactions: [],
            categories: [],
            transactionService: TransactionService()
        )
    }
}
