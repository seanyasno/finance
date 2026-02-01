# Architecture Research: Transaction List UI Enhancements

**Domain:** iOS SwiftUI Transaction List with Search, Grouping, and Formatting
**Researched:** 2026-02-01
**Confidence:** HIGH

## Executive Summary

This research addresses how to architect search, grouping, and UI enhancements for an existing SwiftUI transaction list app. The existing architecture uses ObservableObject services with @Published properties, following a simplified MV (Model-View) pattern common in SwiftUI apps. The recommended architecture extends this pattern with computed properties for filtering/grouping and enum-based view state management, avoiding unnecessary complexity while maintaining testability and performance.

Key finding: SwiftUI's declarative nature makes traditional MVVM overkill for this use case. Instead, use computed properties in the view for search filtering, enum-based state for grouping modes, and extend the existing TransactionService minimally.

## Current Architecture Analysis

### Existing Components

```
┌─────────────────────────────────────────────────────────────┐
│                       View Layer                             │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │Transaction  │  │Transaction  │  │Transaction  │         │
│  │ListView     │  │RowView      │  │FilterView   │         │
│  └──────┬──────┘  └─────────────┘  └──────┬──────┘         │
│         │                                  │                │
├─────────┴──────────────────────────────────┴────────────────┤
│                    Service Layer                             │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────┐   │
│  │  TransactionService (ObservableObject)                │   │
│  │  - @Published transactions: [Transaction]            │   │
│  │  - @Published isLoading: Bool                        │   │
│  │  - @Published error: String?                         │   │
│  │  - fetchTransactions(dates, cardId)                  │   │
│  └────────────────────┬─────────────────────────────────┘   │
│                       │                                      │
├───────────────────────┴──────────────────────────────────────┤
│                     API Layer                                │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────┐   │
│  │  TransactionsAPI (OpenAPI Generated)                 │   │
│  │  - getTransactions(cardId, startDate, endDate)       │   │
│  └──────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│                     Model Layer                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Transaction (OpenAPI DTO + Extensions)              │   │
│  │  - formattedAmount, formattedDate, merchantName      │   │
│  │  - date (computed Date from timestamp)               │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Current Data Flow

```
User Action (refresh/filter)
    ↓
TransactionListView @State properties (startDate, endDate, selectedCardId)
    ↓
TransactionService.fetchTransactions(params)
    ↓
TransactionsAPI (OpenAPI client)
    ↓
Backend API
    ↓
Response → TransactionService.transactions (@Published)
    ↓
View auto-updates (SwiftUI observation)
```

### Existing Patterns

1. **Service Pattern**: Single TransactionService manages data fetching and state
2. **OpenAPI Integration**: Generated models with custom extensions for display properties
3. **Async/await**: Modern concurrency with @MainActor service
4. **View State**: Local @State in views for filter parameters
5. **Pull-to-refresh**: Native .refreshable modifier

## Recommended Architecture for Enhancements

### System Overview with Enhancements

```
┌─────────────────────────────────────────────────────────────┐
│                    Enhanced View Layer                       │
├─────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────┐  │
│  │  TransactionListView                                  │  │
│  │  - @State searchText: String                          │  │
│  │  - @State groupingMode: GroupingMode (enum)           │  │
│  │  - @State sortOrder: SortOrder (enum)                 │  │
│  │                                                        │  │
│  │  Computed Properties (filtering/grouping):            │  │
│  │  - var filteredTransactions: [Transaction]           │  │
│  │  - var groupedTransactions: [TransactionGroup]       │  │
│  │                                                        │  │
│  │  Body: List with .searchable() modifier              │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  TransactionRowView (enhanced)                        │  │
│  │  - Shows pending indicator badge                      │  │
│  │  - Formatted date/card display                        │  │
│  └───────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│              Service Layer (minimal changes)                 │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  TransactionService                                   │  │
│  │  - Same as before, no major changes needed            │  │
│  └───────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│              New Supporting Types                            │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  GroupingMode: enum (date, card, category, none)     │  │
│  │  SortOrder: enum (dateDesc, dateAsc, amountDesc)     │  │
│  │  TransactionGroup: struct (for section headers)      │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Implementation Strategy |
|-----------|----------------|------------------------|
| TransactionListView | Search state, grouping mode, computed filtering/grouping | Add @State properties and computed vars, use .searchable() modifier |
| filteredTransactions | Filter by search text | Computed property: `transactions.filter { search logic }` |
| groupedTransactions | Group by selected mode | Computed property: `Dictionary(grouping:by:)` based on enum |
| TransactionRowView | Display formatting, pending badge | Add conditional badge modifier, enhance date/card display |
| TransactionGroup | Section header data | New struct: `(key: String, transactions: [Transaction])` |
| GroupingMode | View state for grouping | New enum: `.byDate, .byCard, .byCategory, .none` |
| TransactionService | No changes needed | Existing service remains unchanged |

## Recommended Project Structure

```
apps/finance/finance/
├── Views/
│   └── Transactions/
│       ├── TransactionListView.swift          # Enhanced with search/grouping
│       ├── TransactionRowView.swift           # Enhanced with pending badge
│       ├── TransactionFilterView.swift        # Existing (no changes)
│       ├── TransactionDetailView.swift        # Existing (no changes)
│       └── TransactionGroupHeader.swift       # NEW: Section header component
│
├── Models/                                     # NEW directory
│   └── TransactionViewState.swift             # NEW: GroupingMode, SortOrder enums
│                                              #      TransactionGroup struct
│
├── Services/
│   └── TransactionService.swift               # Existing (minimal/no changes)
│
├── Generated/
│   ├── CustomModels.swift                     # Existing
│   └── ModelExtensions.swift                  # Potentially add isPending computed property
│
└── Extensions/                                # NEW directory (optional)
    └── Transaction+Grouping.swift             # Helper methods for grouping logic
```

### Structure Rationale

- **Models/ directory**: New directory for view state types (enums, grouping structs) that aren't API models
- **Keep service unchanged**: TransactionService works as-is; no need to add search/grouping logic there
- **View-level computed properties**: SwiftUI best practice for derived state; keeps service simple
- **Optional Extensions/**: For complex grouping logic that might clutter the view

## Architectural Patterns

### Pattern 1: Computed Property Filtering (Primary Pattern)

**What:** Use computed properties in the view to derive filtered/grouped state from service data

**When to use:** For client-side operations (search, grouping, sorting) on already-fetched data

**Trade-offs:**
- PRO: Simple, SwiftUI-idiomatic, no service changes
- PRO: Automatic updates when source data or search text changes
- PRO: No additional state management complexity
- CON: Recomputes on every view update (acceptable for <1000 items)
- CON: Not suitable for complex multi-step calculations

**Example:**
```swift
struct TransactionListView: View {
    @StateObject private var transactionService = TransactionService()
    @State private var searchText = ""
    @State private var groupingMode: GroupingMode = .byDate

    // Computed property: filters based on searchText
    private var filteredTransactions: [Transaction] {
        guard !searchText.isEmpty else {
            return transactionService.transactions
        }

        return transactionService.transactions.filter { transaction in
            transaction.merchantName.localizedCaseInsensitiveContains(searchText) ||
            transaction.categoryName.localizedCaseInsensitiveContains(searchText)
        }
    }

    // Computed property: groups filtered results
    private var groupedTransactions: [TransactionGroup] {
        switch groupingMode {
        case .byDate:
            return groupByDate(filteredTransactions)
        case .byCard:
            return groupByCard(filteredTransactions)
        case .byCategory:
            return groupByCategory(filteredTransactions)
        case .none:
            return [TransactionGroup(key: "All", transactions: filteredTransactions)]
        }
    }

    var body: some View {
        List {
            ForEach(groupedTransactions) { group in
                Section(header: TransactionGroupHeader(group: group)) {
                    ForEach(group.transactions) { transaction in
                        TransactionRowView(transaction: transaction)
                    }
                }
            }
        }
        .searchable(text: $searchText, prompt: "Search transactions")
    }
}
```

### Pattern 2: Enum-Based View State (Primary Pattern)

**What:** Use enums with associated values to represent mutually exclusive view states

**When to use:** For mode switching (grouping modes, sort orders, view layouts)

**Trade-offs:**
- PRO: Compiler-enforced exhaustive handling
- PRO: Clear, single source of truth for mode
- PRO: Easy to add new modes without Boolean flag explosion
- CON: Requires switch statements (but that's a feature, not a bug)

**Example:**
```swift
enum GroupingMode: String, CaseIterable, Identifiable {
    case byDate = "By Date"
    case byCard = "By Card"
    case byCategory = "By Category"
    case none = "No Grouping"

    var id: String { rawValue }

    var systemImage: String {
        switch self {
        case .byDate: return "calendar"
        case .byCard: return "creditcard"
        case .byCategory: return "tag"
        case .none: return "list.bullet"
        }
    }
}

// In view:
@State private var groupingMode: GroupingMode = .byDate

// Picker in toolbar or sheet:
Picker("Group By", selection: $groupingMode) {
    ForEach(GroupingMode.allCases) { mode in
        Label(mode.rawValue, systemImage: mode.systemImage)
            .tag(mode)
    }
}
.pickerStyle(.menu)
```

### Pattern 3: SwiftUI .searchable() Modifier (Native Pattern)

**What:** Use SwiftUI's native searchable modifier instead of custom search UI

**When to use:** Always, for iOS 15+ apps with search functionality

**Trade-offs:**
- PRO: Native iOS search UI/UX automatically
- PRO: Handles keyboard, focus, cancellation for free
- PRO: Integrates with navigation bar placement
- CON: Less customization than building custom search field

**Example:**
```swift
List { /* content */ }
    .searchable(
        text: $searchText,
        placement: .navigationBarDrawer(displayMode: .always),
        prompt: "Search by merchant or category"
    )
    .autocorrectionDisabled() // Common for transaction searches
```

### Pattern 4: Dictionary Grouping for Sections (Standard Library)

**What:** Use `Dictionary(grouping:by:)` to group arrays by a key function

**When to use:** Creating sectioned lists from flat arrays

**Trade-offs:**
- PRO: Standard library, performant, idiomatic Swift
- PRO: Clean one-liner for grouping logic
- CON: Dictionary is unordered; need to sort keys afterward

**Example:**
```swift
// Group transactions by date (day level)
private func groupByDate(_ transactions: [Transaction]) -> [TransactionGroup] {
    let calendar = Calendar.current

    let grouped = Dictionary(grouping: transactions) { transaction in
        calendar.startOfDay(for: transaction.date)
    }

    return grouped
        .sorted { $0.key > $1.key } // Most recent first
        .map { date, transactions in
            TransactionGroup(
                key: formatDateHeader(date),
                date: date,
                transactions: transactions.sorted { $0.date > $1.date }
            )
        }
}

// Supporting types:
struct TransactionGroup: Identifiable {
    let key: String
    let date: Date?
    let transactions: [Transaction]

    var id: String { key }
}
```

### Pattern 5: Model Extension for Display Properties (Existing Pattern)

**What:** Extend OpenAPI-generated models with computed display properties

**When to use:** For presentation logic that belongs to the model (formatting, derived state)

**Trade-offs:**
- PRO: Keeps views clean
- PRO: Reusable across views
- PRO: Co-located with model definition
- CON: Can't access view context (colors, fonts)

**Example:**
```swift
// In ModelExtensions.swift
extension Transaction {
    var isPending: Bool {
        status == .pending
    }

    var displayDate: String {
        let formatter = DateFormatter()
        formatter.dateStyle = .medium
        formatter.timeStyle = .none
        return formatter.string(from: date)
    }

    var shortCardNumber: String {
        guard let card = creditCard else { return "" }
        return "****\(card.cardNumber.suffix(4))"
    }
}
```

## Data Flow

### Search and Filter Flow

```
1. User types in search field (.searchable modifier)
       ↓
2. SwiftUI updates @State searchText binding
       ↓
3. View invalidates (searchText changed)
       ↓
4. Computed property filteredTransactions re-executes
       ↓
5. Filter logic: transactions.filter { merchant/category contains searchText }
       ↓
6. Computed property groupedTransactions re-executes (depends on filtered)
       ↓
7. Grouping logic: Dictionary(grouping:by:) based on groupingMode
       ↓
8. List re-renders with new sections/rows
```

### Grouping Mode Switch Flow

```
1. User selects new grouping mode from Picker
       ↓
2. SwiftUI updates @State groupingMode binding
       ↓
3. View invalidates (groupingMode changed)
       ↓
4. Computed property groupedTransactions re-executes
       ↓
5. Switch on groupingMode enum
       ↓
6. Execute corresponding grouping function (groupByDate, groupByCard, etc.)
       ↓
7. Return new [TransactionGroup] array
       ↓
8. List re-renders with new section structure
```

### Performance Characteristics

| Operation | Complexity | Performance Notes |
|-----------|-----------|-------------------|
| Search filter | O(n) | Fast for <5000 items; String.contains is optimized |
| Dictionary grouping | O(n) | Single pass through array |
| Sort grouped keys | O(k log k) | k = number of groups (typically 10-30 for dates) |
| View re-render | O(visible rows) | SwiftUI List is lazy; only renders visible cells |

## Integration Points with Existing Architecture

### 1. TransactionService (NO CHANGES)

**Current:** Fetches transactions, stores in @Published array
**Integration:** Service remains unchanged; filtering/grouping happens in view layer

**Rationale:** Backend already supports filtering by date/card. Client-side search/grouping is for already-fetched data.

### 2. TransactionListView (MODIFY)

**Current:** Uses @StateObject service, displays flat list, has filter parameters
**Integration:**
- Add @State searchText, groupingMode
- Add computed filteredTransactions, groupedTransactions
- Change List to use ForEach(groupedTransactions) with Sections
- Add .searchable() modifier
- Add toolbar item for grouping mode picker

**Backward compatibility:** Existing filter sheet (date range, card filter) continues to work as-is

### 3. TransactionRowView (ENHANCE)

**Current:** Displays merchant, amount, date, card number
**Integration:**
- Add conditional .badge() modifier for pending status
- Enhance date formatting (reuse Transaction.displayDate)
- Enhance card formatting (reuse Transaction.shortCardNumber)

**Rationale:** Badge modifier available iOS 15+, native SwiftUI feature

### 4. ModelExtensions.swift (EXTEND)

**Current:** Provides formattedAmount, formattedDate, merchantName, date
**Integration:**
- Add isPending computed property
- Add displayDate (without time, for headers)
- Add shortCardNumber (already exists implicitly)

**Rationale:** Keeps display logic with model, reusable

### 5. New Files to Create

| File | Purpose | Integration |
|------|---------|-------------|
| Models/TransactionViewState.swift | GroupingMode, SortOrder enums, TransactionGroup struct | Used by TransactionListView |
| Views/Transactions/TransactionGroupHeader.swift | Section header component | Used in ForEach sections |
| Extensions/Transaction+Grouping.swift (optional) | Grouping helper methods | Keeps view cleaner |

## State Management Strategy

### View State vs Service State

**Service State (@Published in TransactionService):**
- transactions: [Transaction] - Source of truth from API
- isLoading: Bool - Network request state
- error: String? - Error handling

**View State (@State in TransactionListView):**
- searchText: String - User input for search
- groupingMode: GroupingMode - User preference for grouping
- sortOrder: SortOrder - User preference for sorting (if added)
- startDate, endDate, selectedCardId - API filter parameters (existing)

**Computed State (var in TransactionListView):**
- filteredTransactions - Derived from transactions + searchText
- groupedTransactions - Derived from filteredTransactions + groupingMode

### Why This Split?

1. **Service state** = Data from backend, shared across views
2. **View state** = UI preferences, local to this view
3. **Computed state** = Derived transformations, no storage

This follows SwiftUI best practices: single source of truth (service.transactions), derived state in views.

### Performance Considerations

**Computed properties recalculate on every view update.** For transaction lists:

| Transaction Count | Computed Filter + Group | Acceptable? |
|------------------|-------------------------|-------------|
| <100 | <1ms | Yes - instant |
| 100-500 | 1-5ms | Yes - imperceptible |
| 500-1000 | 5-15ms | Yes - still smooth |
| 1000-5000 | 15-50ms | Marginal - may need optimization |
| 5000+ | 50ms+ | No - need memoization or @Observable migration |

**Optimization strategies if needed:**
1. Use @Observable macro instead of ObservableObject (SwiftUI only tracks accessed properties)
2. Memoize grouping results with @State + useEffect pattern
3. Debounce search text (don't filter on every keystroke)
4. Implement pagination (backend returns 50-100 at a time)

**For this project:** Likely <500 transactions per fetch, so computed properties are fine.

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| <500 transactions | Current approach (computed properties) works perfectly |
| 500-2000 transactions | Monitor performance; consider @Observable migration for precise invalidation |
| 2000-5000 transactions | Add pagination (fetch by month), debounce search, memoize grouping |
| 5000+ transactions | Backend search/grouping endpoints, infinite scroll, virtualized rendering |

### Scaling Priorities

1. **First bottleneck:** Computed property recalculation on large arrays
   - **Fix:** Migrate to @Observable macro (tracks accessed properties only)
   - **Fix:** Debounce searchText (only filter after 300ms pause)

2. **Second bottleneck:** List rendering with many sections
   - **Fix:** Collapse sections by default (iOS 17+ supports collapsible sections)
   - **Fix:** Lazy loading with pagination

3. **Third bottleneck:** Memory usage with large transaction arrays
   - **Fix:** Backend pagination (fetch current month + previous month only)
   - **Fix:** Clear old transactions when navigating away

## Anti-Patterns

### Anti-Pattern 1: Search Logic in Service

**What people do:** Add searchTransactions(query) method to TransactionService that filters server-side
**Why it's wrong:**
- Adds unnecessary API calls for client-side filtering
- Backend already returns all transactions for date range; re-filtering is wasteful
- Adds network latency to user typing

**Do this instead:** Use computed properties in view to filter in-memory data

### Anti-Pattern 2: Multiple @State Booleans for Grouping

**What people do:**
```swift
@State private var groupByDate = true
@State private var groupByCard = false
@State private var groupByCategory = false
```

**Why it's wrong:**
- Allows invalid states (multiple trues, all false)
- Verbose toggle logic
- Hard to add new grouping modes

**Do this instead:** Use enum with single @State
```swift
@State private var groupingMode: GroupingMode = .byDate
```

### Anti-Pattern 3: Custom Search TextField Instead of .searchable()

**What people do:** Build TextField with magnifying glass icon, clear button, etc.

**Why it's wrong:**
- Reinventing the wheel
- Won't match native iOS search behavior/placement
- Miss out on native keyboard shortcuts, focus management

**Do this instead:** Use .searchable() modifier (iOS 15+)

### Anti-Pattern 4: Premature ViewModel Introduction

**What people do:** Create TransactionListViewModel: ObservableObject with @Published filtered/grouped arrays

**Why it's wrong:**
- Adds unnecessary layer for simple transformations
- SwiftUI already has ViewModel built-in (the View itself)
- Harder to test (need to mock service AND viewmodel)
- Computed properties achieve same result with less code

**Do this instead:** Computed properties in view, only introduce ViewModel if logic becomes very complex (>100 lines)

### Anti-Pattern 5: Over-reliance on id() Modifier

**What people do:** Use `.id(UUID())` to force List re-renders when grouping changes

**Why it's wrong:**
- Loses scroll position
- Destroys and recreates all row views (expensive)
- Disables List lazy loading

**Do this instead:** Use proper Identifiable conformance and let SwiftUI diff intelligently

### Anti-Pattern 6: Grouping in ForEach Instead of Pre-Grouping

**What people do:**
```swift
ForEach(transactions) { transaction in
    if shouldShowDateHeader(transaction) {
        Text(dateHeader)
    }
    TransactionRowView(transaction)
}
```

**Why it's wrong:**
- Doesn't create proper sections (no sticky headers)
- Conditional logic in ForEach causes view identity issues
- Can't collapse sections

**Do this instead:** Pre-group with Dictionary(grouping:), use Section with ForEach

## Build Order Recommendation

Based on dependencies and existing architecture:

### Phase 1: Search Functionality (Simplest, standalone)
1. Add @State searchText to TransactionListView
2. Add .searchable() modifier to List
3. Add filteredTransactions computed property
4. Update List to use filteredTransactions instead of service.transactions
5. Test: Search by merchant name

**Why first:** No dependencies on new types, minimal changes, immediate user value

### Phase 2: Basic Grouping (Moderate, builds on search)
1. Create Models/TransactionViewState.swift with GroupingMode enum
2. Create TransactionGroup struct
3. Add @State groupingMode to TransactionListView
4. Implement groupByDate() helper function
5. Add groupedTransactions computed property
6. Update List to use ForEach(groupedTransactions) with Sections
7. Add basic section headers (Text)

**Why second:** Establishes core grouping infrastructure, simple date grouping is most valuable

### Phase 3: Multiple Grouping Modes (Moderate, extends Phase 2)
1. Add groupByCard() function
2. Add groupByCategory() function
3. Add groupingMode picker to toolbar/sheet
4. Implement switch logic in groupedTransactions
5. Create TransactionGroupHeader view for rich section headers

**Why third:** Builds on Phase 2 infrastructure, adds user choice

### Phase 4: Enhanced Row Display (Simple, visual polish)
1. Add Transaction.isPending to ModelExtensions
2. Update TransactionRowView with conditional .badge() for pending
3. Improve date formatting (use displayDate)
4. Improve card formatting (use shortCardNumber)

**Why fourth:** Pure visual enhancement, no state management changes

### Phase 5: Performance Optimization (If needed)
1. Profile with Instruments if >500 transactions
2. Consider @Observable migration if needed
3. Add debouncing to search if typing lags
4. Add section collapse if too many groups

**Why fifth:** Only if performance issues observed; avoid premature optimization

## Testing Strategy

### Unit Testable Components

1. **Grouping functions:** Pure functions, easy to test
```swift
func testGroupByDate() {
    let transactions = [/* test data */]
    let groups = groupByDate(transactions)
    XCTAssertEqual(groups.count, 3)
    XCTAssertEqual(groups[0].key, "Today")
}
```

2. **Model extensions:** Computed properties
```swift
func testIsPending() {
    let transaction = Transaction(/* with .pending status */)
    XCTAssertTrue(transaction.isPending)
}
```

3. **Enum cases:** Exhaustive coverage
```swift
func testGroupingModeImages() {
    for mode in GroupingMode.allCases {
        XCTAssertFalse(mode.systemImage.isEmpty)
    }
}
```

### UI Testing Approach

1. **Search interaction:** Type in search field, verify filtered results
2. **Grouping picker:** Select mode, verify section headers change
3. **Pending badge:** Create pending transaction, verify badge appears

### What NOT to test

- SwiftUI rendering (trust the framework)
- Computed property performance (profile instead)
- Native .searchable() behavior (trust Apple)

## Migration from ObservableObject to @Observable (Future Consideration)

**Current:** TransactionService uses ObservableObject with @Published
**Future:** Swift 5.9+ @Observable macro for better performance

### Why Consider Migration?

The @Observable macro (Swift 5.9, iOS 17+) provides:
- More precise invalidation (only re-renders views accessing changed properties)
- Better performance with large arrays
- Cleaner syntax (no @Published needed)

### Migration Path

```swift
// Before (current):
@MainActor
class TransactionService: ObservableObject {
    @Published var transactions: [Transaction] = []
    @Published var isLoading = false
}

// After:
@MainActor
@Observable
class TransactionService {
    var transactions: [Transaction] = []
    var isLoading = false
}

// In view, change:
@StateObject private var service = TransactionService()
// To:
@State private var service = TransactionService()
```

**When to migrate:** If profiling shows performance issues with >1000 transactions

## Sources

### Architecture Patterns
- [SwiftUI Architecture — MV Pattern Approach](https://betterprogramming.pub/swiftui-architecture-a-complete-guide-to-mv-pattern-approach-5f411eaaaf9e)
- [App architecture basics in SwiftUI, Part 2: SwiftUI's natural pattern](https://www.cocoawithlove.com/blog/swiftui-natural-pattern.html)
- [Clean Architecture for SwiftUI](https://nalexn.github.io/clean-architecture-swiftui/)
- [Rethinking ViewModel in SwiftUI](https://juniperphoton.substack.com/p/rethinking-viewmodel-in-swiftui)

### Search Implementation
- [How to add a search bar to filter your data](https://www.hackingwithswift.com/quick-start/swiftui/how-to-add-a-search-bar-to-filter-your-data)
- [Mastering the Searchable and SearchScope Modifiers in SwiftUI](https://medium.com/@serhankhan/mastering-the-searchable-and-searchscope-modifiers-in-swiftui-2afb516088d1)
- [SwiftUI Search Enhancements in iOS and iPadOS 26](https://nilcoalescing.com/blog/SwiftUISearchEnhancementsIniOSAndiPadOS26/)

### Grouping and Sections
- [Implement Section Headers in a List in SwiftUI](https://www.kodeco.com/books/swiftui-cookbook/v1.0/chapters/6-implement-section-headers-in-a-list-in-swiftui)
- [How to add section header and footer to SwiftUI list](https://sarunw.com/posts/swiftui-list-section-header-footer/)
- [SwiftUI: 2 Ways to Group Items in a List](https://www.slingacademy.com/article/swiftui-ways-to-group-items-in-a-list/)

### State Management
- [Switching view states with enums](https://www.hackingwithswift.com/books/ios-swiftui/switching-view-states-with-enums)
- [Manage View State With Enums](https://betterprogramming.pub/manage-view-state-with-enums-9034e461c5fc)
- [Avoiding having to recompute values within SwiftUI views](https://www.swiftbysundell.com/articles/avoiding-swiftui-value-recomputation/)
- [iOS SwiftUI data flows — Performance Tuning Guide (Jan 7, 2026)](https://www.sachith.co.uk/ios-swiftui-data-flows-performance-tuning-guide-practical-guide-jan-7-2026/)

### Performance
- [@Observable Macro performance increase over ObservableObject](https://www.avanderlee.com/swiftui/observable-macro-performance-increase-observableobject/)
- [A Deep Dive Into Observation - A New Way to Boost SwiftUI Performance](https://fatbobman.com/en/posts/mastering-observation/)
- [List or LazyVStack - Choosing the Right Lazy Container in SwiftUI](https://fatbobman.com/en/posts/list-or-lazyvstack/)
- [Demystifying SwiftUI List Responsiveness - Best Practices for Large Datasets](https://fatbobman.com/en/posts/optimize_the_response_efficiency_of_list/)

### UI Components
- [How to add a badge to TabView items and List rows](https://www.hackingwithswift.com/quick-start/swiftui/how-to-add-a-badge-to-tabview-items-and-list-rows)
- [Displaying badges in SwiftUI](https://swiftwithmajid.com/2021/11/10/displaying-badges-in-swiftui/)

---
*Architecture research for: iOS SwiftUI Transaction List UI Enhancements*
*Researched: 2026-02-01*
