//
//  LoginView.swift
//  finance
//
//  Created by Sean Yasnogorodski on 30/01/2026.
//

import SwiftUI

struct LoginView: View {
    @EnvironmentObject var authManager: AuthManager
    @State private var email: String = ""
    @State private var password: String = ""
    @Binding var showRegister: Bool

    var body: some View {
        NavigationStack {
            VStack(spacing: 20) {
                // App title
                Text("Finance")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                    .padding(.top, 40)

                Spacer()

                // Login form
                VStack(spacing: 16) {
                    TextField("Email", text: $email)
                        .keyboardType(.emailAddress)
                        .textInputAutocapitalization(.never)
                        .autocorrectionDisabled()
                        .textFieldStyle(.roundedBorder)
                        .padding(.horizontal)

                    SecureField("Password", text: $password)
                        .textFieldStyle(.roundedBorder)
                        .padding(.horizontal)
                }

                // Error message
                if let error = authManager.error {
                    Text(error)
                        .foregroundColor(.red)
                        .font(.caption)
                        .multilineTextAlignment(.center)
                        .padding(.horizontal)
                }

                // Login button
                Button {
                    Task {
                        do {
                            try await authManager.login(email: email, password: password)
                        } catch {
                            // Error is handled by AuthManager
                        }
                    }
                } label: {
                    if authManager.isLoading {
                        ProgressView()
                            .progressViewStyle(CircularProgressViewStyle(tint: .white))
                            .frame(maxWidth: .infinity)
                    } else {
                        Text("Login")
                            .frame(maxWidth: .infinity)
                    }
                }
                .buttonStyle(.borderedProminent)
                .disabled(email.isEmpty || password.isEmpty || authManager.isLoading)
                .padding(.horizontal)
                .padding(.top, 8)

                // Register link
                Button {
                    showRegister = true
                } label: {
                    Text("Don't have an account? Register")
                        .font(.footnote)
                }
                .padding(.top, 8)

                Spacer()
            }
        }
    }
}

#Preview {
    LoginView(showRegister: .constant(false))
        .environmentObject(AuthManager())
}
