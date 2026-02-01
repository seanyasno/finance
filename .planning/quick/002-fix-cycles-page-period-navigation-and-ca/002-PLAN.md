---
phase: quick-002
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - apps/finance/finance/Generated/Models.swift
autonomous: true

must_haves:
  truths:
    - "All Cards tab shows transactions from previous billing periods when navigating backward"
    - "Single Card tab shows transactions from previous billing periods when navigating backward"
    - "Calendar Month tab shows transactions for the selected month"
  artifacts:
    - path: "apps/finance/finance/Generated/Models.swift"
      provides: "Fixed BillingCycle.calculateCycle() period calculation"
      contains: "calculateCycle"
  key_links:
    - from: "BillingCycleView.swift"
      to: "BillingCycle.calculateCycle"
      via: "forCard/calendarMonth factory methods"
      pattern: "BillingCycle\\.(forCard|calendarMonth)"
---

<objective>
Fix the Cycles page period navigation so all three tabs (All Cards, Single Card, Calendar Month) correctly display transactions for previous periods.

Purpose: After quick-001 fixed the endDate calculation, users reported that:
- All Cards tab only shows current month data
- Single Card tab only shows current month data
- Calendar Month tab shows no data at all

This indicates the period offset calculation in BillingCycle.calculateCycle() has a bug preventing correct historical period navigation.

Output: Working period navigation across all tabs with transactions correctly filtered by billing period.
</objective>

<execution_context>
@/Users/seanyasno/.claude/get-shit-done/workflows/execute-plan.md
@/Users/seanyasno/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@.planning/quick/001-fix-cycles-page-showing-no-data-in-all-t/001-SUMMARY.md
@apps/finance/finance/Generated/Models.swift
@apps/finance/finance/Views/BillingCycles/BillingCycleView.swift
</context>

<tasks>

<task type="auto">
  <name>Task 1: Debug and fix BillingCycle.calculateCycle period calculation</name>
  <files>apps/finance/finance/Generated/Models.swift</files>
  <action>
The BillingCycle.calculateCycle() function has a bug in the period offset calculation:

Current logic (lines 329-348):
```swift
var monthOffset = offset
if currentDay < billingDay { monthOffset -= 1 }  // Bug: This adjustment is always applied
components.day = min(billingDay, daysInMonth(...))
// ... then adds monthOffset to compute startDate
```

**The Problem:**
1. The `currentDay < billingDay` check subtracts 1 from monthOffset to handle the case where we're "before" the billing day in the current month (so the current cycle started last month)
2. BUT this adjustment should only affect the BASE cycle calculation, not the offset navigation
3. When user navigates to previous period (offset=-1), the function incorrectly subtracts an additional month

**The Fix:**
The `if currentDay < billingDay { monthOffset -= 1 }` logic calculates which cycle we're CURRENTLY in (base case). The offset should be applied AFTER this base calculation, not combined with it.

Refactor calculateCycle to:
1. First, determine the START of the CURRENT billing cycle (without offset)
2. Then, add the offset to navigate forward/backward from that base

Fixed logic:
```swift
private static func calculateCycle(billingDay: Int, offset: Int, card: CreditCard?) -> BillingCycle {
    let calendar = Calendar.current
    let today = Date()
    var components = calendar.dateComponents([.year, .month, .day], from: today)
    let currentDay = components.day ?? 1

    // First: Find the start of the CURRENT billing cycle
    // If we're before the billing day, current cycle started last month
    var baseMonthOffset = 0
    if currentDay < billingDay {
        baseMonthOffset = -1
    }

    // Combine base with navigation offset
    let totalMonthOffset = baseMonthOffset + offset

    components.day = min(billingDay, daysInMonth(year: components.year!, month: components.month!))

    if let adjustedDate = calendar.date(from: components),
       let startDate = calendar.date(byAdding: .month, value: totalMonthOffset, to: adjustedDate),
       let nextCycleStart = calendar.date(byAdding: .month, value: 1, to: startDate),
       let endDate = calendar.date(byAdding: .day, value: -1, to: nextCycleStart),
       let endOfDayDate = calendar.date(bySettingHour: 23, minute: 59, second: 59, of: endDate) {
        return BillingCycle(startDate: startDate, endDate: endOfDayDate, card: card)
    }

    // Fallback
    let fallbackStart = calendar.date(from: DateComponents(year: components.year, month: components.month, day: 1))!
    let fallbackEnd = calendar.date(byAdding: DateComponents(month: 1, day: -1), to: fallbackStart)!
    let fallbackEndOfDay = calendar.date(bySettingHour: 23, minute: 59, second: 59, of: fallbackEnd)!
    return BillingCycle(startDate: fallbackStart, endDate: fallbackEndOfDay, card: card)
}
```

This change makes the variable naming clearer and ensures the offset is correctly applied to navigate periods.
  </action>
  <verify>Build the iOS app: `cd apps/finance && xcodebuild -scheme finance -destination 'platform=iOS Simulator,name=iPhone 16' build 2>&1 | tail -20` should show BUILD SUCCEEDED</verify>
  <done>BillingCycle.calculateCycle correctly computes historical periods when offset is negative</done>
</task>

<task type="auto">
  <name>Task 2: Add debug logging and verify period calculation</name>
  <files>apps/finance/finance/Views/BillingCycles/BillingCycleView.swift</files>
  <action>
Temporarily add debug print statements to verify the fix works:

In loadTransactions() function, before the fetchTransactions call, add:
```swift
print("[BillingCycle Debug] viewMode: \(viewMode), periodOffset: \(periodOffset)")
print("[BillingCycle Debug] cycle: \(cycle.startDate) to \(cycle.endDate)")
print("[BillingCycle Debug] displayPeriod: \(cycle.displayPeriod)")
```

Build and run the app in simulator. Navigate between periods using the chevron buttons and verify in Xcode console that:
1. periodOffset increments/decrements correctly (-1, -2, -3 for past periods)
2. startDate and endDate change appropriately for each period
3. Calendar Month mode shows correct month boundaries (1st to last day)

After verifying the dates are correct, check the API call in TransactionService to ensure the date filtering is sending correct ISO8601 strings.
  </action>
  <verify>Build succeeds and debug output shows correct date ranges when navigating periods</verify>
  <done>Period calculation verified working for negative offsets across all three view modes</done>
</task>

<task type="auto">
  <name>Task 3: Remove debug logging</name>
  <files>apps/finance/finance/Views/BillingCycles/BillingCycleView.swift</files>
  <action>
Remove all debug print statements added in Task 2.

The fix is complete and verified. Clean up any temporary logging code.
  </action>
  <verify>Build succeeds with `xcodebuild -scheme finance -destination 'platform=iOS Simulator,name=iPhone 16' build` and no debug print statements remain in BillingCycleView.swift</verify>
  <done>Debug logging removed, clean code committed</done>
</task>

</tasks>

<verification>
1. Build succeeds without errors
2. All Cards tab shows data when navigating to previous periods
3. Single Card tab shows data when navigating to previous periods
4. Calendar Month tab shows data for selected months
5. Current period display correctly shows the date range for selected period
</verification>

<success_criteria>
- All three Cycles tabs display transactions when navigating to previous periods
- Period date ranges are correctly calculated (startDate to endDate span one billing cycle)
- No regressions in current period display
</success_criteria>

<output>
After completion, create `.planning/quick/002-fix-cycles-page-period-navigation-and-ca/002-SUMMARY.md`
</output>
