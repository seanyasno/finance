//
//  TransactionDetailView.swift
//  finance
//
//  Created by Sean Yasnogorodski on 30/01/2026.
//

import SwiftUI

struct TransactionDetailView: View {
    let transaction: Transaction
    @ObservedObject var transactionService: TransactionService
    @StateObject private var categoryService = CategoryService()

    @State private var selectedCategoryId: String?
    @State private var notes: String
    @State private var isSaving = false
    @State private var hasChanges = false

    @Environment(\.dismiss) private var dismiss

    init(transaction: Transaction, transactionService: TransactionService) {
        self.transaction = transaction
        self.transactionService = transactionService
        _selectedCategoryId = State(initialValue: transaction.categoryId)
        _notes = State(initialValue: transaction.notes ?? "")
    }

    var body: some View {
        Form {
            // Transaction Info Section (read-only)
            Section("Transaction") {
                LabeledContent("Merchant", value: transaction.merchantName)
                LabeledContent("Amount", value: transaction.formattedAmount)
                LabeledContent("Date", value: transaction.formattedDate)
                if let card = transaction.creditCard {
                    HStack {
                        Text("Card")
                        Spacer()
                        CardLabel(card: card)
                    }
                }
                HStack {
                    Text("Status")
                    Spacer()
                    if transaction.isPending {
                        HStack(spacing: 4) {
                            Image(systemName: "clock.fill")
                                .foregroundColor(.orange)
                            Text("Pending")
                                .foregroundColor(.secondary)
                        }
                    } else {
                        Text("Completed")
                            .foregroundColor(.secondary)
                    }
                }
            }

            // Category Section
            Section("Category") {
                Picker("Category", selection: $selectedCategoryId) {
                    Text("None").tag(nil as String?)
                    ForEach(categoryService.categories) { category in
                        Label {
                            Text(category.name)
                        } icon: {
                            Image(systemName: category.displayIcon)
                                .foregroundColor(category.displayColor)
                        }
                        .tag(category.id as String?)
                    }
                }
                .onChange(of: selectedCategoryId) { _, _ in hasChanges = true }
            }

            // Notes Section
            Section("Notes") {
                TextEditor(text: $notes)
                    .frame(minHeight: 100)
                    .onChange(of: notes) { _, _ in hasChanges = true }
            }
        }
        .navigationTitle("Transaction Details")
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .navigationBarTrailing) {
                Button("Save") {
                    Task { await save() }
                }
                .disabled(!hasChanges || isSaving)
            }
        }
        .task {
            await categoryService.fetchCategories()
        }
    }

    private func save() async {
        isSaving = true
        let notesToSave = notes.isEmpty ? nil : notes
        if await transactionService.updateTransaction(
            id: transaction.id,
            categoryId: selectedCategoryId,
            notes: notesToSave
        ) {
            hasChanges = false
        }
        isSaving = false
    }
}

#Preview {
    NavigationStack {
        TransactionDetailView(
            transaction: Transaction(
                id: "1",
                description: "Amazon Purchase",
                timestamp: AnyCodable("2026-02-02T10:00:00Z"),
                notes: "Pending order",
                originalAmount: 29.99,
                originalCurrency: "USD",
                chargedAmount: 29.99,
                chargedCurrency: "USD",
                status: .pending,
                creditCardId: "card1",
                creditCard: TransactionCreditCard(
                    id: "card1",
                    cardNumber: "1234567890123456",
                    company: .max
                ),
                categoryId: nil,
                category: nil
            ),
            transactionService: TransactionService()
        )
    }
}
