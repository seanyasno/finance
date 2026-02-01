---
phase: quick
plan: 008
type: execute
wave: 1
depends_on: []
files_modified:
  - apps/finance/finance/Views/Statistics/SpendingChartView.swift
autonomous: true

must_haves:
  truths:
    - "Bar chart displays visible bars for negative spending values"
    - "Bar heights are proportional to absolute spending amounts"
    - "Bars still render correctly for positive values (no regression)"
  artifacts:
    - path: "apps/finance/finance/Views/Statistics/SpendingChartView.swift"
      provides: "Fixed bar height calculation"
      contains: "abs"
  key_links:
    - from: "barHeight function"
      to: "RoundedRectangle frame"
      via: "height calculation using absolute values"
      pattern: "abs.*total"
---

<objective>
Fix the SpendingChartView bar chart to render visible bars for negative spending values.

Purpose: The bar chart shows amount labels and month labels but no bars because the height calculation doesn't handle negative values correctly. Spending amounts are stored as negative numbers (expenses), causing bars to have zero or negative heights.

Output: Working bar chart that displays proportional bars for all spending values regardless of sign.
</objective>

<execution_context>
@/Users/seanyasno/.claude/get-shit-done/workflows/execute-plan.md
@/Users/seanyasno/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@apps/finance/finance/Views/Statistics/SpendingChartView.swift
</context>

<root_cause>
The `SpendingChartView.swift` has three issues in its bar height calculation:

1. **`maxTotal` calculation (line 7-9):** Uses raw values, so `max` of negative numbers returns the least negative (closest to zero), or 0 if any month has zero spending.
   ```swift
   private var maxTotal: Double {
       months.map { $0.total }.max() ?? 1  // max of [-11781, -5124, ...] = 0
   }
   ```

2. **Guard in `barHeight` (line 82):** Returns 0 when `maxTotal <= 0`, which is always true for negative spending.
   ```swift
   guard maxTotal > 0 else { return 0 }
   ```

3. **Minimum height check (line 84):** Checks `month.total > 0` which is false for expenses.
   ```swift
   return max(CGFloat(proportion) * 120, month.total > 0 ? 4 : 0)
   ```
</root_cause>

<tasks>

<task type="auto">
  <name>Task 1: Fix bar height calculation to use absolute values</name>
  <files>apps/finance/finance/Views/Statistics/SpendingChartView.swift</files>
  <action>
Update the SpendingChartView to handle negative spending values by using absolute values for height calculations:

1. Change `maxTotal` computed property to use absolute values:
   ```swift
   private var maxTotal: Double {
       months.map { abs($0.total) }.max() ?? 1
   }
   ```

2. Update `barHeight(for:)` function to use absolute values:
   ```swift
   private func barHeight(for month: MonthlySpending) -> CGFloat {
       guard maxTotal > 0 else { return 0 }
       let proportion = abs(month.total) / maxTotal
       return max(CGFloat(proportion) * 120, abs(month.total) > 0 ? 4 : 0)
   }
   ```

3. Optionally update `formatAmount(_:)` to handle negative values consistently (show absolute value since this is a spending chart and negative is implied):
   ```swift
   private func formatAmount(_ amount: Double) -> String {
       let absAmount = abs(amount)
       if absAmount >= 1000 {
           return String(format: "%.1fK", absAmount / 1000)
       }
       return String(format: "%.0f", absAmount)
   }
   ```

This ensures:
- `maxTotal` finds the largest spending amount by magnitude
- `barHeight` calculates proportions correctly regardless of sign
- Bars render with minimum height of 4 for any non-zero spending
- Amount labels show clean positive numbers (sign is redundant for "spending")
  </action>
  <verify>
Build the iOS app with Xcode:
```bash
cd apps/finance && xcodebuild -scheme finance -destination 'platform=iOS Simulator,name=iPhone 16' build 2>&1 | head -50
```
App should compile without errors.
  </verify>
  <done>
- SpendingChartView uses `abs()` for maxTotal calculation
- SpendingChartView uses `abs()` in barHeight proportion calculation
- Bars render proportionally for negative spending values
- No SwiftUI compilation errors
  </done>
</task>

</tasks>

<verification>
1. Build succeeds: `xcodebuild -scheme finance build`
2. Visual verification: Run app in simulator, navigate to Statistics tab, confirm bars are visible and proportional to spending amounts
</verification>

<success_criteria>
- Bar chart displays visible bars for all months with non-zero spending
- Bar heights are proportional to absolute spending amounts
- Amount labels display clean numbers (no negative signs in spending context)
- App builds and runs without errors
</success_criteria>

<output>
After completion, create `.planning/quick/008-fix-bar-chart-not-rendering-bars-for-neg/008-SUMMARY.md`
</output>
