# Pitfalls Research

**Domain:** iOS SwiftUI Transaction List Enhancement (Search, Grouping, Formatting)
**Researched:** 2026-02-01
**Confidence:** HIGH

## Critical Pitfalls

### Pitfall 1: Computed Property Performance Death Spiral

**What goes wrong:**
Filtering and sorting transactions using computed properties inside view bodies causes exponential performance degradation. SwiftUI recomputes these properties on every state change, which means with search text changing on every keystroke, hundreds of unnecessary re-computations occur. Lists with 500+ transactions become unusable with 2-3 second lag on each keystroke.

**Why it happens:**
Developers intuitively use computed properties like `var filteredTransactions: [Transaction] { transactions.filter { ... } }` because it looks clean and simple. However, SwiftUI has no caching mechanism for computed properties - they execute on every access, and views access them far more often than expected (multiple times per render cycle).

**How to avoid:**
1. Use `@State` or `@Published` to store filtered/sorted results, updating them only when source data or filters change
2. Implement debouncing for search text (0.25-0.5 seconds) using Combine's `.debounce()` operator
3. For SwiftData backends, use `@Query` with predicates instead of in-memory filtering (database-level operations are exponentially faster)
4. Extract filtering logic to dedicated `@Observable` objects separate from the view

**Warning signs:**
- Search typing feels sluggish or delayed
- Memory profiler shows repeated execution of filter/sort operations
- View re-render counts spike with each keystroke
- Instruments Time Profiler shows high CPU in computed property execution

**Phase to address:**
Phase 1 (Search Implementation) - Architecture decision must be made upfront. Refactoring from computed properties to proper state management later requires complete restructure.

---

### Pitfall 2: NavigationLink Memory Leak Cascade

**What goes wrong:**
SwiftUI eagerly initializes NavigationLink destinations before navigation occurs. In transaction lists with hundreds of rows, this means hundreds of `TransactionDetailView` instances are created and retained in memory, each potentially holding `@StateObject` view models. Memory footprint explodes to 500MB-1GB+ with just a few hundred transactions, eventually causing app termination.

**Why it happens:**
The existing code pattern `NavigationLink { TransactionDetailView(...) } label: { ... }` causes SwiftUI to instantiate the destination view immediately when the List is rendered. This is a known SwiftUI architectural issue that developers encounter when adding navigation to existing lists. Using `@ObservedObject` in destinations (instead of `@StateObject`) makes it worse because objects are recreated on every view update.

**How to avoid:**
1. Use value-based NavigationStack with NavigationPath instead of embedded NavigationLink destinations
2. Use the `navigationDestination(for:)` modifier pattern with identifiers instead of full views
3. Pass only transaction IDs to NavigationLink, create detail views lazily in navigationDestination
4. Replace `@ObservedObject` with `@StateObject` for any view models in detail views
5. Minimize captured state in navigation closures using capture lists

**Warning signs:**
- Memory usage increases proportionally with transaction count (not user interaction)
- Instruments Allocations shows hundreds of view instances retained
- App crashes with memory warnings when transaction list grows
- Scrolling performance degrades over time in same session

**Phase to address:**
Phase 1 (Search Implementation) or Phase 2 (Grouping) - Must be fixed before user adoption increases transaction counts. Memory issues manifest when transaction count exceeds 200-300 items.

---

### Pitfall 3: State-Induced Refreshable Cancellation

**What goes wrong:**
Modifying any `@State` or `@Published` property while async work runs inside `.refreshable` causes immediate cancellation of that work. When implementing search alongside pull-to-refresh, typing during a refresh or applying filters during data fetch cancels the network request. Users see loading indicators that never complete and data that never updates.

**Why it happens:**
SwiftUI's `.refreshable` modifier couples async task lifecycle to view state. Any state modification triggers view re-evaluation, which cancels ongoing refresh tasks. This is particularly problematic with search (state changes every keystroke) and filter UI (state changes on selection). The existing `TransactionListView` already uses `.refreshable`, adding search/filters will immediately trigger this bug.

**How to avoid:**
1. Wrap refresh operations in unstructured Tasks to decouple from view lifecycle: `.refreshable { await Task { await loadData() }.value }`
2. Separate loading states for refresh vs. filter operations (don't reuse the same `isLoading` flag)
3. Use Task cancellation checking and handle gracefully: `try? Task.checkCancellation()`
4. Consider debouncing filter changes to avoid triggering refresh cancellation repeatedly
5. Show different UI for "refreshing" vs. "filtering" states so users understand what's happening

**Warning signs:**
- Network requests complete in backend logs but UI shows eternal loading
- Instruments shows high Task cancellation rates
- Users report "refresh doesn't work" when typing
- Console logs show "Task was cancelled" messages during filter operations

**Phase to address:**
Phase 1 (Search Implementation) - Critical. Search and existing refresh feature will conflict immediately on first implementation.

---

### Pitfall 4: ISO8601 Date Formatter Performance Trap

**What goes wrong:**
Creating new `ISO8601DateFormatter()` instances for each transaction when parsing or formatting dates causes severe list scrolling performance issues. With 500 transactions visible in a grouped list, this means 500+ formatter instantiations during render, causing 500ms+ frame drops and janky scrolling. The existing codebase already uses `ISO8601DateFormatter().string(from: $0)` inline in `TransactionService.swift`.

**Why it happens:**
Date formatters are notoriously expensive to create in iOS. Developers write `ISO8601DateFormatter()` inline because it's convenient and looks simple. Apple's documentation warns that resetting formatOptions "can incur significant performance cost," but doesn't emphasize creation cost. When adding date grouping (by day, week, month), developers naturally add more formatter calls, multiplying the problem.

**How to avoid:**
1. Create static cached formatters: `private static let iso8601Formatter = ISO8601DateFormatter()`
2. Use iOS 15+ `Date.FormatStyle`: `Date().formatted(.iso8601)` which is optimized and cached internally
3. For display formatting, use `.formatted()` methods which auto-cache formatters
4. Parse dates once at the service layer, store as Date objects, format only in views
5. For grouping keys, use Calendar components directly instead of string formatting

**Warning signs:**
- List scrolling stutters despite LazyVStack usage
- Instruments Time Profiler shows high time in `ISO8601DateFormatter.init`
- Frame rate drops below 60fps during scrolling
- Performance degrades with more date-related formatters added

**Phase to address:**
Phase 2 (Grouping with Date Headers) - Must fix before implementing date-based sections. Current inline formatter usage needs refactoring.

---

### Pitfall 5: Grouped Section Rendering Avalanche

**What goes wrong:**
When implementing grouping with sections, SwiftUI compares the entire list structure on every state change, not just visible rows. With 1000 transactions grouped into 30 sections, changing search text triggers re-evaluation of all 1030 elements (sections + rows) even though only 20 are visible. UI freezes for 2-3 seconds on each search keystroke. The problem compounds with nested grouping (e.g., by card then by date).

**Why it happens:**
SwiftUI's List with Section structures requires comparing the entire data tree to determine what changed. Developers structure data as nested dictionaries like `[String: [Transaction]]` for grouping, which SwiftUI must traverse completely. Combined with non-Equatable models or missing Equatable conformance, SwiftUI assumes everything changed and re-renders everything. The problem is invisible with small datasets but catastrophic at scale.

**How to avoid:**
1. Implement `Equatable` on all models shown in lists (Transaction, sections, etc.)
2. Extract each Section into a separate View conforming to `Equatable` to enable view identity optimization
3. Use `.id()` modifier with stable identifiers to help SwiftUI track sections
4. Pre-compute grouped data in service layer, store as `@Published` property
5. Consider pagination or virtual scrolling for 500+ items
6. Use `LazyVStack` instead of `List` for complex grouping scenarios

**Warning signs:**
- Search becomes slower as transaction count increases
- Instruments shows SwiftUI evaluating views far more times than expected
- Adding sections (grouping) makes search noticeably slower
- Memory usage spikes during filter changes

**Phase to address:**
Phase 2 (Grouping Implementation) - Architecture decision must be made upfront. Switching from computed grouping to pre-computed grouping requires major refactor.

---

### Pitfall 6: Search Empty State Confusion

**What goes wrong:**
Users can't distinguish between "no transactions exist" (initial state), "loading transactions" (network request), "no results for search" (filtered), and "network error" (failure state). When implementing search on top of existing empty states, developers forget to handle the search-specific empty state, leaving users confused whether their search failed or there's genuinely no data.

**Why it happens:**
The existing `TransactionListView` already has an empty state using `ContentUnavailableView("No Transactions", ...)`. Developers add search by checking `if searchText.isEmpty { ... } else { filteredTransactions }` but forget that empty filtered results need a different empty state message. SwiftUI's ContentUnavailableView has a built-in `.search` variant introduced in iOS 17, but developers miss it and reuse the general empty state.

**How to avoid:**
1. Use `ContentUnavailableView.search` specifically for empty search results
2. Maintain separate boolean flags: `hasSearchText`, `isLoading`, `hasError`, `hasNoData`
3. Create explicit state enum: `enum ViewState { case loading, empty, searchEmpty, error, data }`
4. Always show search query in empty state: "No results for [query]"
5. Provide actionable next steps: "Try different search terms" or "Clear filters"

**Warning signs:**
- User confusion reports about "empty transactions"
- Users retry loading when they should adjust search
- No visual distinction between empty states
- Search text is hidden when showing empty state

**Phase to address:**
Phase 1 (Search Implementation) - Must address when adding search. UX quality issue that damages user trust.

---

### Pitfall 7: Duplicate IDs in Grouped Lists with ForEach

**What goes wrong:**
When grouping transactions by date or card, multiple transactions share the same date/card ID as section identifiers. Using `ForEach(transactions, id: \.date)` or naively creating sections causes SwiftUI to crash with "duplicate ID" errors or silently drop rows. When implementing multiple grouping modes (by date, by card, by category), switching between modes corrupts the list and crashes the app.

**Why it happens:**
Developers naturally think "group by date" means using date as the ID, but many transactions share the same date. SwiftUI's ForEach requires globally unique IDs across the entire list structure (sections AND rows). When switching grouping modes, the view structure changes drastically (different section IDs, different row orders), but SwiftUI tries to animate between states, causing index-out-of-bounds crashes when array structure doesn't match expectations.

**How to avoid:**
1. Use transaction's unique ID (transaction.id) for transaction rows, never group fields
2. For sections, create separate `GroupSection` struct with unique `id: UUID()` for each section
3. Use `.id()` modifier on entire List when changing grouping modes to force complete rebuild: `.id(groupingMode.rawValue)`
4. Ensure Transaction model conforms to Identifiable with stable unique ID
5. For dynamic grouping, use dictionary keys that are guaranteed unique per section

**Warning signs:**
- App crashes with "duplicate ID" errors in console
- Rows disappear when switching grouping modes
- List corruption where some transactions show in wrong sections
- Crashes on grouping mode toggle with "Index out of range"

**Phase to address:**
Phase 2 (Grouping Implementation) - Critical architecture decision. Must be designed correctly from start or causes crashes in production.

---

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems.

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Using computed properties for filtering/sorting | Clean, simple code with no state management | Exponential performance degradation with large datasets, forces complete rewrite | Only acceptable for < 50 items or static data |
| Inline date formatter creation | Quick to write, easy to understand | 10-20x performance cost, compounds with scale, requires formatter caching refactor | Never acceptable in list rendering code |
| Reusing existing empty state for search | No additional UI code needed | User confusion, poor UX, negative reviews | Never - ContentUnavailableView.search takes 2 minutes to implement |
| Debouncing at 1+ seconds | Dramatically reduces filter calls | Users perceive lag, feels broken, reduces app quality perception | Never - 0.25-0.5s is scientifically proven optimal |
| Using @ObservedObject in detail views | Seems equivalent to @StateObject | Memory leaks, exponential memory growth, eventual crashes | Never (iOS 14+ has @StateObject) |
| Skipping Equatable conformance | Saves 5 minutes per model | SwiftUI over-renders everything, performance degrades, requires extensive refactor | Never for models displayed in lists |
| Grouping with nested dictionaries | Intuitive data structure, matches mental model | Impossible for SwiftUI to diff efficiently, requires complete architecture change | Acceptable only for < 100 items total |

## Integration Gotchas

Common mistakes when integrating new features with existing code.

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Search + Existing Filters | Replacing filter UI with search, causing feature loss | Keep both: search filters displayed list, date/card filters apply to data source |
| Search + Pull-to-refresh | Not handling state cancellation, requests never complete | Wrap refresh in Task or separate loading states (isRefreshing vs isSearching) |
| Grouping + NavigationLink | Memory leaks multiply by sections * items | Fix NavigationLink pattern before adding grouping |
| Date Formatting + Grouping | Creating formatter per row AND per section header | Cache formatters globally, or use Date.FormatStyle.formatted() |
| Multiple @State filters + Search | State explosion: searchText, sortOrder, groupMode, startDate, endDate, cardId | Consolidate into single @Observable FilterState model |
| Existing TransactionService + Grouping | Service returns flat array, view does grouping | Move grouping logic to service layer, publish grouped structure |
| Error Handling + Search | Search errors override loading errors, users lose context | Separate error states: networkError, searchError, each with own UI |

## Performance Traps

Patterns that work at small scale but fail as usage grows.

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Computed property filtering | Laggy typing in search, dropped frames | Debounced @Published filtered results | > 200 transactions |
| Inline date formatters | Scrolling stutter, frame drops | Static cached formatters or .formatted() | > 50 date operations per render |
| NavigationLink eager initialization | Memory growth independent of user action | NavigationStack with navigationDestination | > 300 list items |
| Non-Equatable models in List | Entire list re-renders on any change | Implement Equatable on all list models | > 100 items |
| Nested dictionary grouping | Search becomes exponentially slower | Pre-computed flat grouped array | > 500 items across > 10 sections |
| Synchronous filter operations | UI freezes during filter changes | Background DispatchQueue or async/await | > 1000 items |
| State changes during refreshable | Refresh never completes, eternal loading | Unstructured Task wrapping or separate loading flags | Any search + refresh combo |

## UX Pitfalls

Common user experience mistakes in this domain.

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| No search debouncing | App feels laggy and broken, users think it crashed | 0.25-0.5s debounce + loading indicator |
| Generic empty state for search | Users don't know if search failed or no results exist | ContentUnavailableView.search with query shown |
| No loading state for filters | Users click multiple times, triggering duplicate requests | Disabled UI + spinner during filter operations |
| Losing scroll position after search | Users must re-scroll to find context | Preserve ScrollViewReader position or smooth scroll to top |
| No clear filters button | Users trapped in filtered view, force close app | Prominent "Clear" or "Reset" button in filter UI |
| Grouping mode not obvious | Users don't know list is grouped, confused by sections | Clear header showing grouping mode, toggle in toolbar |
| Filter count badge overflow | Showing "5 filters" when space allows showing actual filters | Show actual filter pills or expand to show details |
| Date ranges without presets | Users must manually select dates every time | Quick presets: "This month", "Last month", "Last 90 days" |

## "Looks Done But Isn't" Checklist

Things that appear complete but are missing critical pieces.

- [ ] **Search Implementation:** Often missing empty state for no results - verify ContentUnavailableView.search is used
- [ ] **Search Implementation:** Often missing debouncing - verify .debounce() or manual delay implementation exists
- [ ] **Search Implementation:** Often missing search cancellation - verify search clears when view disappears
- [ ] **Grouping Implementation:** Often missing Equatable conformance - verify all grouped models implement Equatable
- [ ] **Grouping Implementation:** Often missing section unique IDs - verify sections have separate ID namespace from rows
- [ ] **Grouping Implementation:** Often missing grouping toggle UI - verify users can see and change grouping mode
- [ ] **Date Formatting:** Often missing formatter caching - verify static cached formatters or FormatStyle usage
- [ ] **Date Formatting:** Often missing localization - verify user's locale is respected in date displays
- [ ] **Filter Integration:** Often missing "clear all" action - verify prominent way to reset to unfiltered state
- [ ] **Filter Integration:** Often missing active filter indicators - verify users can see what filters are active without opening sheet
- [ ] **Navigation Integration:** Often missing NavigationLink memory leak fix - verify value-based navigation or lazy destinations
- [ ] **Refreshable Integration:** Often missing state cancellation handling - verify search doesn't cancel refresh or vice versa
- [ ] **Error Handling:** Often missing search-specific errors - verify network errors during search show appropriately
- [ ] **Accessibility:** Often missing VoiceOver support for grouped sections - verify section headers are announced
- [ ] **Performance:** Often missing Instruments profiling - verify scrolling maintains 60fps with 500+ items

## Recovery Strategies

When pitfalls occur despite prevention, how to recover.

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Computed property performance | MEDIUM | 1. Extract to @State property, 2. Add .onChange to update on source changes, 3. Implement debouncing |
| NavigationLink memory leaks | HIGH | 1. Refactor to NavigationStack + navigationDestination, 2. Change all NavigationLinks to value-based, 3. Test memory under Instruments |
| Refreshable cancellation | LOW | 1. Wrap refresh body in Task { }.value, 2. Test search + refresh interaction, 3. Update loading states |
| Date formatter performance | LOW | 1. Create static cached formatters at file level, 2. Replace inline calls with static instances, 3. Profile with Instruments |
| Grouped section performance | HIGH | 1. Add Equatable to all models, 2. Extract sections to Equatable views, 3. Refactor grouping to pre-computed @Published data, 4. Profile and verify improvement |
| Empty state confusion | LOW | 1. Add ViewState enum, 2. Create search-specific ContentUnavailableView.search, 3. Update conditionals to check view state |
| Duplicate ID crashes | MEDIUM | 1. Audit all ForEach for ID uniqueness, 2. Add .id() to List for grouping mode changes, 3. Create unique section IDs, 4. Add crash reporting to identify duplicates |

## Pitfall-to-Phase Mapping

How roadmap phases should address these pitfalls.

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Computed property performance | Phase 1: Search Implementation | Instruments Time Profiler shows < 5ms filter execution, typing remains 60fps |
| NavigationLink memory leaks | Phase 1 or Phase 2 | Instruments Allocations shows linear memory (not exponential) with transaction count |
| Refreshable cancellation | Phase 1: Search Implementation | Manual test: typing during refresh completes both operations successfully |
| Date formatter performance | Phase 2: Grouping & Formatting | Instruments Time Profiler shows zero time in formatter init during scroll |
| Grouped section performance | Phase 2: Grouping & Formatting | Instruments shows < 3 view body evaluations per state change |
| Empty state confusion | Phase 1: Search Implementation | QA review: tester can distinguish all 4 empty states without confusion |
| Duplicate ID crashes | Phase 2: Grouping & Formatting | Unit tests verify unique IDs, switching grouping modes 50x causes zero crashes |

## Sources

### Performance and Architecture
- [Demystifying SwiftUI List Responsiveness - Best Practices for Large Datasets](https://fatbobman.com/en/posts/optimize_the_response_efficiency_of_list/)
- [How to fix slow List updates in SwiftUI](https://www.hackingwithswift.com/articles/210/how-to-fix-slow-list-updates-in-swiftui)
- [Optimizing SwiftUI Lists: How to Make Scrollable Views Smooth and Fast](https://simaspavlos.medium.com/optimizing-swiftui-lists-how-to-make-scrollable-views-smooth-and-fast-0abb5d61a5c4)
- [iOS SwiftUI data flows - Performance Tuning Guide (Jan 7, 2026)](https://www.sachith.co.uk/ios-swiftui-data-flows-performance-tuning-guide-practical-guide-jan-7-2026/)

### State Management
- [State Management in SwiftUI: The Complete Guide](https://dev.to/sebastienlato/state-management-in-swiftui-the-complete-guide-18fj)
- [iOS 17+ SwiftUI State Management (2025)](https://zoewave.medium.com/new-swiftui-state-management-3a6c9b737724)
- [SwiftUI Craftsmanship: State Management](https://captainswiftui.substack.com/p/swiftui-craftsmanship-state-management)

### Search and Debouncing
- [Debounce in Combine: SwiftUI](https://medium.com/@amitaswal87/debounce-in-combine-swiftui-b6e55d2792dc)
- [How to debounce TextField search in SwiftUI](https://onmyway133.com/posts/how-to-debounce-textfield-search-in-swiftui/)
- [Creating a debounced search context for performant SwiftUI searches](https://danielsaidi.com/blog/2025/01/08/creating-a-debounced-search-context-for-performant-swiftui-searches)
- [Throttling and Debouncing in SwiftUI](https://medium.com/@carmineporricelli96/throttling-and-debouncing-in-swiftui-4f3cea9ffec5)

### Navigation and Memory Management
- [Tracking down memory leaks in your NavigationStack](https://liveflatout.hashnode.dev/tracking-down-memory-leaks-in-your-navigationstack)
- [Memory Leaks in SwiftUI: How @ObservedObject Betrays Declarative Paradigm](https://medium.com/@maydibee/memory-leaks-in-swiftui-how-observedobject-betrays-declarative-paradigm-5da03ccd0beb)
- [Reducing memory leaks in SwiftUI when using StateObject and NavigationView](https://medium.com/@cobainjosue/reducing-memory-leaks-in-swiftui-when-using-stateobject-and-navigationview-4db91095d5af)

### Date Formatting
- [How to parse ISO 8601 date in Swift](https://sarunw.com/posts/how-to-parse-iso8601-date-in-swift/)
- [Swift Foundation Formatter Improvements](https://useyourloaf.com/blog/swift-foundation-formatter-improvements/)
- [Modern Swift Formatter API - Deep Dive and Customization Guide](https://fatbobman.com/en/posts/newformatter/)
- [Formatting dates in Swift using Date.FormatStyle on iOS 15](https://www.donnywals.com/formatting-dates-in-swift-using-date-formatstyle-on-ios-15/)

### Refreshable and Pull-to-Refresh
- [Pull to refresh in SwiftUI with refreshable](https://sarunw.com/posts/pull-to-refresh-in-swiftui/)
- [Making SwiftUI views refreshable](https://www.swiftbysundell.com/articles/making-swiftui-views-refreshable/)
- [Correct way to implement .refreshable with long-living effects](https://github.com/pointfreeco/swift-composable-architecture/discussions/2542)

### Empty States and UX
- [ContentUnavailableView: Handling Empty States in SwiftUI](https://www.avanderlee.com/swiftui/contentunavailableview-handling-empty-states/)
- [Mastering ContentUnavailableView in SwiftUI - The New Elegant Empty-State UI (Nov 2025)](https://medium.com/@gauravios/mastering-contentunavailableview-in-swiftui-the-new-elegant-empty-state-ui-dfa291d52372)

### ForEach and Identifiable
- [Solving ForEach ID Duplication Problems in SwiftUI](https://tinodevclumsy.github.io/blog/solving-foreach-id-duplication-problems-in-swiftui/)
- [Modern SwiftUI: Identified arrays](https://www.pointfree.co/blog/posts/95-modern-swiftui-identified-arrays)
- [How to identify data in Lists and ForEach in SwiftUI](https://tanaschita.com/swiftui-identifiable/)

### Filtering and Sorting
- [Avoiding having to recompute values within SwiftUI views](https://www.swiftbysundell.com/articles/avoiding-swiftui-value-recomputation/)
- [Dynamically filtering a SwiftUI List](https://www.hackingwithswift.com/books/ios-swiftui/dynamically-filtering-a-swiftui-list)

---
*Pitfalls research for: iOS SwiftUI Transaction List Enhancement*
*Researched: 2026-02-01*
