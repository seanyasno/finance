//
//  CreditCardSettingsView.swift
//  finance
//

import SwiftUI

struct CreditCardSettingsView: View {
    @ObservedObject var transactionService: TransactionService
    @Environment(\.dismiss) private var dismiss

    @State private var selectedDay: Int = 1
    @State private var isSaving = false
    @State private var showingWarning = false

    let card: CreditCard

    var body: some View {
        Form {
            Section {
                HStack {
                    Text("Card")
                    Spacer()
                    Text(card.displayName)
                        .foregroundColor(.secondary)
                }
            }

            Section {
                Picker("Billing Cycle Starts On", selection: $selectedDay) {
                    ForEach(1...31, id: \.self) { day in
                        Text(dayLabel(day)).tag(day)
                    }
                }
                .pickerStyle(.menu)
            } header: {
                Text("Billing Cycle")
            } footer: {
                Text("The day of the month when your billing cycle starts. Transactions will be grouped into periods starting on this day.")
            }

            Section {
                Button {
                    showingWarning = true
                } label: {
                    if isSaving {
                        HStack {
                            ProgressView()
                                .progressViewStyle(CircularProgressViewStyle())
                            Text("Saving...")
                        }
                    } else {
                        Text("Save Changes")
                    }
                }
                .disabled(isSaving || selectedDay == card.effectiveBillingCycleDay)
            }
        }
        .navigationTitle("Card Settings")
        .navigationBarTitleDisplayMode(.inline)
        .onAppear {
            selectedDay = card.effectiveBillingCycleDay
        }
        .alert("Update Billing Cycle?", isPresented: $showingWarning) {
            Button("Cancel", role: .cancel) { }
            Button("Update") {
                saveChanges()
            }
        } message: {
            Text("Changing the billing cycle start day will affect how your historical spending is grouped into periods. Past transactions may appear in different billing cycles.")
        }
    }

    private func dayLabel(_ day: Int) -> String {
        let suffix: String
        switch day {
        case 1, 21, 31: suffix = "st"
        case 2, 22: suffix = "nd"
        case 3, 23: suffix = "rd"
        default: suffix = "th"
        }
        return "\(day)\(suffix)"
    }

    private func saveChanges() {
        isSaving = true
        Task {
            let newDay = selectedDay == 1 ? nil : selectedDay  // null means default (1st)
            if await transactionService.updateCreditCard(id: card.id, billingCycleStartDay: newDay) != nil {
                dismiss()
            }
            isSaving = false
        }
    }
}

#Preview {
    NavigationStack {
        CreditCardSettingsView(
            transactionService: TransactionService(),
            card: CreditCard(
                id: "1",
                cardNumber: "1234567890123456",
                company: "max",
                billingCycleStartDay: nil,
                createdAt: nil
            )
        )
    }
}
