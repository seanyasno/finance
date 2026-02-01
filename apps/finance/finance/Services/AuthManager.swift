import Foundation
import Combine

@MainActor
class AuthManager: ObservableObject {
    @Published var currentUser: User?
    @Published var isLoading: Bool = false
    @Published var error: String?

    private let keychainService = KeychainService()
    private let tokenKey = "auth_token"

    var isAuthenticated: Bool {
        currentUser != nil
    }

    init() {
        // Configure OpenAPI client base path
        OpenAPIClientAPI.basePath = Config.apiBaseURL

        Task {
            await loadStoredToken()
        }
    }

    func loadStoredToken() async {
        // Try to load token from keychain
        guard let token = keychainService.load(forKey: tokenKey) else {
            print("🔐 AuthManager: No stored token in keychain")
            return
        }

        print("🔐 AuthManager: Loaded token from keychain (first 20 chars): \(String(token.prefix(20)))...")

        // Set token in OpenAPI client custom headers
        OpenAPIClientAPI.customHeaders["Authorization"] = "Bearer \(token)"
        print("🔐 AuthManager: Auth token set on OpenAPIClientAPI")

        // Try to fetch current user to verify token is still valid
        do {
            try await checkAuthStatus()
            print("✅ AuthManager: Token is valid, user authenticated")
        } catch {
            print("❌ AuthManager: Token invalid, clearing auth state")
            // Token is invalid, clear it
            try? keychainService.delete(forKey: tokenKey)
            OpenAPIClientAPI.customHeaders.removeValue(forKey: "Authorization")
        }
    }

    func login(email: String, password: String) async throws {
        isLoading = true
        error = nil

        defer {
            isLoading = false
        }

        return try await withCheckedThrowingContinuation { continuation in
            let loginDto = LoginRequest(email: email, password: password)

            AuthenticationAPI.login(loginDto: loginDto) { result in
                Task { @MainActor in
                    switch result {
                    case .success(let response):
                        // Get auth token from response body (preferred for mobile apps)
                        if let authToken = response.token {
                            print("🔐 AuthManager: Login success - got token from response (first 20 chars): \(String(authToken.prefix(20)))...")

                            // Save token to keychain
                            do {
                                try self.keychainService.save(token: authToken, forKey: self.tokenKey)

                                // Set on OpenAPI client
                                OpenAPIClientAPI.customHeaders["Authorization"] = "Bearer \(authToken)"
                                print("🔐 AuthManager: Auth token set on OpenAPIClientAPI")
                            } catch {
                                self.error = "Failed to save token: \(error.localizedDescription)"
                                continuation.resume(throwing: error)
                                return
                            }
                        } else {
                            print("⚠️ AuthManager: Login succeeded but no auth token in response!")
                        }

                        // Set current user
                        self.currentUser = response.user
                        if let user = response.user {
                            print("✅ AuthManager: Login complete, user: \(user.email)")
                        }

                        continuation.resume()

                    case .failure(let apiError):
                        let errorMessage = self.formatOpenAPIError(apiError)
                        self.error = errorMessage
                        continuation.resume(throwing: apiError)
                    }
                }
            }
        }
    }

    func register(
        email: String,
        password: String,
        firstName: String?,
        lastName: String?
    ) async throws {
        isLoading = true
        error = nil

        defer {
            isLoading = false
        }

        return try await withCheckedThrowingContinuation { continuation in
            let registerDto = RegisterRequest(
                email: email,
                password: password,
                firstName: firstName,
                lastName: lastName
            )

            AuthenticationAPI.register(registerDto: registerDto) { result in
                Task { @MainActor in
                    switch result {
                    case .success(let response):
                        // Get auth token from response body (preferred for mobile apps)
                        if let authToken = response.token {
                            do {
                                // Save token to keychain
                                try self.keychainService.save(token: authToken, forKey: self.tokenKey)

                                // Set on OpenAPI client
                                OpenAPIClientAPI.customHeaders["Authorization"] = "Bearer \(authToken)"
                            } catch {
                                self.error = "Failed to save token: \(error.localizedDescription)"
                                continuation.resume(throwing: error)
                                return
                            }
                        }

                        // Set current user
                        self.currentUser = response.user

                        continuation.resume()

                    case .failure(let apiError):
                        let errorMessage = self.formatOpenAPIError(apiError)
                        self.error = errorMessage
                        continuation.resume(throwing: apiError)
                    }
                }
            }
        }
    }

    func logout() async {
        // Try to call logout endpoint (best effort)
        await withCheckedContinuation { continuation in
            AuthenticationAPI.logout { _ in
                // Ignore result - best effort
                continuation.resume()
            }
        }

        // Clear token from keychain
        try? keychainService.delete(forKey: tokenKey)

        // Clear token from OpenAPI client
        OpenAPIClientAPI.customHeaders.removeValue(forKey: "Authorization")

        // Clear current user
        currentUser = nil
    }

    func checkAuthStatus() async throws {
        return try await withCheckedThrowingContinuation { continuation in
            AuthenticationAPI.getCurrentUser { result in
                Task { @MainActor in
                    switch result {
                    case .success(let response):
                        self.currentUser = response.user
                        continuation.resume()

                    case .failure(let apiError):
                        // If check fails, clear auth state
                        await self.logout()
                        continuation.resume(throwing: apiError)
                    }
                }
            }
        }
    }

    // MARK: - Private helpers

    private func formatOpenAPIError(_ error: ErrorResponse) -> String {
        switch error {
        case .error(let statusCode, _, _, let underlyingError):
            return "HTTP \(statusCode): \(underlyingError.localizedDescription)"
        }
    }
}
