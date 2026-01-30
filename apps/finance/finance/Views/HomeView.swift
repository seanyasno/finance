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
