import Foundation

enum APIError: Error {
    case invalidURL
    case networkError(Error)
    case invalidResponse
    case httpError(statusCode: Int, message: String?)
    case decodingError(Error)
}

class APIService {
    var baseURL: String = "http://127.0.0.1:3100"
    var authToken: String?

    private let urlSession: URLSession

    init() {
        // Configure URLSession to handle cookies automatically
        let configuration = URLSessionConfiguration.default
        configuration.httpCookieAcceptPolicy = .always
        configuration.httpShouldSetCookies = true
        configuration.httpCookieStorage = .shared
        self.urlSession = URLSession(configuration: configuration)
    }

    func request<T: Decodable>(
        _ endpoint: String,
        method: String,
        body: Encodable? = nil,
        authenticated: Bool = false
    ) async throws -> T {
        // Construct URL
        guard let url = URL(string: baseURL + endpoint) else {
            throw APIError.invalidURL
        }

        // Create request
        var request = URLRequest(url: url)
        request.httpMethod = method
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        // Add auth header if authenticated and token exists
        if authenticated, let token = authToken {
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }

        // Encode body if provided
        if let body = body {
            do {
                let encoder = JSONEncoder()
                request.httpBody = try encoder.encode(body)
            } catch {
                throw APIError.networkError(error)
            }
        }

        // Make request
        let (data, response): (Data, URLResponse)
        do {
            (data, response) = try await urlSession.data(for: request)
        } catch {
            throw APIError.networkError(error)
        }

        // Check response
        guard let httpResponse = response as? HTTPURLResponse else {
            throw APIError.invalidResponse
        }

        // Check status code
        guard (200...299).contains(httpResponse.statusCode) else {
            // Try to decode error message from response
            let errorMessage = try? JSONDecoder().decode([String: String].self, from: data)
            throw APIError.httpError(
                statusCode: httpResponse.statusCode,
                message: errorMessage?["message"]
            )
        }

        // Decode response
        do {
            let decoder = JSONDecoder()
            return try decoder.decode(T.self, from: data)
        } catch {
            throw APIError.decodingError(error)
        }
    }

    func get<T: Decodable>(_ endpoint: String, authenticated: Bool = true) async throws -> T {
        return try await request(endpoint, method: "GET", authenticated: authenticated)
    }

    func post<T: Decodable, B: Encodable>(
        _ endpoint: String,
        body: B,
        authenticated: Bool = false
    ) async throws -> T {
        return try await request(endpoint, method: "POST", body: body, authenticated: authenticated)
    }
}
