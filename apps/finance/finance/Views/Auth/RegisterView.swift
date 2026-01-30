//
//  RegisterView.swift
//  finance
//
//  Created by Sean Yasnogorodski on 30/01/2026.
//

import SwiftUI

struct RegisterView: View {
    @EnvironmentObject var authManager: AuthManager
    @State private var email: String = ""
    @State private var password: String = ""
    @State private var confirmPassword: String = ""
    @State private var firstName: String = ""
    @State private var lastName: String = ""
    @Binding var showRegister: Bool

    private var passwordsMatch: Bool {
        password == confirmPassword
    }

    private var passwordValid: Bool {
        password.count >= 6
    }

    private var validationError: String? {
        if !password.isEmpty && !passwordValid {
            return "Password must be at least 6 characters"
        }
        if !confirmPassword.isEmpty && !passwordsMatch {
            return "Passwords do not match"
        }
        return nil
    }

    var body: some View {
        NavigationStack {
            VStack(spacing: 20) {
                // Title
                Text("Create Account")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                    .padding(.top, 40)

                Spacer()

                // Registration form
                Form {
                    Section("Account") {
                        TextField("Email", text: $email)
                            .keyboardType(.emailAddress)
                            .textInputAutocapitalization(.never)
                            .autocorrectionDisabled()

                        SecureField("Password", text: $password)

                        SecureField("Confirm Password", text: $confirmPassword)
                    }

                    Section("Profile (Optional)") {
                        TextField("First Name", text: $firstName)
                            .textInputAutocapitalization(.words)

                        TextField("Last Name", text: $lastName)
                            .textInputAutocapitalization(.words)
                    }
                }
                .scrollContentBackground(.hidden)

                // Validation error
                if let validationError = validationError {
                    Text(validationError)
                        .foregroundColor(.orange)
                        .font(.caption)
                        .multilineTextAlignment(.center)
                        .padding(.horizontal)
                }

                // API error message
                if let error = authManager.error {
                    Text(error)
                        .foregroundColor(.red)
                        .font(.caption)
                        .multilineTextAlignment(.center)
                        .padding(.horizontal)
                }

                // Create Account button
                Button {
                    Task {
                        do {
                            let firstNameValue = firstName.isEmpty ? nil : firstName
                            let lastNameValue = lastName.isEmpty ? nil : lastName
                            try await authManager.register(
                                email: email,
                                password: password,
                                firstName: firstNameValue,
                                lastName: lastNameValue
                            )
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
                        Text("Create Account")
                            .frame(maxWidth: .infinity)
                    }
                }
                .buttonStyle(.borderedProminent)
                .disabled(
                    email.isEmpty ||
                    password.isEmpty ||
                    !passwordValid ||
                    !passwordsMatch ||
                    authManager.isLoading
                )
                .padding(.horizontal)

                // Login link
                Button {
                    showRegister = false
                } label: {
                    Text("Already have an account? Login")
                        .font(.footnote)
                }
                .padding(.top, 8)

                Spacer()
            }
        }
    }
}

#Preview {
    RegisterView(showRegister: .constant(true))
        .environmentObject(AuthManager())
}
