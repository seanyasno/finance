---
phase: quick-005
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - apps/finance/finance/Generated/ModelExtensions.swift
autonomous: true

must_haves:
  truths:
    - "Billing cycles view displays transactions within the selected period"
    - "Transaction dates are correctly parsed from API response"
    - "Date filtering in BillingCycleView works with actual transaction dates"
  artifacts:
    - path: "apps/finance/finance/Generated/ModelExtensions.swift"
      provides: "Correct timestamp parsing from AnyCodable"
      contains: "timestamp?.value as? String"
  key_links:
    - from: "Transaction.date computed property"
      to: "BillingCycleView.filteredTransactions"
      via: "Date comparison for filtering"
      pattern: "date >= cycle.startDate && date <= cycle.endDate"
---

<objective>
Fix billing cycles UI not displaying transactions despite successful data fetching.

Purpose: The billing cycles page shows "No Transactions" even when data is fetched from the backend. Root cause: The `Transaction.date` computed property incorrectly accesses `timestamp as? String` when `timestamp` is of type `AnyCodable?`. The cast always fails because `AnyCodable` is a struct wrapping the actual value in its `.value` property. This causes all transactions to fallback to `Date()` (current moment), which then fails the date range filter.

Output: Transactions correctly display in billing cycles view with proper date parsing.
</objective>

<execution_context>
@/Users/seanyasno/.claude/get-shit-done/workflows/execute-plan.md
@/Users/seanyasno/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@apps/finance/finance/Generated/ModelExtensions.swift
@apps/finance/finance/Generated/OpenAPI/AnyCodable.swift
@apps/finance/finance/Views/BillingCycles/BillingCycleView.swift
</context>

<tasks>

<task type="auto">
  <name>Task 1: Fix Transaction.date computed property to correctly extract timestamp from AnyCodable</name>
  <files>apps/finance/finance/Generated/ModelExtensions.swift</files>
  <action>
    In the Transaction extension, fix the `date` computed property (around line 77-81).

    Current broken code:
    ```swift
    var date: Date {
        guard let timestampString = timestamp as? String else {
            return Date()
        }
        return ISO8601DateFormatter().date(from: timestampString) ?? Date()
    }
    ```

    The issue: `timestamp` is of type `AnyCodable?`, which is a struct with a `value: Any` property. Casting `AnyCodable?` directly to `String` always fails.

    Fix: Access the nested `.value` property before casting:
    ```swift
    var date: Date {
        guard let timestampString = timestamp?.value as? String else {
            return Date()
        }
        return ISO8601DateFormatter().date(from: timestampString) ?? Date()
    }
    ```

    Also fix the `formattedDate` computed property (around line 62-70) which has the same issue:

    Current broken code:
    ```swift
    var formattedDate: String {
        guard let timestampString = timestamp as? String,
              let date = ISO8601DateFormatter().date(from: timestampString) else {
            return (timestamp as? String) ?? ""
        }
        ...
    }
    ```

    Fix:
    ```swift
    var formattedDate: String {
        guard let timestampString = timestamp?.value as? String,
              let date = ISO8601DateFormatter().date(from: timestampString) else {
            return (timestamp?.value as? String) ?? ""
        }
        ...
    }
    ```
  </action>
  <verify>
    Build the iOS app successfully: `cd apps/finance && xcodebuild -scheme finance -destination 'platform=iOS Simulator,name=iPhone 15' build 2>&1 | grep -E "(error:|BUILD SUCCEEDED|BUILD FAILED)"`
  </verify>
  <done>
    - Transaction.date correctly parses timestamp from AnyCodable.value
    - Transaction.formattedDate correctly parses timestamp from AnyCodable.value
    - Billing cycles view displays transactions that fall within the date range
  </done>
</task>

</tasks>

<verification>
1. Build succeeds without errors
2. Billing cycles view shows transactions when data is fetched
3. Transactions appear in the correct billing period (not all in "current" period)
</verification>

<success_criteria>
- AnyCodable timestamp values are correctly extracted via `.value` property
- Date filtering in BillingCycleView works correctly
- Transactions display in their appropriate billing cycles
</success_criteria>

<output>
After completion, create `.planning/quick/005-fix-billing-cycles-ui-not-displaying-tra/005-SUMMARY.md`
</output>
