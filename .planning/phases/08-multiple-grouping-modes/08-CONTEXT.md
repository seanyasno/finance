# Phase 8: Multiple Grouping Modes - Context

**Gathered:** 2026-02-02
**Status:** Ready for planning

<domain>
## Phase Boundary

Provide users flexible ways to organize their transaction list by switching between three grouping modes: by date (Phase 7 default), by credit card, and by month. Switching should be immediate and the interface should follow native iOS patterns.

</domain>

<decisions>
## Implementation Decisions

### Mode selector UI
- Follow Apple native iOS style (standard HIG patterns)
- Claude's discretion on: placement (nav bar vs above list vs menu), control type (segmented control vs menu vs picker), icon/text label combination

### Grouping behaviors

**By Credit Card:**
- Within each card section: transactions sorted by date, newest first
- Card section ordering: Claude's discretion (alphabetical, by spending, or by recent activity)

**By Month:**
- Section header content: Claude's discretion (month/year only, with totals, or with transaction counts)
- Month ordering: Newest first (descending) — Feb 2026, Jan 2026, Dec 2025...
- Consistent with current date grouping pattern

**By Date:**
- Existing Phase 7 behavior (relative dates for Today/Yesterday, DD/MM/YY format for older)

### Mode persistence
- Selected mode persists across app launches
- Storage: Local only (UserDefaults), device-specific preference
- Storage key naming: Claude's discretion (follow existing conventions)
- Error handling: Claude's discretion (fall back to date mode on invalid data)

### Interaction with search/filters
- Search/filter behavior when switching modes: Claude's discretion
  - Options: keep active, clear on switch, or clear only conflicting filters
- Credit card filter availability in card grouping mode: Claude's discretion
  - Could be complementary (filter specific cards) or redundant
- Empty state messaging: Claude's discretion (generic vs mode-specific messages)

### Claude's Discretion
- UI control type and placement for mode selector
- Icon vs text vs combined labels
- Card section ordering logic
- Month section header information
- UserDefaults key naming convention
- Error handling for invalid stored preferences
- Search/filter persistence behavior when switching modes
- Filter UI visibility in different grouping modes
- Empty state message specificity

</decisions>

<specifics>
## Specific Ideas

- Follow iOS Human Interface Guidelines — use standard native patterns
- Maintain consistency with Phase 7 date grouping (newest first ordering)
- Preference should remember user's choice between app launches

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 08-multiple-grouping-modes*
*Context gathered: 2026-02-02*
