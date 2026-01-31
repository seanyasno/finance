# Phase 5: Statistics & Analytics - Context

**Gathered:** 2026-01-31
**Status:** Ready for planning

<domain>
## Phase Boundary

Visualizing spending patterns and trends through charts, comparisons, and indicators. Users can analyze historical spending data across months and categories to understand their financial behavior. This builds on the billing cycle view (Phase 4) to add analytics and visualization.

New capabilities (like budgets, alerts, exports) belong in future phases.

</domain>

<decisions>
## Implementation Decisions

### Chart Visualization
- **Style**: Vertical bars (traditional) - bars grow upward from bottom, months labeled below
- **Interactivity**: Tapping a bar shows detailed category breakdown for that month
- **Empty months**: Show zero-height bars for months with no transactions - maintains continuity and shows the full 5-month timeline
- **Bar labels**: Display total amount (e.g., ₪2,450) above each bar

### Comparison Presentation
- **Format**: Show both percentage change and absolute amounts with up/down arrow indicators
- **Color coding**: Red for spending increase (bad), green for decrease (good)
- **Scope**: Both overall total comparison AND per-category comparisons - overall at top, category breakdown below
- **Missing data**: Show "No previous data" message when comparing to a month with no transactions
- **Change threshold**: No significance threshold - show all changes equally with same visual treatment

### Trend Indicators
- **Visualization**: Both arrows (up, down, stable) and color coding (red/green matching comparisons)
- **Time window**: Calculate trends from last 5 months (matching the bar chart period)
- **Scope**: Both overall trend and per-category trends - overall at top, per-category in breakdown
- **Calculation method**: Claude's discretion - choose the clearest method for showing trends (simple average vs linear regression)

### OpenAPI Type Generation Setup
- **Timing**: Dedicated plan separate from analytics implementation - clean foundation before new features
- **Migration scope**: Migrate ALL existing manual types (Transaction, CreditCard, Category, etc.) to generated ones
- **Generated code location**: `apps/finance/finance/Generated/` - separate folder within iOS app for generated code
- **Trigger mechanism**: npm script in API package (`npm run generate:swift`) - run manually after API changes

</decisions>

<specifics>
## Specific Ideas

- The 5-month chart period creates consistency - trends use same window as visual display
- Red/green color scheme provides clear value judgment on spending changes (spending up = concerning, spending down = good)
- Tapping bars for breakdown follows iOS convention of progressive disclosure - overview first, details on demand
- OpenAPI generation as first plan ensures all subsequent analytics APIs get type-safe Swift models automatically

</specifics>

<deferred>
## Deferred Ideas

None - discussion stayed within phase scope

</deferred>

---

*Phase: 05-statistics-and-analytics*
*Context gathered: 2026-01-31*
