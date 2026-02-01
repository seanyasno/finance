# Stack Research: Transaction List UI Enhancements

**Domain:** iOS SwiftUI transaction list enhancements
**Researched:** 2026-02-01
**Confidence:** HIGH

## Recommended Stack

### Core SwiftUI Components

| Component | iOS Version | Purpose | Why Recommended |
|-----------|-------------|---------|-----------------|
| `.searchable()` modifier | iOS 15+ | Search functionality | Native SwiftUI search with automatic UI handling, suggestions support, and scope filtering. No third-party dependencies needed. |
| `Dictionary(grouping:by:)` | Swift 5+ | Transaction grouping | Native Swift collection method for efficient grouping by date/card/month. Zero dependencies, type-safe. |
| `Section` in `List` | iOS 13+ | Grouped displays | Built-in SwiftUI component for creating grouped lists with headers. Supports sticky headers automatically. |
| `.refreshable()` modifier | iOS 15+ | Pull-to-refresh | Native async/await support for refresh actions. Automatic activity indicator and smooth animations. |
| `DateFormatter` (reused) | iOS 2+ | Date formatting | Standard date formatting with reuse pattern for performance. For DD/MM/YY format specifically. |
| `.badge()` modifier | iOS 15+ | Status indicators | Native badge support for lists and tabs. iOS 26 adds toolbar support for pending indicators. |

### Date Formatting Strategy

| Component | Version | Purpose | Implementation Details |
|-----------|---------|---------|----------------------|
| `Date.FormatStyle` | iOS 15+ | Primary date formatter | Modern, performant alternative to DateFormatter. Recommended for iOS 15+. Use `.formatted(.dateTime.day().month().year())` |
| `DateFormatter` (cached) | iOS 2+ | Fallback/custom formats | For custom DD/MM/YY format: `dateFormat = "dd/MM/yy"`. Create once, reuse via static property or view model. |
| Computed properties | Swift 5+ | Convenience accessors | Extend `Transaction` with `formattedShortDate` property that reuses cached formatter. |

### Supporting Patterns

| Pattern | Purpose | When to Use |
|---------|---------|-------------|
| `@State` for search text | Search state management | Store search query and selected scope |
| `computed var` for filtered data | Search filtering | Filter transactions based on search text (merchant, amount, notes) |
| `ForEach` with grouped dictionary | Section generation | Iterate over grouped transactions to create dynamic sections |
| `ZStack` with alignment | Custom badge overlays | For pending indicators that need custom positioning |
| `.headerProminence(.increased)` | Section header styling | Make section headers more prominent in grouped views |

## Installation

No external dependencies required. All features use native SwiftUI components available in iOS 15+.

```swift
// No package installations needed
// Project targets iOS 26.2, which includes all required APIs
```

## Implementation Patterns

### 1. Search Implementation

```swift
struct TransactionListView: View {
    @State private var searchText = ""
    @State private var searchScope: SearchScope = .all

    enum SearchScope: String, CaseIterable {
        case all = "All"
        case merchant = "Merchant"
        case amount = "Amount"
        case notes = "Notes"
    }

    var filteredTransactions: [Transaction] {
        guard !searchText.isEmpty else { return transactions }

        return transactions.filter { transaction in
            switch searchScope {
            case .all:
                return matchesSearch(transaction)
            case .merchant:
                return transaction.merchantName.localizedCaseInsensitiveContains(searchText)
            case .amount:
                return transaction.formattedAmount.contains(searchText)
            case .notes:
                return transaction.notes?.localizedCaseInsensitiveContains(searchText) ?? false
            }
        }
    }

    var body: some View {
        List(filteredTransactions) { transaction in
            TransactionRowView(transaction: transaction)
        }
        .searchable(text: $searchText, prompt: "Search transactions")
        .searchScopes($searchScope) {
            ForEach(SearchScope.allCases, id: \.self) { scope in
                Text(scope.rawValue)
            }
        }
    }
}
```

### 2. Grouping by Date/Card/Month

```swift
enum GroupingMode: String, CaseIterable {
    case date = "By Date"
    case card = "By Card"
    case month = "By Month"
}

// In view model or computed property
func groupedTransactions(by mode: GroupingMode) -> [(String, [Transaction])] {
    let grouped: [String: [Transaction]]

    switch mode {
    case .date:
        grouped = Dictionary(grouping: transactions) { transaction in
            transaction.date.formatted(.dateTime.day().month().year())
        }
    case .card:
        grouped = Dictionary(grouping: transactions) { transaction in
            transaction.creditCard?.displayName ?? "No Card"
        }
    case .month:
        grouped = Dictionary(grouping: transactions) { transaction in
            transaction.date.formatted(.dateTime.month(.wide).year())
        }
    }

    return grouped.sorted { $0.key > $1.key } // Descending order
}

// In view
var body: some View {
    List {
        ForEach(groupedTransactions(by: groupingMode), id: \.0) { key, transactions in
            Section(header: Text(key)) {
                ForEach(transactions) { transaction in
                    TransactionRowView(transaction: transaction)
                }
            }
            .headerProminence(.increased)
        }
    }
}
```

### 3. Date Formatting (DD/MM/YY)

```swift
// Extension on Transaction model
extension Transaction {
    private static let shortDateFormatter: DateFormatter = {
        let formatter = DateFormatter()
        formatter.dateFormat = "dd/MM/yy"
        return formatter
    }()

    var formattedShortDate: String {
        Self.shortDateFormatter.string(from: date)
    }
}

// Usage in view
Text(transaction.formattedShortDate)
```

### 4. Pending Transaction Indicator

```swift
struct TransactionRowView: View {
    let transaction: Transaction

    var body: some View {
        HStack {
            VStack(alignment: .leading, spacing: 4) {
                HStack(spacing: 6) {
                    Text(transaction.merchantName)
                        .font(.headline)
                    if transaction.status == .pending {
                        Text("Pending")
                            .font(.caption2)
                            .foregroundStyle(.secondary)
                            .padding(.horizontal, 6)
                            .padding(.vertical, 2)
                            .background(.orange.opacity(0.2))
                            .clipShape(Capsule())
                    }
                    if let category = transaction.category {
                        Image(systemName: category.displayIcon)
                            .foregroundColor(category.displayColor)
                            .font(.caption)
                    }
                }
                HStack(spacing: 8) {
                    if let card = transaction.creditCard {
                        Text("****\(card.cardNumber.suffix(4))")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                    Text(transaction.formattedShortDate)
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
            }
            Spacer()
            Text(transaction.formattedAmount)
                .font(.body)
                .fontWeight(.medium)
        }
        .padding(.vertical, 4)
    }
}
```

### 5. Pull-to-Refresh (Already Implemented)

```swift
// Already exists in TransactionListView.swift
List(transactions) { transaction in
    TransactionRowView(transaction: transaction)
}
.refreshable {
    await loadData()
}
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Native `.searchable()` | Third-party search libraries | Never - native is superior for iOS 15+ |
| `Date.FormatStyle` | Always create new `DateFormatter` | Never - massive performance hit |
| Native `.badge()` | Custom overlay views | Only if need highly custom badge designs |
| `Dictionary(grouping:)` | Manual loop-based grouping | Never - less performant and more code |
| `List` with `Section` | `LazyVStack` with custom headers | Only if need non-standard scroll behavior |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Third-party search libraries | Unnecessary dependency, native is excellent | Native `.searchable()` |
| Creating `DateFormatter` in loops | Extremely expensive (100x+ slower) | Reuse single static instance |
| `UIViewRepresentable` for search | Over-engineered, loses SwiftUI benefits | Native `.searchable()` |
| Manual section header positioning | Complex, brittle, unnecessary | `List` with `Section` (sticky headers automatic) |
| `@Published` arrays for search | Unnecessary state management overhead | `computed var` with filter |

## Stack Patterns by Feature

### If implementing search:
- Use `.searchable()` modifier on `List`
- Add `.searchScopes()` for merchant/amount/notes filtering
- Use computed property for filtering (no `@Published` needed)
- Include `ContentUnavailableView` for empty search results

### If implementing grouping:
- Use `Dictionary(grouping:by:)` for efficient grouping
- Return sorted array of tuples for consistent ordering
- Use `ForEach` with tuple's key for dynamic sections
- Apply `.headerProminence(.increased)` for better visibility

### If formatting dates:
- Create static `DateFormatter` instance in extension
- Format: `dateFormat = "dd/MM/yy"`
- Access via computed property on model
- Consider locale for international users

### If showing pending status:
- Use inline capsule badge with `.secondary` style
- Position after merchant name for visibility
- Use `.orange.opacity(0.2)` background for pending
- Keep text short: just "Pending"

## Performance Considerations

| Concern | At 100 transactions | At 1,000 transactions | At 10,000 transactions |
|---------|-------------------|---------------------|----------------------|
| Search filtering | Instant (computed var) | <50ms | May need debouncing |
| Date formatting | Instant (reused formatter) | Instant | Instant |
| Grouping | Instant (O(n)) | <100ms | May need pagination |
| List rendering | Native (lazy) | Native (lazy) | Native (lazy) |

**Optimization Notes:**
- `List` is already lazy - only renders visible rows
- Search filtering is O(n) - acceptable up to ~5,000 items
- Date formatter reuse critical (100x performance gain)
- Dictionary grouping is O(n) - very efficient
- Consider debouncing search for >1,000 transactions

## Version Compatibility

| Feature | Minimum iOS | Project Target | Notes |
|---------|------------|----------------|-------|
| `.searchable()` | iOS 15.0 | iOS 26.2 | ✅ Fully supported |
| `.searchScopes()` | iOS 16.0 | iOS 26.2 | ✅ Fully supported |
| `.refreshable()` | iOS 15.0 | iOS 26.2 | ✅ Already implemented |
| `.badge()` on List | iOS 15.0 | iOS 26.2 | ✅ Fully supported |
| `.badge()` on Toolbar | iOS 26.0 | iOS 26.2 | ✅ New feature available |
| `Date.FormatStyle` | iOS 15.0 | iOS 26.2 | ✅ Recommended approach |
| `.headerProminence()` | iOS 15.0 | iOS 26.2 | ✅ Fully supported |

**All recommended features are fully supported in iOS 26.2.**

## Migration Notes

### From Current Implementation

The existing codebase already has:
- ✅ Pull-to-refresh (`.refreshable()` modifier)
- ✅ List-based transaction display
- ✅ Card number display (last 4 digits)
- ✅ Basic date formatting
- ✅ Filter sheet modal

**Need to add:**
- Search functionality (`.searchable()` modifier)
- Grouping mode picker (enum + computed property)
- DD/MM/YY date format (update `formattedDate` extension)
- Pending status indicator (conditional view in row)

**Can remove:**
- Filter sheet for date range (replace with search)
- Or keep filter sheet for advanced filtering alongside search

## Sources

**High Confidence (Official/Current):**
- Apple Developer Documentation - SwiftUI Search Modifiers (iOS 15-26)
- Apple Developer Documentation - List and Section (iOS 13+)
- Swift Language Reference - Dictionary grouping (verified in codebase usage)

**Medium Confidence (Verified Community Patterns):**
- [SwiftUI Search Enhancements in iOS 26](https://nilcoalescing.com/blog/SwiftUISearchEnhancementsIniOSAndiPadOS26/) - Recent 2025 article on iOS 26 features
- [Searchable modifier in SwiftUI](https://www.devtechie.com/blog/searchable-modifier-in-swiftui) - Best practices guide
- [Pull to refresh in SwiftUI with refreshable](https://sarunw.com/posts/pull-to-refresh-in-swiftui/) - Sarunw technical blog
- [SwiftUI Badges for Toolbars & Tab Bars in iOS 26](https://www.devtechie.com/blog/swiftui-badges-for-toolbars-and-tab-bars-in-ios-26) - iOS 26 badge features
- [How expensive is DateFormatter](https://sarunw.com/posts/how-expensive-is-dateformatter/) - Performance analysis
- [Dictionary grouping in Swift](https://medium.com/codex/swifts-dictionary-grouping-and-how-underrated-it-is-8de68a50c4f7) - Grouping pattern guide
- [Easily Group Objects by a Date Property](https://medium.com/@karsonbraaten/easily-group-objects-by-a-date-property-in-swift-e803d450f30e) - Date grouping pattern
- [How to add section header and footer to SwiftUI list](https://sarunw.com/posts/swiftui-list-section-header-footer/) - Section customization
- [Mastering Date Formatting in Swift](https://medium.com/mobile-app-development-publication/mastering-date-formatting-in-swift-979ffae19ca8) - Date formatting best practices

---
*Stack research for: iOS Transaction List UI Enhancements*
*Researched: 2026-02-01*
*Target: iOS 26.2 SwiftUI App*
