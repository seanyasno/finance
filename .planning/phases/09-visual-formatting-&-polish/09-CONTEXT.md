# Phase 9: Visual Formatting & Polish - Context

**Gathered:** 2026-02-02
**Status:** Ready for planning

<domain>
## Phase Boundary

Enhance transaction display with simplified card number formatting (last 4 digits only) and clear pending transaction indicators. These visual improvements apply across all views and all three grouping modes (date, card, month).

</domain>

<decisions>
## Implementation Decisions

### Card Number Formatting
- Format: "CardName 1234" (spaces only, no bullets or dashes)
- Last 4 digits displayed in monospace font for visual distinction
- Card name uses regular font
- Apply consistently everywhere cards appear: list items, detail view, filter selection UI, all views
- Implementation: Reusable SwiftUI View (CardLabel component)

### Pending Transaction Indicators
- Visual treatment: Icon only (no text badge)
- Icon selection: Claude's discretion (clock.fill, hourglass, or similar appropriate SF Symbol)
- Icon placement in list: Claude's discretion (amount, merchant, or trailing edge)
- Detail view treatment: Claude's discretion (same icon, status row, or banner)
- Consistency: Same treatment across all grouping modes (or Claude determines if mode-specific emphasis needed)

### Format Consistency Across Grouping Modes
- When grouped by card: Hide card name in transaction rows (section header is sufficient)
- Unknown card handling: Claude's discretion (show as-is, hide, or placeholder)
- Card formatting in section headers (when grouped by card): Claude's discretion

### Visual Hierarchy
- Pending visual de-emphasis: Claude's discretion (icon only, opacity, text color, or combination)
- Card prominence in mixed-card views: Claude's discretion (hierarchy relative to merchant)
- Amount prominence: Claude's discretion (balance with merchant name)
- Row spacing/density: Claude's discretion (adjust if needed for scannability)

### Claude's Discretion
- Specific SF Symbol for pending status
- Pending icon placement in list items
- Pending status treatment on detail screen
- Card formatting in section headers (grouped by card mode)
- Unknown card display approach
- Whether pending needs mode-specific emphasis
- Pending visual de-emphasis (beyond icon)
- Information hierarchy (card, merchant, amount prominence)
- Spacing and density adjustments

</decisions>

<specifics>
## Specific Ideas

- Card format should be clean and minimal: just the name and last 4 digits with space separator
- Monospace digits help them stand out as identifiers without being obtrusive
- Reusable CardLabel view ensures consistency and maintainability
- When grouped by card, redundant card names in rows create noise - section header is enough
- Icon-only pending indicator keeps the UI clean while still being clear

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 09-visual-formatting-&-polish*
*Context gathered: 2026-02-02*
