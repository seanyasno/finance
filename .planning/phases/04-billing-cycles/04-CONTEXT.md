# Phase 4: Billing Cycles - Context

**Gathered:** 2026-01-31
**Status:** Ready for planning

<domain>
## Phase Boundary

Configure billing periods for credit cards and view spending within those cycles. Users can set billing cycle start dates per card, view current cycle spending (both per-card and combined), and navigate between historical billing periods.

</domain>

<decisions>
## Implementation Decisions

### Billing Cycle Configuration
- Billing cycle start day configured in credit card settings (not separate screen)
- Number picker (1-31) for entering day of month
- Cards without configured cycle default to 1st of month
- Users can edit billing cycle start day anytime, with warning that historical cycle grouping will change

### Current Cycle View Design
- Both single-card and combined views available
- Combined view: each card in its own current cycle (Card A: Jan 15-Feb 14, Card B: Jan 20-Feb 19)
- Display includes:
  - Total spending for the cycle
  - Category breakdown within cycle
  - Transaction list for the cycle
  - Days remaining in cycle indicator

### Period Navigation Pattern
- Default period: current billing cycle (in-progress cycle)
- No limit on historical access (view any cycle as far back as data exists)

### Claude's Discretion
- How to switch between single-card and combined views (segmented control, tabs, or drill-down)
- Navigation method between periods (prev/next buttons, picker, or both)
- How to indicate current period in UI (badge, disabled forward button, or both)
- Exact layout and styling of cycle view components
- Warning message wording for billing cycle edits

</decisions>

<specifics>
## Specific Ideas

- Combined view should handle different billing cycles elegantly - Card A might be in its Jan 15-Feb 14 cycle while Card B is in its Jan 20-Feb 19 cycle
- Default to 1st of month makes onboarding smoother (users can refine later)
- Warning on edit prevents confusion when historical spending regroupings change

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 04-billing-cycles*
*Context gathered: 2026-01-31*
