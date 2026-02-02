//
//  TransactionListView.swift
//  finance
//
//  Created by Sean Yasnogorodski on 30/01/2026.
//

import SwiftUI

struct TransactionListView: View {
    @StateObject private var transactionService = TransactionService()
    @State private var showFilters = false
    @State private var startDate: Date? = nil
    @State private var endDate: Date? = nil
    @State private var selectedCardId: String? = nil
    @State private var searchText: String = ""
    @State private var debouncedSearchText: String = ""
    @State private var searchTask: Task<Void, Never>?

    var body: some View {
        Group {
            if transactionService.isLoading {
                ProgressView("Loading transactions...")
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
                if !debouncedSearchText.isEmpty {
                    ContentUnavailableView(
                        "No Results",
                        systemImage: "magnifyingglass",
                        description: Text("No transactions match \"\(debouncedSearchText)\"")
                    )
                } else {
                    ContentUnavailableView(
                        "No Transactions",
                        systemImage: "creditcard",
                        description: Text("Your transactions will appear here")
                    )
                }
            } else {
                List {
                    ForEach(groupedTransactions, id: \.key) { group in
                        Section {
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
                        } header: {
                            if let firstTransaction = group.transactions.first {
                                Text(firstTransaction.sectionHeaderTitle)
                            }
                        }
                    }
                }
                .refreshable {
                    await loadData()
                }
            }
        }
        .navigationTitle("Transactions")
        .searchable(text: $searchText, prompt: "Search transactions")
        .onChange(of: searchText) { _, newValue in
            searchTask?.cancel()
            searchTask = Task {
                try? await Task.sleep(nanoseconds: 300_000_000)
                guard !Task.isCancelled else { return }
                debouncedSearchText = newValue
                await performSearch()
            }
        }
        .toolbar {
            ToolbarItem(placement: .navigationBarTrailing) {
                Button {
                    showFilters = true
                } label: {
                    Image(systemName: "line.3.horizontal.decrease.circle")
                    if activeFilterCount > 0 {
                        Text("\(activeFilterCount)")
                            .font(.caption)
                            .foregroundColor(.white)
                            .padding(.horizontal, 6)
                            .padding(.vertical, 2)
                            .background(Color.blue)
                            .clipShape(Capsule())
                    }
                }
            }
        }
        .sheet(isPresented: $showFilters) {
            TransactionFilterView(
                startDate: $startDate,
                endDate: $endDate,
                selectedCardId: $selectedCardId,
                creditCards: transactionService.creditCards,
                onApply: {
                    Task {
                        await applyFilters()
                    }
                },
                onClear: {
                    startDate = nil
                    endDate = nil
                    selectedCardId = nil
                    Task {
                        await applyFilters()
                    }
                }
            )
        }
        .task {
            await loadData()
        }
    }

    // MARK: - Private Helpers

    private var groupedTransactions: [(key: String, transactions: [Transaction])] {
        let grouped = Dictionary(grouping: transactionService.transactions) { $0.dateGroupingKey }
        return grouped.map { (key: $0.key, transactions: $0.value) }
            .sorted { $0.key > $1.key } // Descending order (newest first)
    }

    private var activeFilterCount: Int {
        var count = 0
        if startDate != nil { count += 1 }
        if endDate != nil { count += 1 }
        if selectedCardId != nil { count += 1 }
        return count
    }

    private func loadData() async {
        await withTaskGroup(of: Void.self) { group in
            group.addTask {
                let searchTerm = self.debouncedSearchText.isEmpty ? nil : self.debouncedSearchText
                await self.transactionService.fetchTransactions(search: searchTerm)
            }
            group.addTask {
                await self.transactionService.fetchCreditCards()
            }
        }
    }

    private func applyFilters() async {
        let searchTerm = debouncedSearchText.isEmpty ? nil : debouncedSearchText
        await transactionService.fetchTransactions(
            startDate: startDate,
            endDate: endDate,
            creditCardId: selectedCardId,
            search: searchTerm
        )
    }

    private func performSearch() async {
        let searchTerm = debouncedSearchText.isEmpty ? nil : debouncedSearchText
        await transactionService.fetchTransactions(
            startDate: startDate,
            endDate: endDate,
            creditCardId: selectedCardId,
            search: searchTerm
        )
    }
}

#Preview {
    NavigationStack {
        TransactionListView()
    }
}
