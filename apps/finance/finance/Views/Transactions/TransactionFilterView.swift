//
//  TransactionFilterView.swift
//  finance
//
//  Created by Sean Yasnogorodski on 30/01/2026.
//

import SwiftUI

struct TransactionFilterView: View {
    @Binding var startDate: Date?
    @Binding var endDate: Date?
    @Binding var selectedCardId: String?
    let creditCards: [CreditCard]
    let onApply: () -> Void
    let onClear: () -> Void
    @Environment(\.dismiss) private var dismiss

    @State private var enableStartDate: Bool = false
    @State private var enableEndDate: Bool = false
    @State private var localStartDate: Date = Date()
    @State private var localEndDate: Date = Date()

    var body: some View {
        NavigationStack {
            Form {
                Section("Date Range") {
                    Toggle("Start Date", isOn: $enableStartDate)
                    if enableStartDate {
                        DatePicker(
                            "From",
                            selection: $localStartDate,
                            displayedComponents: .date
                        )
                    }

                    Toggle("End Date", isOn: $enableEndDate)
                    if enableEndDate {
                        DatePicker(
                            "To",
                            selection: $localEndDate,
                            displayedComponents: .date
                        )
                    }
                }

                Section("Credit Card") {
                    Picker("Card", selection: $selectedCardId) {
                        Text("All Cards").tag(nil as String?)
                        ForEach(creditCards) { card in
                            Text(card.displayName)
                                .tag(card.id as String?)
                        }
                    }
                }
            }
            .navigationTitle("Filters")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Clear") {
                        enableStartDate = false
                        enableEndDate = false
                        startDate = nil
                        endDate = nil
                        selectedCardId = nil
                        onClear()
                        dismiss()
                    }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Apply") {
                        startDate = enableStartDate ? localStartDate : nil
                        endDate = enableEndDate ? localEndDate : nil
                        onApply()
                        dismiss()
                    }
                }
            }
            .onAppear {
                // Initialize local state from bindings
                if let start = startDate {
                    enableStartDate = true
                    localStartDate = start
                }
                if let end = endDate {
                    enableEndDate = true
                    localEndDate = end
                }
            }
        }
    }
}

#Preview {
    struct PreviewWrapper: View {
        @State private var startDate: Date? = nil
        @State private var endDate: Date? = nil
        @State private var selectedCardId: String? = nil

        var body: some View {
            TransactionFilterView(
                startDate: $startDate,
                endDate: $endDate,
                selectedCardId: $selectedCardId,
                creditCards: [
                    CreditCard(
                        id: "1",
                        cardNumber: "1234567890123456",
                        company: .max,
                        billingCycleStartDay: nil,
                        createdAt: nil
                    ),
                    CreditCard(
                        id: "2",
                        cardNumber: "9876543210987654",
                        company: .isracard,
                        billingCycleStartDay: nil,
                        createdAt: nil
                    )
                ],
                onApply: { print("Apply filters") },
                onClear: { print("Clear filters") }
            )
        }
    }

    return PreviewWrapper()
}
