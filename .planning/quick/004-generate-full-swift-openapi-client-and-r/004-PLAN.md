---
phase: quick
plan: 004
type: execute
wave: 1
depends_on: []
files_modified:
  - apps/api/package.json
  - apps/api/scripts/generate-swift.sh
  - apps/finance/finance/Services/APIService.swift (deleted)
  - apps/finance/finance/Services/AuthManager.swift
  - apps/finance/finance/Services/TransactionService.swift
  - apps/finance/finance/Services/CategoryService.swift
  - apps/finance/finance/Services/StatisticsService.swift
  - apps/finance/finance/Generated/ (regenerated)
autonomous: true

must_haves:
  truths:
    - "openapi-generator-cli generates full Swift5 client with API methods"
    - "Services use generated OpenAPIClient instead of manual APIService"
    - "APIService.swift no longer exists"
    - "App compiles and API calls work"
  artifacts:
    - path: "apps/finance/finance/Generated/OpenAPIClient/"
      provides: "Generated Swift API client"
    - path: "apps/api/scripts/generate-swift.sh"
      provides: "Updated script that generates full client"
  key_links:
    - from: "Services/*.swift"
      to: "Generated/OpenAPIClient/Classes/OpenAPIs/APIs/*.swift"
      via: "import and API calls"
---

<objective>
Generate a complete Swift OpenAPI client using openapi-generator-cli and migrate all services from the manual APIService to the generated client.

Purpose: Replace hand-written HTTP client with auto-generated type-safe API client that stays in sync with the OpenAPI spec.

Output: Generated OpenAPIClient in apps/finance/finance/Generated/ with all API methods, and updated services using the generated client.
</objective>

<execution_context>
@/Users/seanyasno/.claude/get-shit-done/workflows/execute-plan.md
@/Users/seanyasno/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@apps/api/package.json
@apps/api/scripts/generate-swift.sh
@apps/finance/finance/Services/APIService.swift
@apps/finance/finance/Services/AuthManager.swift
@apps/finance/finance/Services/TransactionService.swift
@apps/finance/finance/Services/CategoryService.swift
@apps/finance/finance/Services/StatisticsService.swift
@apps/finance/finance/Generated/Models.swift
</context>

<tasks>

<task type="auto">
  <name>Task 1: Update generate:swift script and generate full client</name>
  <files>
    apps/api/scripts/generate-swift.sh
    apps/api/package.json
    apps/finance/finance/Generated/
  </files>
  <action>
1. Update `apps/api/scripts/generate-swift.sh` to use openapi-generator-cli with Swift5 generator:
   - Use generator: `swift5`
   - Output to: `apps/finance/finance/Generated/`
   - Keep the Models.swift consolidation for custom computed properties and client-only models (BillingCycle, etc.) - append to the generated output
   - Configure to use URLSession (not Alamofire) via `--additional-properties=library=urlsession`
   - Clean previous generated files before regenerating

2. The script should:
   - Check API is running (existing health check)
   - Run openapi-generator-cli with swift5 generator
   - Preserve the custom Models.swift content (client-only models like BillingCycle, EmptyBody, EmptyResponse, Color extension) by appending to generated Models.swift or keeping as separate CustomModels.swift

3. Run `cd apps/api && npm run generate:swift` to generate the client (requires API running)

4. Delete `apps/finance/finance/Services/APIService.swift`
  </action>
  <verify>
    - `apps/finance/finance/Generated/OpenAPIClient/` directory exists with API files
    - `apps/finance/finance/Services/APIService.swift` does not exist
    - Generated files include APIs/AuthenticationAPI.swift, TransactionsAPI.swift, etc.
  </verify>
  <done>Full Swift client generated with all API methods, APIService.swift deleted</done>
</task>

<task type="auto">
  <name>Task 2: Migrate services to use generated OpenAPIClient</name>
  <files>
    apps/finance/finance/Services/AuthManager.swift
    apps/finance/finance/Services/TransactionService.swift
    apps/finance/finance/Services/CategoryService.swift
    apps/finance/finance/Services/StatisticsService.swift
  </files>
  <action>
Update each service to use the generated OpenAPIClient instead of the manual APIService:

1. **AuthManager.swift**:
   - Remove `private let apiService: APIService`
   - Configure OpenAPIClient.basePath = Config.apiBaseURL on init
   - Use AuthenticationAPI.login(), register(), logout(), authMe()
   - Handle auth token storage with generated client's request modifier or custom header injection
   - The generated client uses completion handlers - wrap in async/await using withCheckedThrowingContinuation

2. **TransactionService.swift**:
   - Replace apiService.get/patch calls with TransactionsAPI methods
   - Use TransactionsAPI.transactionsControllerFindAll(startDate:endDate:creditCardId:)
   - Use TransactionsAPI.transactionsControllerUpdate(id:updateTransactionDto:)
   - Use CreditCardsAPI for credit card operations

3. **CategoryService.swift**:
   - Use CategoriesAPI.categoriesControllerFindAll()
   - Use CategoriesAPI.categoriesControllerCreate(createCategoryDto:)
   - Use CategoriesAPI.categoriesControllerRemove(id:)

4. **StatisticsService.swift**:
   - Use StatisticsAPI.statisticsControllerGetSpendingSummary()

5. Create shared error handling: Add extension to map OpenAPI errors to user-friendly messages (similar to existing handleAPIError pattern)

6. Authentication: The generated client needs auth token in headers. Add a shared mechanism:
   - Either configure OpenAPIClient's customHeaders
   - Or use request modifier in Configuration
  </action>
  <verify>
    - All services compile without errors
    - No references to APIService or APIError (old manual types)
    - `cd apps/finance && xcodebuild -scheme finance -destination 'platform=iOS Simulator,name=iPhone 16' build` succeeds
  </verify>
  <done>All services migrated to generated OpenAPIClient, app compiles successfully</done>
</task>

<task type="auto">
  <name>Task 3: Preserve custom models and verify integration</name>
  <files>
    apps/finance/finance/Generated/CustomModels.swift (new)
    apps/api/scripts/generate-swift.sh
  </files>
  <action>
1. Create `apps/finance/finance/Generated/CustomModels.swift` with client-only models that aren't from the API:
   - BillingCycle struct (client-side billing cycle calculation)
   - BillingCycleViewMode enum
   - EmptyBody, EmptyResponse structs
   - Color hex extension
   - Any computed properties that extend generated types (displayName, formattedAmount, etc.)

2. Update generate-swift.sh to NOT overwrite CustomModels.swift during regeneration

3. Add type aliases or extensions if needed to bridge generated DTO names to existing simple names used in services (e.g., TransactionsResponseDto -> TransactionsResponse if naming differs)

4. Verify the generated API methods work with the existing model types used in services
  </action>
  <verify>
    - CustomModels.swift exists with client-only types
    - BillingCycle, BillingCycleViewMode available for views
    - Color(hex:) extension works
    - Build succeeds: `cd apps/finance && xcodebuild -scheme finance -destination 'platform=iOS Simulator,name=iPhone 16' build`
  </verify>
  <done>Custom models preserved, type bridging complete, full build succeeds</done>
</task>

</tasks>

<verification>
1. API server running: `curl -s http://localhost:3100/api-json | head -1` returns valid JSON
2. Generated client exists: `ls apps/finance/finance/Generated/OpenAPIClient/Classes/OpenAPIs/APIs/`
3. APIService deleted: `! test -f apps/finance/finance/Services/APIService.swift`
4. iOS build: `cd apps/finance && xcodebuild -scheme finance -destination 'platform=iOS Simulator,name=iPhone 16' build`
</verification>

<success_criteria>
- openapi-generator-cli generates full Swift5 client (not just models)
- All services use generated API methods instead of manual HTTP calls
- APIService.swift is deleted
- Custom client-only models (BillingCycle, etc.) preserved
- iOS app compiles successfully
- Generated client is configured with correct base URL and auth headers
</success_criteria>

<output>
After completion, create `.planning/quick/004-generate-full-swift-openapi-client-and-r/004-SUMMARY.md`
</output>
