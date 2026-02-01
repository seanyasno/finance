---
phase: quick-007
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - apps/finance/finance/Views/Statistics/SpendingChartView.swift
autonomous: true

must_haves:
  truths:
    - "Bar chart displays visible bars for months with spending data"
    - "Bar heights are proportional to spending amounts"
    - "Bars grow upward from the bottom (taller bars = more spending)"
  artifacts:
    - path: "apps/finance/finance/Views/Statistics/SpendingChartView.swift"
      provides: "Fixed bar chart layout with proper bar visibility"
      contains: "GeometryReader|Spacer"
  key_links:
    - from: "SpendingChartView.swift"
      to: "MonthlySpending.total"
      via: "barHeight calculation"
      pattern: "barHeight.*month"
---

<objective>
Fix the Spending Trend bar chart in the Statistics page to display bars correctly.

Purpose: The bar chart shows spending data values in labels but bars are not rendering visibly despite having non-zero totals.

Output: Working bar chart where bars are visible and proportional to spending amounts.
</objective>

<execution_context>
@/Users/seanyasno/.claude/get-shit-done/workflows/execute-plan.md
@/Users/seanyasno/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@apps/finance/finance/Views/Statistics/SpendingChartView.swift
@apps/finance/finance/Views/Statistics/StatisticsView.swift
</context>

<root_cause>
The SpendingChartView layout has a structural issue:

```swift
HStack(alignment: .bottom, spacing: 12) {
    ForEach(months) { month in
        VStack {  // No explicit frame constraints
            Text(formatAmount(month.total))  // TOP
            RoundedRectangle(cornerRadius: 4)
                .frame(height: barHeight(for: month))  // MIDDLE - bar
            Text(shortMonthLabel(month))  // BOTTOM
        }
    }
}
.frame(height: 180)
```

Issues:
1. The VStack distributes space equally among children without explicit sizing
2. The bar is sandwiched between two Text views with no Spacer to push it down
3. With HStack alignment: .bottom, the inner VStack aligns but doesn't properly allocate bar space
4. The bar may render with 0 or minimal height due to layout compression

The barHeight function returns correct values (up to 120pt), but the layout doesn't give the bar room to render.
</root_cause>

<tasks>

<task type="auto">
  <name>Task 1: Fix SpendingChartView bar layout</name>
  <files>apps/finance/finance/Views/Statistics/SpendingChartView.swift</files>
  <action>
Restructure the bar chart layout in SpendingChartView.swift to ensure bars render correctly:

1. Use GeometryReader or explicit frame constraints to allocate space for bars
2. Add Spacer between amount label and bar so bars grow upward from a fixed bottom position
3. Ensure the bar container has explicit height allocation (e.g., 140pt for bars, leaving room for labels)

Recommended fix - replace the body's bar chart HStack section with:

```swift
HStack(alignment: .bottom, spacing: 12) {
    ForEach(months) { month in
        VStack(spacing: 4) {
            // Amount label at top
            Text(formatAmount(month.total))
                .font(.caption2)
                .foregroundColor(.secondary)
                .lineLimit(1)
                .minimumScaleFactor(0.5)

            // Spacer pushes bar to bottom
            Spacer(minLength: 0)

            // Bar grows upward from bottom
            RoundedRectangle(cornerRadius: 4)
                .fill(barColor(for: month))
                .frame(height: barHeight(for: month))
                .frame(maxWidth: .infinity)
                .onTapGesture {
                    withAnimation {
                        selectedMonth = selectedMonth?.id == month.id ? nil : month
                    }
                }

            // Month label at bottom
            Text(shortMonthLabel(month))
                .font(.caption)
                .foregroundColor(.primary)
        }
        .frame(maxWidth: .infinity)
    }
}
.frame(height: 180)
.padding(.horizontal)
```

Key changes:
- Add `Spacer(minLength: 0)` between amount label and bar
- Add `VStack(spacing: 4)` for consistent spacing
- Add `.frame(maxWidth: .infinity)` to each column VStack

This ensures bars render from the bottom up with proper space allocation.
  </action>
  <verify>
Build the iOS app and navigate to Statistics tab:
1. Bars should be visible for months with spending data
2. Bar heights should be proportional (higher spending = taller bar)
3. Amount labels should appear above bars
4. Month labels should appear below bars
5. Tapping a bar should show the category breakdown
  </verify>
  <done>
- Bar chart displays visible bars for all months with spending
- Bars are proportional to spending amounts (max height ~120pt for highest month)
- Layout is correct: amount label -> spacer -> bar -> month label
- Interactive tap-to-expand functionality preserved
  </done>
</task>

</tasks>

<verification>
1. Build and run iOS app: `xcodebuild` or use Xcode
2. Navigate to Statistics tab in the app
3. Verify bar chart shows visible bars for months with spending
4. Verify bar heights are proportional (month with most spending has tallest bar)
5. Verify tapping a bar shows category breakdown below
</verification>

<success_criteria>
- Bars render visibly in the Spending Trend chart
- Bar heights correspond to spending amounts
- Chart layout remains visually correct with labels positioned properly
- Existing functionality (tap to expand) still works
</success_criteria>

<output>
After completion, create `.planning/quick/007-fix-statistics-page-spending-trend-bar-c/007-SUMMARY.md`
</output>
