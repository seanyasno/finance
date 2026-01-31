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
                CategorySpendingView()
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
                Label("Spending", systemImage: "chart.pie")
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
        }
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
