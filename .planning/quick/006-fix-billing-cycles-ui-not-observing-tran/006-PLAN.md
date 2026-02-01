---
phase: quick-006
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - apps/finance/finance/Views/BillingCycles/BillingCycleView.swift
  - apps/finance/finance/Generated/ModelExtensions.swift
autonomous: true

must_haves:
  truths:
    - "Transactions fetched from API appear in BillingCycleSummaryView"
    - "Date filtering in filteredTransactions matches billing cycle boundaries"
  artifacts:
    - path: "apps/finance/finance/Views/BillingCycles/BillingCycleView.swift"
      provides: "Working filteredTransactions computed property"
    - path: "apps/finance/finance/Generated/ModelExtensions.swift"
      provides: "Reliable Transaction.date parsing with fallback visibility"
  key_links:
    - from: "BillingCycleView.filteredTransactions"
      to: "Transaction.date"
      via: "date comparison in filter closure"
      pattern: "transaction\\.date.*cycle\\.(startDate|endDate)"
---

<objective>
Fix billing cycles UI not observing TransactionService data updates

Purpose: User reports data IS fetched (confirmed at TransactionService line 36) but UI shows "No Transactions". Previous fix (quick-005) addressed AnyCodable parsing, but filtering or observation may still be broken.

Output: Working billing cycles view that displays fetched transactions
</objective>

<execution_context>
@/Users/seanyasno/.claude/get-shit-done/workflows/execute-plan.md
@/Users/seanyasno/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@apps/finance/finance/Views/BillingCycles/BillingCycleView.swift
@apps/finance/finance/Services/TransactionService.swift
@apps/finance/finance/Generated/ModelExtensions.swift
@apps/finance/finance/Generated/CustomModels.swift
</context>

<tasks>

<task type="auto">
  <name>Task 1: Debug and fix transaction date filtering</name>
  <files>
    apps/finance/finance/Views/BillingCycles/BillingCycleView.swift
    apps/finance/finance/Generated/ModelExtensions.swift
  </files>
  <action>
Investigate why filteredTransactions returns empty despite transactionService.transactions having data.

**Step 1: Add debug logging to understand the issue**

In BillingCycleView.swift, temporarily add print statements in filteredTransactions:
- Print transactionService.transactions.count
- Print cycle.startDate and cycle.endDate
- For each transaction, print transaction.date and whether it passes the filter

**Step 2: Identify root cause**

Based on debug output, the issue is likely one of:

A) **Date parsing failure** - Transaction.date returns Date() fallback because:
   - ISO8601DateFormatter needs fractional seconds support if server sends them
   - Timezone mismatch (server sends UTC, formatter expects local or vice versa)

B) **BillingCycle boundaries off** - startDate/endDate don't match expected range

C) **State observation issue** - View not re-rendering when transactions update

**Step 3: Apply fix based on finding**

If date parsing issue:
- In ModelExtensions.swift, update Transaction.date to handle ISO8601 with fractional seconds:
  ```swift
  var date: Date {
      guard let timestampString = timestamp?.value as? String else {
          return Date()
      }
      // Try standard ISO8601 first
      let formatter = ISO8601DateFormatter()
      if let date = formatter.date(from: timestampString) {
          return date
      }
      // Try with fractional seconds
      formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
      return formatter.date(from: timestampString) ?? Date()
  }
  ```

If state observation issue:
- Ensure BillingCycleSummaryView receives the array directly (not stale computed)
- Consider using @ObservedObject pattern if needed

**Step 4: Remove debug logging**

Remove any print statements added for debugging after fix is confirmed.
  </action>
  <verify>
Build the iOS app and navigate to Billing Cycles tab. Confirm transactions display instead of "No Transactions" message.
  </verify>
  <done>
Billing cycles UI displays transactions that were fetched from the API. The filteredTransactions computed property correctly filters by date range.
  </done>
</task>

</tasks>

<verification>
- Build succeeds: `xcodebuild -workspace apps/finance/finance.xcworkspace -scheme finance build` (or via Xcode)
- Navigate to Billing Cycles tab shows transactions (not "No Transactions")
- Switching between Combined/Single Card/Calendar Month modes shows appropriate transactions
- Period navigation (left/right arrows) shows transactions for historical periods
</verification>

<success_criteria>
- Transactions that exist in TransactionService.transactions appear in the UI
- Date filtering correctly matches billing cycle boundaries
- No stale state issues - UI updates when data changes
</success_criteria>

<output>
After completion, create `.planning/quick/006-fix-billing-cycles-ui-not-observing-tran/006-SUMMARY.md`
</output>
