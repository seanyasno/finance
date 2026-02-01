---
phase: quick-003
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - apps/finance/finance/Generated/Models.swift
  - apps/finance/finance/Services/AuthManager.swift
  - apps/finance/finance/Services/CategoryService.swift
autonomous: true

must_haves:
  truths:
    - "All services use types from Generated/Models.swift"
    - "No duplicate type definitions exist in service files"
    - "App builds successfully after refactoring"
  artifacts:
    - path: "apps/finance/finance/Generated/Models.swift"
      provides: "EmptyBody and EmptyResponse types"
      contains: "struct EmptyBody"
    - path: "apps/finance/finance/Services/AuthManager.swift"
      provides: "Auth service using generated types"
    - path: "apps/finance/finance/Services/CategoryService.swift"
      provides: "Category service using generated types"
  key_links:
    - from: "apps/finance/finance/Services/*.swift"
      to: "apps/finance/finance/Generated/Models.swift"
      via: "shared module scope in Xcode target"
---

<objective>
Refactor iOS services to use generated API client types from Generated/Models.swift

Purpose: Consolidate type definitions and ensure all services use the generated OpenAPI types consistently.

Output: Services using generated types with no inline type definitions.
</objective>

<execution_context>
@/Users/seanyasno/.claude/get-shit-done/workflows/execute-plan.md
@/Users/seanyasno/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@apps/finance/finance/Generated/Models.swift
@apps/finance/finance/Services/APIService.swift
@apps/finance/finance/Services/AuthManager.swift
@apps/finance/finance/Services/CategoryService.swift
@apps/finance/finance/Services/TransactionService.swift
@apps/finance/finance/Services/StatisticsService.swift
@apps/finance/finance/Services/KeychainService.swift
</context>

<tasks>

<task type="auto">
  <name>Task 1: Add EmptyBody and EmptyResponse to Generated Models</name>
  <files>apps/finance/finance/Generated/Models.swift</files>
  <action>
Add two utility types to the Response Wrappers section in Models.swift:

1. Add `EmptyBody` struct after `MessageResponse`:
```swift
/// Empty request body for endpoints that don't require a body
struct EmptyBody: Codable {}
```

2. Add `EmptyResponse` struct:
```swift
/// Empty response for endpoints that don't return data
struct EmptyResponse: Codable {}
```

Place these in the "Response Wrappers" section (around line 283) to keep them logically grouped with other response types.
  </action>
  <verify>Grep for "struct EmptyBody" and "struct EmptyResponse" in Models.swift shows both exist</verify>
  <done>EmptyBody and EmptyResponse types exist in Generated/Models.swift</done>
</task>

<task type="auto">
  <name>Task 2: Remove inline type definitions from services</name>
  <files>apps/finance/finance/Services/AuthManager.swift, apps/finance/finance/Services/CategoryService.swift</files>
  <action>
1. In AuthManager.swift:
   - Remove the private struct `EmptyBody` definition at line 219 (end of file)
   - The usage at line 145 (`EmptyBody()`) will now use the type from Models.swift

2. In CategoryService.swift:
   - Remove the inline `struct EmptyResponse: Codable {}` definition at line 85 (inside deleteCategory method)
   - The usage at line 86 will now use the type from Models.swift

Both services already use all other types from Models.swift (User, LoginRequest, RegisterRequest, AuthResponse, Category, CategoriesResponse, CreateCategoryRequest). This change completes the consolidation.
  </action>
  <verify>Grep for "struct Empty" in Services/ returns no matches</verify>
  <done>No inline type definitions exist in service files</done>
</task>

<task type="auto">
  <name>Task 3: Build and verify all services compile</name>
  <files>apps/finance/finance/</files>
  <action>
Build the iOS project to verify all services compile correctly with the generated types:

```bash
cd apps/finance && xcodebuild -scheme finance -destination 'platform=iOS Simulator,name=iPhone 16' build 2>&1 | head -50
```

If build succeeds, services are correctly using generated types.

Additionally verify by inspection:
- APIService.swift: Only defines APIError enum (infrastructure, not model type) - OK
- AuthManager.swift: Uses User, LoginRequest, RegisterRequest, AuthResponse, UserResponse, EmptyBody from Models.swift
- CategoryService.swift: Uses Category, CategoriesResponse, CreateCategoryRequest, EmptyResponse from Models.swift
- TransactionService.swift: Uses Transaction, TransactionsResponse, CreditCard, CreditCardsResponse, UpdateTransactionRequest, UpdateCreditCardRequest from Models.swift
- StatisticsService.swift: Uses SpendingSummary from Models.swift
- KeychainService.swift: Uses no API types (only Keychain/Security framework) - OK
  </action>
  <verify>xcodebuild returns BUILD SUCCEEDED</verify>
  <done>All services compile and use generated types from Models.swift</done>
</task>

</tasks>

<verification>
1. Build succeeds: `cd apps/finance && xcodebuild -scheme finance build`
2. No duplicate types: `grep -r "^struct" apps/finance/finance/Services/` returns no struct definitions
3. All services import types from shared module scope (Models.swift in same target)
</verification>

<success_criteria>
- Generated/Models.swift contains EmptyBody and EmptyResponse types
- No inline type definitions in any service file
- iOS app builds successfully
- All services use types from Generated/Models.swift
</success_criteria>

<output>
After completion, create `.planning/quick/003-refactor-services-to-use-generated-api-c/003-SUMMARY.md`
</output>
