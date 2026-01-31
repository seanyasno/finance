//
//  BillingCycleView.swift
//  finance
//

import SwiftUI

struct BillingCycleView: View {
    @StateObject private var transactionService = TransactionService()
    @StateObject private var categoryService = CategoryService()

    @State private var viewMode: BillingCycleViewMode = .combined
    @State private var selectedCard: CreditCard?
    @State private var periodOffset: Int = 0  // 0 = current, -1 = previous, etc.

    var body: some View {
        VStack(spacing: 0) {
            // View mode picker
            Picker("View Mode", selection: $viewMode) {
                ForEach(BillingCycleViewMode.allCases) { mode in
                    Text(mode.rawValue).tag(mode)
                }
            }
            .pickerStyle(.segmented)
            .padding()

            // Card selector (only for single card mode)
            if viewMode == .singleCard {
                if transactionService.creditCards.isEmpty {
                    Text("No cards available")
                        .foregroundColor(.secondary)
                        .padding()
                } else {
                    Picker("Select Card", selection: $selectedCard) {
                        ForEach(transactionService.creditCards) { card in
                            Text(card.displayName).tag(card as CreditCard?)
                        }
                    }
                    .pickerStyle(.menu)
                    .padding(.horizontal)
                }
            }

            // Period navigation
            HStack {
                Button {
                    periodOffset -= 1
                    Task { await loadTransactions() }
                } label: {
                    Image(systemName: "chevron.left")
                        .font(.title2)
                }

                Spacer()

                VStack {
                    Text(currentPeriodDisplay)
                        .font(.headline)
                    if let daysRemaining = currentCycle?.daysRemaining, currentCycle?.isCurrent == true {
                        Text("\(daysRemaining) days remaining")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                }

                Spacer()

                Button {
                    periodOffset += 1
                    Task { await loadTransactions() }
                } label: {
                    Image(systemName: "chevron.right")
                        .font(.title2)
                }
                .disabled(periodOffset >= 0)  // Can't go into future
            }
            .padding()
            .background(Color(.systemGray6))

            // Spending content
            if transactionService.isLoading {
                Spacer()
                ProgressView("Loading...")
                Spacer()
            } else {
                BillingCycleSummaryView(
                    transactions: filteredTransactions,
                    categories: categoryService.categories,
                    transactionService: transactionService
                )
            }
        }
        .navigationTitle("Billing Cycles")
        .onChange(of: viewMode) { _, _ in
            periodOffset = 0  // Reset to current when changing view mode
            Task { await loadTransactions() }
        }
        .onChange(of: selectedCard) { _, _ in
            Task { await loadTransactions() }
        }
        .task {
            await loadInitialData()
        }
    }

    // MARK: - Computed Properties

    private var currentCycle: BillingCycle? {
        switch viewMode {
        case .combined:
            // For combined, use the first card's cycle or calendar month
            if let firstCard = transactionService.creditCards.first {
                return BillingCycle.forCard(firstCard, offset: periodOffset)
            }
            return BillingCycle.calendarMonth(offset: periodOffset)
        case .singleCard:
            guard let card = selectedCard else { return nil }
            return BillingCycle.forCard(card, offset: periodOffset)
        case .calendarMonth:
            return BillingCycle.calendarMonth(offset: periodOffset)
        }
    }

    private var currentPeriodDisplay: String {
        currentCycle?.displayPeriod ?? "Select a period"
    }

    private var filteredTransactions: [Transaction] {
        guard let cycle = currentCycle else { return [] }

        return transactionService.transactions.filter { transaction in
            let date = transaction.date

            // Date must be within cycle
            let inDateRange = date >= cycle.startDate && date <= cycle.endDate

            // For single card mode, also filter by card
            if viewMode == .singleCard, let selectedCard = selectedCard {
                return inDateRange && transaction.creditCardId == selectedCard.id
            }

            return inDateRange
        }
    }

    // MARK: - Data Loading

    private func loadInitialData() async {
        await withTaskGroup(of: Void.self) { group in
            group.addTask { await transactionService.fetchCreditCards() }
            group.addTask { await categoryService.fetchCategories() }
        }

        // Set default selected card
        if selectedCard == nil {
            selectedCard = transactionService.creditCards.first
        }

        await loadTransactions()
    }

    private func loadTransactions() async {
        // Load all transactions within reasonable date range
        // The UI will filter based on billing cycle
        guard let cycle = currentCycle else { return }

        await transactionService.fetchTransactions(
            startDate: cycle.startDate,
            endDate: cycle.endDate,
            creditCardId: viewMode == .singleCard ? selectedCard?.id : nil
        )
    }
}

#Preview {
    NavigationStack {
        BillingCycleView()
    }
}
