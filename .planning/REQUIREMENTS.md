# Requirements: Personal Finance Tracker

**Defined:** 2026-01-30
**Core Value:** Being able to categorize transactions to understand where money goes each month

## v1 Requirements

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

- [ ] **STATS-01**: User can see total spending for current period
- [ ] **STATS-02**: User can see spending breakdown by category (with percentages)
- [ ] **STATS-03**: User can view bar chart of spending for last 5 months
- [ ] **STATS-04**: User can compare current month to previous month spending
- [ ] **STATS-05**: User can see spending trends (increasing/decreasing)

### iOS Application

- [x] **IOS-01**: iOS app uses native SwiftUI components
- [x] **IOS-02**: iOS app follows iOS design patterns (navigation, lists, forms)
- [x] **IOS-03**: iOS app connects to NestJS API via HTTP client
- [x] **IOS-04**: iOS app handles authentication (login/register)
- [x] **IOS-05**: iOS app persists auth token securely

## v2 Requirements

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
| STATS-01 | Phase 5 | Pending |
| STATS-02 | Phase 5 | Pending |
| STATS-03 | Phase 5 | Pending |
| STATS-04 | Phase 5 | Pending |
| STATS-05 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 24 total
- Mapped to phases: 24
- Unmapped: 0

---
*Requirements defined: 2026-01-30*
*Last updated: 2026-01-30 — Phase 2 requirements marked complete*
