# Phase 6: Search Functionality - Context

**Gathered:** 2026-02-01
**Status:** Ready for planning

<domain>
## Phase Boundary

Real-time search and filtering of transaction list by merchant name, amount, and notes content. This adds search capability to the existing transaction list view. Does NOT include advanced filters (category, date range), saved searches, or search history — those would be separate capabilities.

</domain>

<decisions>
## Implementation Decisions

### Search UI placement & style
- Use native SwiftUI `.searchable()` modifier — follows iOS patterns, appears in navigation bar, can be dismissed
- Search works alongside pull-to-refresh — both should function together, search persists during refresh
- Pull-to-refresh remains available when search is active

### Claude's Discretion (Search UI)
- Placeholder text (generic vs descriptive)
- Clear button implementation (follow iOS patterns with .searchable())

### Search behavior & performance
- Debounced real-time filtering — updates after short pause in typing (not every keystroke, not on submit)
- Server-side filtering via API — send search query to backend, get filtered results
- Search query managed separately from refresh state to avoid cancellation issues

### Claude's Discretion (Performance)
- Exact debounce delay (200-500ms range, balance responsiveness vs performance)
- Implementation pattern to handle search + refresh interaction without cancellation
- API endpoint design for search parameters

### Search scope & matching
- Match any field (OR logic) — show transaction if search text appears in merchant OR amount OR notes
- Case-insensitive matching — 'amazon' matches 'Amazon', 'AMAZON', 'amazon'
- Immediate restore when search cleared — clearing search instantly shows full transaction list

### Claude's Discretion (Matching)
- Amount search handling (exact vs partial, smart parsing)
- Partial word vs full word boundary matching
- Specific matching algorithm implementation

### Empty & loading states
- Immediate restore behavior when search cleared — full list appears instantly, no refresh needed

### Claude's Discretion (States)
- Empty search results message design (simple vs with query vs with hints)
- Visual distinction between "no transactions" vs "no search results"
- Loading indicator approach (spinner, inline, or none based on API timing)

</decisions>

<specifics>
## Specific Ideas

- Research notes mention debouncing is critical to avoid "computed property performance death spiral"
- Research indicates state-induced refreshable cancellation must be handled when combining search with pull-to-refresh
- iOS 15+ SwiftUI `.searchable()` is available and preferred for native search experience

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 06-search-functionality*
*Context gathered: 2026-02-01*
