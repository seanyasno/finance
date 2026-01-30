//
//  RootView.swift
//  finance
//
//  Created by Sean Yasnogorodski on 30/01/2026.
//

import SwiftUI

struct RootView: View {
    @StateObject private var authManager = AuthManager()
    @State private var showRegister = false

    var body: some View {
        Group {
            if authManager.isAuthenticated {
                HomeView()
            } else {
                if showRegister {
                    RegisterView(showRegister: $showRegister)
                } else {
                    LoginView(showRegister: $showRegister)
                }
            }
        }
        .environmentObject(authManager)
    }
}

#Preview {
    RootView()
}
