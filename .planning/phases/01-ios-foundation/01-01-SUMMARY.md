---
phase: 01-ios-foundation
plan: 01
subsystem: networking-and-auth
status: complete
tags: [ios, swift, networking, authentication, keychain, jwt, cookies]

dependency-graph:
  requires: []
  provides:
    - HTTP client with cookie-based authentication
    - Secure token persistence in iOS Keychain
    - Observable auth state management
  affects:
    - All future iOS features requiring authentication
    - Transaction and budget features will use AuthManager

tech-stack:
  added:
    - URLSession with cookie handling
    - iOS Security framework for Keychain
    - Combine for reactive state management
  patterns:
    - ObservableObject for auth state
    - Cookie-based JWT authentication
    - Async/await for network calls

key-files:
  created:
    - apps/finance/finance/Models/User.swift
    - apps/finance/finance/Models/AuthModels.swift
    - apps/finance/finance/Services/KeychainService.swift
    - apps/finance/finance/Services/APIService.swift
    - apps/finance/finance/Services/AuthManager.swift
  modified: []

decisions:
  - id: cookie-based-auth
    title: Use cookie-based authentication instead of manual token handling
    rationale: |
      The NestJS API uses httpOnly cookies for JWT tokens. URLSession automatically
      handles cookie storage and transmission, which is more secure than manual token
      management in headers. This approach:
      - Leverages iOS native cookie handling
      - Maintains parity with web client behavior
      - Reduces code complexity
      - Still uses Keychain to persist token value for offline reference
    alternatives: Manual Set-Cookie header parsing and Bearer token injection
    chosen: Automatic cookie handling via URLSession
  - id: main-actor-auth-manager
    title: AuthManager uses @MainActor for UI safety
    rationale: |
      Auth state directly affects UI rendering. Using @MainActor ensures all
      @Published property updates happen on the main thread, preventing runtime
      warnings and UI glitches.

metrics:
  duration: 3m 7s
  completed: 2026-01-30
---

# Phase 01 Plan 01: Networking and Authentication Foundation Summary

iOS networking and authentication infrastructure with cookie-based JWT auth, Keychain persistence, and observable state management.

## What Was Built

### Core Services

1. **APIService** - HTTP client for NestJS backend
   - Generic request method supporting GET/POST with async/await
   - Automatic cookie handling via URLSession configuration
   - Bearer token support for authenticated requests
   - Comprehensive error handling with typed APIError enum
   - Uses 127.0.0.1 for iOS simulator compatibility

2. **KeychainService** - Secure token storage
   - Save/load/delete operations using Security framework
   - Handles duplicate items by deleting before saving
   - Returns nil for missing items (not an error)
   - Uses kSecClassGenericPassword storage class

3. **AuthManager** - Observable auth state management
   - @Published properties for currentUser, isLoading, error
   - Login/register methods with error handling
   - Logout that clears both Keychain and cookies
   - Auth status check with automatic state cleanup
   - Token persistence across app restarts
   - Cookie extraction from URLSession's HTTPCookieStorage

### Data Models

1. **User** - User entity matching API response
   - Properties: id, email, firstName, lastName, createdAt
   - Conforms to Codable and Identifiable

2. **AuthModels** - Request/response DTOs
   - LoginRequest, RegisterRequest
   - AuthResponse, UserResponse
   - All conform to Codable

## Tasks Completed

| Task | Description | Commit | Files |
|------|-------------|--------|-------|
| 1 | Create data models for auth | e9ce4b2 | User.swift, AuthModels.swift |
| 2 | Create KeychainService for secure token storage | 79b02a2 | KeychainService.swift |
| 3 | Create APIService for HTTP networking | 77ed761 | APIService.swift |
| 4 | Create AuthManager for auth state management | e36e732 | AuthManager.swift |

## Decisions Made

**Cookie-based authentication approach:**
- Decision: Use URLSession's automatic cookie handling instead of manual token extraction
- Rationale: The NestJS API uses httpOnly cookies. URLSession handles this natively and securely
- Impact: Simpler code, better security, parity with web client
- Still persist token value in Keychain for offline reference

**MainActor for AuthManager:**
- Decision: Mark AuthManager as @MainActor
- Rationale: Ensures @Published properties update on main thread for UI safety
- Impact: Prevents runtime warnings and UI glitches

## Deviations from Plan

None - plan executed exactly as written.

## Technical Decisions

**URLSession Configuration:**
- Enabled automatic cookie acceptance and storage
- Uses shared HTTPCookieStorage for cookie persistence
- Configured to always set cookies from responses

**Error Handling:**
- APIError enum covers all failure modes
- AuthManager formats errors into user-friendly messages
- Login/register methods catch and rethrow with context

**Token Persistence Strategy:**
- Cookies are automatically persisted by iOS between app sessions
- Additionally store token value in Keychain for explicit reference
- On app launch, verify stored token by calling /auth/me
- Clear invalid tokens automatically

## Integration Points

**With NestJS API:**
- POST /auth/register - creates user and sets auth-token cookie
- POST /auth/login - validates credentials and sets auth-token cookie
- POST /auth/logout - clears auth-token cookie
- GET /auth/me - returns current user (requires authentication)

**Authentication Flow:**
1. User calls login/register on AuthManager
2. APIService makes HTTP request to NestJS
3. URLSession automatically stores auth-token cookie from Set-Cookie header
4. AuthManager extracts token value and saves to Keychain
5. On subsequent requests, URLSession automatically includes cookie
6. On app restart, AuthManager loads token from Keychain and verifies with /auth/me

## Testing Notes

All files compile successfully with Xcode for iOS Simulator.

**Manual Testing Required:**
- Start NestJS API: `cd apps/api && npm run dev`
- Register new user through iOS app
- Verify auth token saved to Keychain
- Close and reopen app - user should remain logged in
- Verify logout clears both Keychain and cookies

## Next Phase Readiness

**Blockers:** None

**Recommendations for Next Plan:**
1. Create login/register UI screens that use AuthManager
2. Add protected route wrapper that redirects unauthenticated users
3. Consider adding biometric authentication option (Face ID/Touch ID)

**What This Enables:**
- All authenticated features (transactions, budgets, accounts)
- Protected navigation and data access
- Persistent user sessions
- Error handling and loading states in UI
