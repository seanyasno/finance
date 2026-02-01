//
// Config.swift
// finance
//
// Centralized configuration - edit this file to change settings
//

import Foundation

enum Config {
    // MARK: - API Configuration

    /// Base URL for the API
    ///
    /// To change for different environments:
    /// 1. Edit this value directly, OR
    /// 2. Set API_BASE_URL environment variable in Xcode scheme
    ///
    /// Common values:
    /// - Local: "http://127.0.0.1:3100"
    /// - Simulator on Mac: "http://localhost:3100"
    /// - Production: "https://api.yourapp.com"
    static var apiBaseURL: String {
        // Try to get from environment variable first (set in Xcode scheme)
        if let envURL = ProcessInfo.processInfo.environment["API_BASE_URL"], !envURL.isEmpty {
            return envURL
        }

        // Default for local development
        return "http://127.0.0.1:3100"
    }

    // MARK: - Environment Info

    /// Current build configuration (Debug/Release)
    static var isDebug: Bool {
        #if DEBUG
        return true
        #else
        return false
        #endif
    }

    /// App version from bundle
    static var appVersion: String {
        return Bundle.main.object(forInfoDictionaryKey: "CFBundleShortVersionString") as? String ?? "1.0"
    }

    /// Build number from bundle
    static var buildNumber: String {
        return Bundle.main.object(forInfoDictionaryKey: "CFBundleVersion") as? String ?? "1"
    }

    // MARK: - Logging

    /// Print configuration on init (useful for debugging)
    static func printConfiguration() {
        print("""

        ═══════════════════════════════════════
        📱 Finance App Configuration
        ═══════════════════════════════════════
        Version:     \(appVersion) (\(buildNumber))
        Environment: \(isDebug ? "DEBUG 🔧" : "RELEASE 🚀")
        API URL:     \(apiBaseURL)
        ═══════════════════════════════════════

        """)
    }
}
