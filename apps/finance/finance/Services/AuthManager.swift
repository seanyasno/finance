import Foundation
import Combine

@MainActor
class AuthManager: ObservableObject {
    @Published var currentUser: User?
    @Published var isLoading: Bool = false
    @Published var error: String?

    private let apiService: APIService
    private let keychainService = KeychainService()
    private let tokenKey = "auth_token"

    var isAuthenticated: Bool {
        currentUser != nil
    }

    init() {
        self.apiService = .shared
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
        // Set token on API service
        apiService.authToken = token
        print("🔐 AuthManager: Auth token set on APIService.shared from keychain")

        // Try to fetch current user to verify token is still valid
        do {
            try await checkAuthStatus()
            print("✅ AuthManager: Token is valid, user authenticated")
        } catch {
            print("❌ AuthManager: Token invalid, clearing auth state")
            // Token is invalid, clear it
            try? keychainService.delete(forKey: tokenKey)
            apiService.authToken = nil
        }
    }

    func login(email: String, password: String) async throws {
        isLoading = true
        error = nil

        defer {
            isLoading = false
        }

        do {
            let request = LoginRequest(email: email, password: password)
            let response: AuthResponse = try await apiService.post(
                "/auth/login",
                body: request,
                authenticated: false
            )

            // Get auth token from response body (preferred for mobile apps)
            if let authToken = response.token {
                print("🔐 AuthManager: Login success - got token from response (first 20 chars): \(String(authToken.prefix(20)))...")
                // Save token to keychain
                try keychainService.save(token: authToken, forKey: tokenKey)

                // Set on API service
                apiService.authToken = authToken
                print("🔐 AuthManager: Auth token set on APIService.shared")
            } else {
                print("⚠️ AuthManager: Login succeeded but no auth token in response!")
            }

            // Set current user
            currentUser = response.user
            if let user = response.user {
                print("✅ AuthManager: Login complete, user: \(user.email)")
            }
        } catch let apiError as APIError {
            let errorMessage = formatAPIError(apiError)
            error = errorMessage
            throw apiError
        } catch let thrownError {
            error = "Login failed: \(thrownError.localizedDescription)"
            throw thrownError
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

        do {
            let request = RegisterRequest(
                email: email,
                password: password,
                firstName: firstName,
                lastName: lastName
            )
            let response: AuthResponse = try await apiService.post(
                "/auth/register",
                body: request,
                authenticated: false
            )

            // Get auth token from response body (preferred for mobile apps)
            if let authToken = response.token {
                // Save token to keychain
                try keychainService.save(token: authToken, forKey: tokenKey)

                // Set on API service
                apiService.authToken = authToken
            }

            // Set current user
            currentUser = response.user
        } catch let apiError as APIError {
            let errorMessage = formatAPIError(apiError)
            error = errorMessage
            throw apiError
        } catch let thrownError {
            error = "Registration failed: \(thrownError.localizedDescription)"
            throw thrownError
        }
    }

    func logout() async {
        // Try to call logout endpoint (best effort)
        do {
            let _: AuthResponse = try await apiService.post(
                "/auth/logout",
                body: EmptyBody(),
                authenticated: false
            )
        } catch {
            // Ignore logout endpoint errors
        }

        // Clear token from keychain
        try? keychainService.delete(forKey: tokenKey)

        // Clear token from API service
        apiService.authToken = nil

        // Clear cookies
        clearAuthCookies()

        // Clear current user
        currentUser = nil
    }

    func checkAuthStatus() async throws {
        do {
            let response: UserResponse = try await apiService.get(
                "/auth/me",
                authenticated: true
            )

            currentUser = response.user
        } catch {
            // If check fails, clear auth state
            await logout()
            throw error
        }
    }

    // MARK: - Private helpers

    private func extractAuthToken() -> String? {
        guard let baseURL = URL(string: apiService.baseURL),
              let cookies = HTTPCookieStorage.shared.cookies(for: baseURL) else {
            return nil
        }

        return cookies.first { $0.name == "auth-token" }?.value
    }

    private func clearAuthCookies() {
        guard let baseURL = URL(string: apiService.baseURL),
              let cookies = HTTPCookieStorage.shared.cookies(for: baseURL) else {
            return
        }

        for cookie in cookies where cookie.name == "auth-token" {
            HTTPCookieStorage.shared.deleteCookie(cookie)
        }
    }

    private func formatAPIError(_ error: APIError) -> String {
        switch error {
        case .invalidURL:
            return "Invalid URL"
        case .networkError(let underlyingError):
            return "Network error: \(underlyingError.localizedDescription)"
        case .invalidResponse:
            return "Invalid response from server"
        case .httpError(let statusCode, let message):
            return message ?? "HTTP error \(statusCode)"
        case .decodingError(let underlyingError):
            return "Data decoding error: \(underlyingError.localizedDescription)"
        }
    }
}
