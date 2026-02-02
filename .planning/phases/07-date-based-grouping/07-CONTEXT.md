# Phase 7: Date-Based Grouping - Context

**Gathered:** 2026-02-02
**Status:** Ready for planning

<domain>
## Phase Boundary

Display transactions organized by date sections with temporal context. Users see transactions grouped under date headers (Today, Yesterday, or formatted dates). All dates throughout the app display consistently in DD/MM/YY format.

This phase focuses on HOW transactions are presented temporally, not on what data is shown (already established) or additional capabilities (future phases).

</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion

**All styling and behavior decisions deferred to Claude:**

- **Section header styling**: Sticky vs scrolling headers, visual weight, spacing, background treatment
- **Relative date thresholds**: Today/Yesterday logic (calendar day vs rolling hours), additional relative labels (This Week, day names), transition point to formatted dates, real-time updates
- **Date formatting details**: Separator character (slash/dash/dot), time display in list items, detail view date format, year format (2-digit vs 4-digit)
- **Empty sections handling**: Whether to show empty sections, no-results messaging, true empty vs filtered empty differentiation, consecutive empty section collapsing

**Guiding principles for Claude:**
- Follow native iOS conventions and SwiftUI patterns
- Prioritize clarity and familiar UX over novel approaches
- Consider performance implications (cached formatters from STATE.md notes)
- Maintain consistency with existing app patterns established in Phases 1-6

</decisions>

<specifics>
## Specific Ideas

**Date format requirement from roadmap:**
- DD/MM/YY format must be used consistently throughout the app
- Section headers use "Today", "Yesterday" for recent dates, then switch to formatted dates
- Transaction list items show dates in DD/MM/YY
- Transaction detail pages show dates in DD/MM/YY

**Performance note from STATE.md:**
- Must use cached date formatters to avoid scrolling performance issues (identified in v1.1 research)

**Architecture note from STATE.md:**
- Use native SwiftUI components (Dictionary(grouping:by:), Section in List)
- Extend existing MV pattern with computed properties and enum-based state

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 07-date-based-grouping*
*Context gathered: 2026-02-02*
