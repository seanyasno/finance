# Requirements: Personal Finance Tracker

**Defined:** 2026-01-30
**Core Value:** Being able to categorize transactions to understand where money goes each month

## v1.0 Requirements (Completed)

### Transaction Management

- [x] **TRANS-01**: User can view list of all transactions from database
- [x] **TRANS-02**: User can add optional notes to transactions
- [x] **TRANS-03**: User can filter transactions by date range
- [x] **TRANS-04**: User can filter transactions by credit card

### Categorization

- [x] **CAT-01**: User can create custom categories
- [x] **CAT-02**: User can assign category to a transaction
- [x] **CAT-03**: User can change category of a transaction
- [x] **CAT-04**: User can view transactions grouped by category
- [x] **CAT-05**: System provides default categories (food, clothes, transit, subscriptions, entertainment, health, bills, other)

### Billing Cycles

- [x] **BILL-01**: User can configure billing cycle start date for each credit card
- [x] **BILL-02**: User can view spending for individual card's current billing cycle
- [x] **BILL-03**: User can view combined spending across all cards (each in their billing cycle)
- [x] **BILL-04**: User can view spending by calendar month (1st to end of month)
- [x] **BILL-05**: User can navigate between billing periods (previous/next)

### Statistics & Analytics

- [x] **STATS-01**: User can see total spending for current period
- [x] **STATS-02**: User can see spending breakdown by category (with percentages)
- [x] **STATS-03**: User can view bar chart of spending for last 5 months
- [x] **STATS-04**: User can compare current month to previous month spending
- [x] **STATS-05**: User can see spending trends (increasing/decreasing)

### iOS Application

- [x] **IOS-01**: iOS app uses native SwiftUI components
- [x] **IOS-02**: iOS app follows iOS design patterns (navigation, lists, forms)
- [x] **IOS-03**: iOS app connects to NestJS API via HTTP client
- [x] **IOS-04**: iOS app handles authentication (login/register)
- [x] **IOS-05**: iOS app persists auth token securely

## v1.1 Requirements (Transactions Page Milestone)

### Search & Discovery

- [x] **SEARCH-01**: User can search transactions in real-time as they type
- [x] **SEARCH-02**: Search filters transactions by merchant name
- [x] **SEARCH-03**: Search filters transactions by amount
- [x] **SEARCH-04**: Search filters transactions by notes
- [x] **SEARCH-05**: Empty search results show clear messaging with search query
- [x] **SEARCH-06**: Search works correctly with pull-to-refresh (no cancellation)

### Grouping & Organization

- [x] **GROUP-01**: Transactions are grouped by date with section headers
- [x] **GROUP-02**: Recent transactions show relative dates (Today, Yesterday)
- [x] **GROUP-03**: Older transactions show formatted dates as section headers
- [x] **GROUP-04**: User can switch between grouping modes (date, card, month)
- [x] **GROUP-05**: User can view transactions grouped by credit card
- [x] **GROUP-06**: User can view transactions grouped by month

### Visual Formatting

- [x] **FORMAT-01**: All dates display in DD/MM/YY format throughout the app
- [x] **FORMAT-02**: Transaction list items show dates in DD/MM/YY format
- [x] **FORMAT-03**: Transaction detail page shows dates in DD/MM/YY format
- [ ] **FORMAT-04**: Card numbers display only last 4 digits (no asterisks)
- [ ] **FORMAT-05**: Pending transactions show visual indicator (badge/icon)
- [ ] **FORMAT-06**: Card display format is "CardName 1234" (spaces only, per user decision)

## v1.2+ Requirements (Future Enhancements)

### Advanced Search

- **SEARCH-07**: Search history shows recent searches
- **SEARCH-08**: User can clear search history
- **SEARCH-09**: Multi-criteria search with advanced filters

### Enhanced Grouping

- **GROUP-07**: Grouped sections show summary footers with totals
- **GROUP-08**: User's grouping preference persists across sessions
- **GROUP-09**: Collapsible section headers (iOS 17+)

### Advanced Analytics

- **STATS-06**: Budget setting per category
- **STATS-07**: Alerts when approaching budget limits
- **STATS-08**: Year-over-year comparisons
- **STATS-09**: Export data to CSV

### Auto-Categorization

- **CAT-06**: AI-based category suggestions
- **CAT-07**: Rules-based categorization (merchant name patterns)
- **CAT-08**: Learn from user's categorization history

### Data Sources

- **DATA-01**: Include bank account transactions
- **DATA-02**: Real-time transaction syncing
- **DATA-03**: Manual transaction entry

### Sharing

- **SHARE-01**: Multi-user support (family accounts)
- **SHARE-02**: Shared categories across users
- **SHARE-03**: Permission management

## Out of Scope

| Feature | Reason |
|---------|--------|
| Web frontend | iOS only - mobile-first approach |
| Bank account data | Credit cards only for v1 - focus on spending patterns |
| Auto-categorization | Manual tagging keeps it simple, can add later |
| Budget/alerts | Pure tracking first, behavior change features later |
| Multi-user | Personal use only - avoid complexity |
| Investment tracking | Out of domain - this is spending analysis |
| Bill payment | Read-only analysis, not a banking app |
| Infinite scroll | Pagination preferred for performance |
| Over-animated transitions | Performance over visual effects |
| Real-time balance updates during scroll | Unnecessary cognitive load |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| IOS-01 | Phase 1 | Complete |
| IOS-02 | Phase 1 | Complete |
| IOS-03 | Phase 1 | Complete |
| IOS-04 | Phase 1 | Complete |
| IOS-05 | Phase 1 | Complete |
| TRANS-01 | Phase 2 | Complete |
| TRANS-03 | Phase 2 | Complete |
| TRANS-04 | Phase 2 | Complete |
| CAT-01 | Phase 3 | Complete |
| CAT-02 | Phase 3 | Complete |
| CAT-03 | Phase 3 | Complete |
| CAT-04 | Phase 3 | Complete |
| CAT-05 | Phase 3 | Complete |
| TRANS-02 | Phase 3 | Complete |
| BILL-01 | Phase 4 | Complete |
| BILL-02 | Phase 4 | Complete |
| BILL-03 | Phase 4 | Complete |
| BILL-04 | Phase 4 | Complete |
| BILL-05 | Phase 4 | Complete |
| STATS-01 | Phase 5 | Complete |
| STATS-02 | Phase 5 | Complete |
| STATS-03 | Phase 5 | Complete |
| STATS-04 | Phase 5 | Complete |
| STATS-05 | Phase 5 | Complete |
| SEARCH-01 | Phase 6 | Complete |
| SEARCH-02 | Phase 6 | Complete |
| SEARCH-03 | Phase 6 | Complete |
| SEARCH-04 | Phase 6 | Complete |
| SEARCH-05 | Phase 6 | Complete |
| SEARCH-06 | Phase 6 | Complete |
| GROUP-01 | Phase 7 | Complete |
| GROUP-02 | Phase 7 | Complete |
| GROUP-03 | Phase 7 | Complete |
| FORMAT-01 | Phase 7 | Complete |
| FORMAT-02 | Phase 7 | Complete |
| FORMAT-03 | Phase 7 | Complete |
| GROUP-04 | Phase 8 | Complete |
| GROUP-05 | Phase 8 | Complete |
| GROUP-06 | Phase 8 | Complete |
| FORMAT-04 | Phase 9 | Pending |
| FORMAT-05 | Phase 9 | Pending |
| FORMAT-06 | Phase 9 | Pending |

**Coverage (v1.0):**
- v1.0 requirements: 24 total
- Mapped to phases: 24
- Unmapped: 0

**Coverage (v1.1):**
- v1.1 requirements: 18 total
- Mapped to phases: 18
- Unmapped: 0

---
*Requirements defined: 2026-01-30*
*Last updated: 2026-02-02 — Phase 8 complete (GROUP-04, GROUP-05, GROUP-06 verified)*
