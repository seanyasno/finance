---
phase: quick-001
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - apps/finance/finance/Generated/Models.swift
  - apps/finance/finance/Views/BillingCycles/BillingCycleView.swift
autonomous: true

must_haves:
  truths:
    - "Transactions within billing cycle date range appear in Cycles page"
    - "All Cards tab shows aggregated transactions"
    - "Single Card tab shows card-specific transactions"
    - "Calendar Month tab shows monthly transactions"
  artifacts:
    - path: "apps/finance/finance/Generated/Models.swift"
      provides: "BillingCycle with correct end-of-day endDate"
      contains: "23, 59, 59"
  key_links:
    - from: "BillingCycleView.swift"
      to: "BillingCycle.endDate"
      via: "date filtering comparison"
      pattern: "endDate"
---

<objective>
Fix the Cycles page showing no data across all tabs (All Cards, Single Card, Calendar Month).

Purpose: The billing cycle date range calculation sets endDate to midnight (00:00:00) of the last day, causing transactions with timestamps later that day to be excluded from the filter.

Output: Working Cycles page displaying transactions correctly in all view modes.
</objective>

<context>
@.planning/STATE.md
@apps/finance/finance/Generated/Models.swift
@apps/finance/finance/Views/BillingCycles/BillingCycleView.swift
@apps/finance/finance/Services/TransactionService.swift
</context>

<tasks>

<task type="auto">
  <name>Task 1: Fix BillingCycle endDate to include entire last day</name>
  <files>apps/finance/finance/Generated/Models.swift</files>
  <action>
In the BillingCycle struct's `calculateCycle` function (around line 329), the endDate is calculated as:
```swift
let endDate = calendar.date(byAdding: .day, value: -1, to: nextCycleStart)
```

This results in midnight (00:00:00) of the last day, excluding transactions later that day.

Fix by setting endDate to 23:59:59 of the last day. Modify the calculateCycle function to:

1. After calculating endDate (subtracting 1 day from nextCycleStart), set the time to end of day:
```swift
let endDateComponents = DateComponents(hour: 23, minute: 59, second: 59)
if let endOfDayDate = calendar.date(bySettingHour: 23, minute: 59, second: 59, of: endDate) {
    return BillingCycle(startDate: startDate, endDate: endOfDayDate, card: card)
}
```

2. Also update the fallback case at the bottom of the function to set end of day:
```swift
let fallbackEndOfDay = calendar.date(bySettingHour: 23, minute: 59, second: 59, of: fallbackEnd)!
return BillingCycle(startDate: fallbackStart, endDate: fallbackEndOfDay, card: card)
```

This ensures the date range is inclusive of the entire last day.
  </action>
  <verify>Build the iOS app in Xcode - should compile without errors. Print BillingCycle.calendarMonth().endDate in debugger or via print statement to verify it shows 23:59:59 time component.</verify>
  <done>BillingCycle.endDate includes time 23:59:59, ensuring transactions on the last day of the cycle are included in date filtering.</done>
</task>

<task type="auto">
  <name>Task 2: Verify transactions load in Cycles page</name>
  <files>apps/finance/finance/Views/BillingCycles/BillingCycleView.swift</files>
  <action>
Add debug logging to verify the fix works:

1. In loadTransactions() function (line 162), add logging before the API call:
```swift
print("DEBUG Cycles: Loading transactions for cycle \(cycle.startDate) to \(cycle.endDate)")
```

2. After the transactions are loaded (after await transactionService.fetchTransactions), add:
```swift
print("DEBUG Cycles: Loaded \(transactionService.transactions.count) transactions")
```

3. In the filteredTransactions computed property (line 128), add:
```swift
let filtered = transactionService.transactions.filter { ... }
print("DEBUG Cycles: Filtered to \(filtered.count) transactions for cycle")
return filtered
```

Run the app and navigate to Cycles tab. Check Xcode console for debug output showing:
- The date range being requested (should show endDate with 23:59:59)
- Number of transactions returned from API
- Number of transactions after filtering

If transactions are returned but filtered count is 0, there may be an additional filtering issue.
If API returns 0 transactions, check API logs for the query being executed.
  </action>
  <verify>Run app in Xcode simulator, navigate to Cycles tab. Console should show transaction counts. UI should display transactions if data exists in the database for the current billing cycle period.</verify>
  <done>Cycles page displays transactions across all three tabs (All Cards, Single Card, Calendar Month) when transactions exist within the date range.</done>
</task>

<task type="auto">
  <name>Task 3: Remove debug logging after verification</name>
  <files>apps/finance/finance/Views/BillingCycles/BillingCycleView.swift</files>
  <action>
After confirming the fix works:

1. Remove all DEBUG print statements added in Task 2 from BillingCycleView.swift
2. Keep the code clean for production

If the fix did NOT work (still no data), investigate further:
- Check if API is running (curl http://127.0.0.1:3100/health)
- Check if user is authenticated (look for auth token logs)
- Check if transactions exist in database for the date range
- Check if creditCards array is populated (needed for combined/singleCard modes)
  </action>
  <verify>Code has no DEBUG print statements. App compiles and Cycles page functions correctly.</verify>
  <done>Clean production code with working Cycles page displaying transactions.</done>
</task>

</tasks>

<verification>
1. Build iOS app without errors
2. Run app and login
3. Navigate to Cycles tab
4. Verify All Cards tab shows transactions (if any exist in current billing period)
5. Switch to Single Card tab, select a card, verify transactions show
6. Switch to Calendar Month tab, verify transactions show
7. Navigate to previous periods using left arrow, verify historical data loads
</verification>

<success_criteria>
- BillingCycle.endDate includes 23:59:59 time component
- Transactions within billing cycle date range appear in UI
- All three view modes (All Cards, Single Card, Calendar Month) display data correctly
- Period navigation (previous months) works and shows historical data
</success_criteria>

<output>
After completion, report findings:
- Whether the endDate fix resolved the issue
- If additional issues were discovered during debugging
- Final state of the Cycles page functionality
</output>
