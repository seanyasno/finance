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
            VStack(spacing: 20) {
                // Welcome message
                Text("Welcome!")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                    .padding(.top, 40)

                // User information
                if let user = authManager.currentUser {
                    VStack(spacing: 8) {
                        Text(user.email)
                            .font(.subheadline)
                            .foregroundColor(.secondary)

                        if let firstName = user.firstName, let lastName = user.lastName {
                            Text("\(firstName) \(lastName)")
                                .font(.headline)
                        } else if let firstName = user.firstName {
                            Text(firstName)
                                .font(.headline)
                        } else if let lastName = user.lastName {
                            Text(lastName)
                                .font(.headline)
                        }
                    }
                    .padding()
                }

                Spacer()

                // Placeholder for future features
                Text("Your transactions will appear here")
                    .foregroundColor(.secondary)
                    .italic()

                Spacer()
            }
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
