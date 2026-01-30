import Foundation

struct LoginRequest: Codable {
    let email: String
    let password: String
}

struct RegisterRequest: Codable {
    let email: String
    let password: String
    let firstName: String?
    let lastName: String?
}

struct AuthResponse: Codable {
    let user: User?
    let message: String?
}

struct UserResponse: Codable {
    let user: User?
}
