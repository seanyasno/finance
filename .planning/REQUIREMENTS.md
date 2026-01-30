# Requirements: Personal Finance Tracker

**Defined:** 2026-01-30
**Core Value:** Being able to categorize transactions to understand where money goes each month

## v1 Requirements

### Transaction Management

- [ ] **TRANS-01**: User can view list of all transactions from database
- [ ] **TRANS-02**: User can add optional notes to transactions
- [ ] **TRANS-03**: User can filter transactions by date range
- [ ] **TRANS-04**: User can filter transactions by credit card

### Categorization

- [ ] **CAT-01**: User can create custom categories
- [ ] **CAT-02**: User can assign category to a transaction
- [ ] **CAT-03**: User can change category of a transaction
- [ ] **CAT-04**: User can view transactions grouped by category
- [ ] **CAT-05**: System provides default categories (food, clothes, transit, subscriptions, entertainment, health, bills, other)

### Billing Cycles

- [ ] **BILL-01**: User can configure billing cycle start date for each credit card
- [ ] **BILL-02**: User can view spending for individual card's current billing cycle
- [ ] **BILL-03**: User can view combined spending across all cards (each in their billing cycle)
- [ ] **BILL-04**: User can view spending by calendar month (1st to end of month)
- [ ] **BILL-05**: User can navigate between billing periods (previous/next)

### Statistics & Analytics

- [ ] **STATS-01**: User can see total spending for current period
- [ ] **STATS-02**: User can see spending breakdown by category (with percentages)
- [ ] **STATS-03**: User can view bar chart of spending for last 5 months
- [ ] **STATS-04**: User can compare current month to previous month spending
- [ ] **STATS-05**: User can see spending trends (increasing/decreasing)

### iOS Application

- [ ] **IOS-01**: iOS app uses native SwiftUI components
- [ ] **IOS-02**: iOS app follows iOS design patterns (navigation, lists, forms)
- [ ] **IOS-03**: iOS app connects to NestJS API via HTTP client
- [ ] **IOS-04**: iOS app handles authentication (login/register)
- [ ] **IOS-05**: iOS app persists auth token securely

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
| (To be filled by roadmapper) | | |

**Coverage:**
- v1 requirements: 24 total
- Mapped to phases: 0
- Unmapped: 24 ⚠️

---
*Requirements defined: 2026-01-30*
*Last updated: 2026-01-30 after initial definition*
