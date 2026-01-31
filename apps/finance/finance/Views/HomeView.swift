//
//  HomeView.swift
//  finance
//
//  Created by Sean Yasnogorodski on 30/01/2026.
//

import SwiftUI

struct HomeView: View {
    @EnvironmentObject var authManager: AuthManager

    var body: some View {
        TabView {
            NavigationStack {
                TransactionListView()
                    .toolbar {
                        ToolbarItem(placement: .navigationBarTrailing) {
                            Button("Logout") {
                                Task {
                                    await authManager.logout()
                                }
                            }
                        }
                    }
            }
            .tabItem {
                Label("Transactions", systemImage: "list.bullet")
            }

            NavigationStack {
                BillingCycleView()
                    .toolbar {
                        ToolbarItem(placement: .navigationBarTrailing) {
                            Button("Logout") {
                                Task {
                                    await authManager.logout()
                                }
                            }
                        }
                    }
            }
            .tabItem {
                Label("Cycles", systemImage: "calendar")
            }

            NavigationStack {
                StatisticsView()
                    .toolbar {
                        ToolbarItem(placement: .navigationBarTrailing) {
                            Button("Logout") {
                                Task {
                                    await authManager.logout()
                                }
                            }
                        }
                    }
            }
            .tabItem {
                Label("Statistics", systemImage: "chart.bar")
            }

            NavigationStack {
                CategoryListView()
                    .toolbar {
                        ToolbarItem(placement: .navigationBarTrailing) {
                            Button("Logout") {
                                Task {
                                    await authManager.logout()
                                }
                            }
                        }
                    }
            }
            .tabItem {
                Label("Categories", systemImage: "tag")
            }

            NavigationStack {
                CreditCardListView()
                    .toolbar {
                        ToolbarItem(placement: .navigationBarTrailing) {
                            Button("Logout") {
                                Task {
                                    await authManager.logout()
                                }
                            }
                        }
                    }
            }
            .tabItem {
                Label("Cards", systemImage: "creditcard")
            }
        }
    }
}

struct CreditCardListView: View {
    @StateObject private var transactionService = TransactionService()

    var body: some View {
        Group {
            if transactionService.isLoading {
                ProgressView("Loading cards...")
            } else if transactionService.creditCards.isEmpty {
                ContentUnavailableView(
                    "No Credit Cards",
                    systemImage: "creditcard",
                    description: Text("Your credit cards will appear here")
                )
            } else {
                List(transactionService.creditCards) { card in
                    NavigationLink {
                        CreditCardSettingsView(
                            transactionService: transactionService,
                            card: card
                        )
                    } label: {
                        CreditCardRowView(card: card)
                    }
                }
                .refreshable {
                    await transactionService.fetchCreditCards()
                }
            }
        }
        .navigationTitle("Credit Cards")
        .task {
            await transactionService.fetchCreditCards()
        }
    }
}

struct CreditCardRowView: View {
    let card: CreditCard

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(card.displayName)
                .font(.headline)
            HStack {
                Text("Billing cycle: \(dayLabel(card.effectiveBillingCycleDay)) of month")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
        }
        .padding(.vertical, 4)
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
}

#Preview {
    HomeView()
        .environmentObject({
            let manager = AuthManager()
            // Note: In preview, currentUser would be nil
            return manager
        }())
}
