# Roadmap: Personal Finance Tracker

## Milestones

- ✅ **v1.0 MVP** - Phases 1-5 (shipped 2026-01-31)
- 🚧 **v1.1 Transactions Page** - Phases 6-9 (in progress)

## Phases

<details>
<summary>✅ v1.0 MVP (Phases 1-5) - SHIPPED 2026-01-31</summary>

### Phase 1: iOS Foundation
**Goal**: iOS app with native UI and secure authentication
**Depends on**: Nothing (first phase)
**Requirements**: IOS-01, IOS-02, IOS-03, IOS-04, IOS-05
**Success Criteria** (what must be TRUE):
  1. iOS app launches with native SwiftUI interface
  2. User can register for new account from iOS app
  3. User can log in with existing credentials from iOS app
  4. Auth token persists securely across app restarts
  5. Authenticated requests to API include valid JWT token
**Plans**: 2 plans

Plans:
- [x] 01-01-PLAN.md — Networking foundation (API service, auth manager, keychain storage)
- [x] 01-02-PLAN.md — Authentication UI (login, register, navigation flow)

### Phase 2: Transaction Viewing
**Goal**: Users can view and filter their credit card transactions
**Depends on**: Phase 1
**Requirements**: TRANS-01, TRANS-03, TRANS-04
**Success Criteria** (what must be TRUE):
  1. User can see list of all transactions from database in iOS app
  2. User can filter transactions by date range (start/end dates)
  3. User can filter transactions by credit card
  4. Transaction list displays card name, merchant, amount, and date
**Plans**: 3 plans

Plans:
- [x] 02-01-PLAN.md — API transactions and credit cards modules (NestJS endpoints with filters)
- [x] 02-02-PLAN.md — iOS models and service layer (Transaction, CreditCard, TransactionService)
- [x] 02-03-PLAN.md — iOS transaction list UI with filter sheet

### Phase 3: Categorization
**Goal**: Users can organize transactions into custom categories
**Depends on**: Phase 2
**Requirements**: CAT-01, CAT-02, CAT-03, CAT-04, CAT-05, TRANS-02
**Success Criteria** (what must be TRUE):
  1. User can create new custom categories
  2. User can see default categories (food, clothes, transit, subscriptions, entertainment, health, bills, other)
  3. User can assign category to any transaction
  4. User can change category of previously categorized transaction
  5. User can view transactions grouped by category
  6. User can add optional notes to transactions
**Plans**: 5 plans

Plans:
- [x] 03-01-PLAN.md — Database schema + Categories API (Prisma model, NestJS CRUD endpoints, default categories)
- [x] 03-02-PLAN.md — Transaction update API (PATCH endpoint for category/notes assignment)
- [x] 03-03-PLAN.md — iOS Category model, service, and management UI
- [x] 03-04-PLAN.md — iOS Transaction detail view with category picker and notes
- [x] 03-05-PLAN.md — Category-grouped spending view with TabView navigation

### Phase 4: Billing Cycles
**Goal**: Users can configure and view spending by billing period
**Depends on**: Phase 3
**Requirements**: BILL-01, BILL-02, BILL-03, BILL-04, BILL-05
**Success Criteria** (what must be TRUE):
  1. User can configure billing cycle start date for each credit card
  2. User can view spending for individual card's current billing cycle
  3. User can view combined spending across all cards (each in their own billing cycle)
  4. User can view spending by calendar month (1st to end of month)
  5. User can navigate between billing periods (previous/next cycle)
**Plans**: 3 plans

Plans:
- [x] 04-01-PLAN.md — API billing cycle configuration (schema + PATCH endpoint for credit cards)
- [x] 04-02-PLAN.md — iOS credit card settings with billing cycle picker
- [x] 04-03-PLAN.md — Billing cycle spending view with period navigation

### Phase 5: Statistics & Analytics
**Goal**: Users can analyze spending patterns and trends
**Depends on**: Phase 4
**Requirements**: STATS-01, STATS-02, STATS-03, STATS-04, STATS-05
**Success Criteria** (what must be TRUE):
  1. User can see total spending for current period
  2. User can see spending breakdown by category with percentages
  3. User can view bar chart of spending for last 5 months
  4. User can compare current month to previous month spending
  5. User can see spending trends (increasing/decreasing indicators)
**Plans**: 3 plans

Plans:
- [x] 05-01-PLAN.md — OpenAPI Swift code generation setup and iOS model migration
- [x] 05-02-PLAN.md — Statistics API endpoint (5-month spending summary with trends)
- [x] 05-03-PLAN.md — Statistics iOS UI (bar chart, comparisons, trend indicators)

</details>

### 🚧 v1.1 Transactions Page (In Progress)

**Milestone Goal:** Enhance transaction list UI with search, flexible grouping, improved formatting, and better visual indicators

#### Phase 6: Search Functionality
**Goal**: Users can search and filter transactions in real-time
**Depends on**: Phase 5
**Requirements**: SEARCH-01, SEARCH-02, SEARCH-03, SEARCH-04, SEARCH-05, SEARCH-06
**Success Criteria** (what must be TRUE):
  1. User can type in search bar and see transactions filtered in real-time
  2. Search filters by merchant name, showing only matching transactions
  3. Search filters by amount, matching exact or partial values
  4. Search filters by notes content
  5. Empty search results show clear message with search query displayed
  6. User can pull-to-refresh during search without cancelling the search or refresh operation
**Plans**: 3 plans

Plans:
- [x] 06-01-PLAN.md — API search parameter (add search query to transactions endpoint)
- [x] 06-02-PLAN.md — iOS search UI (searchable modifier, debounce, empty state messaging)
- [x] 06-03-PLAN.md — Gap closure: Add amount search to API (closes verification gap)

#### Phase 7: Date-Based Grouping
**Goal**: Users can view transactions organized by date with clear temporal context
**Depends on**: Phase 6
**Requirements**: GROUP-01, GROUP-02, GROUP-03, FORMAT-01, FORMAT-02, FORMAT-03
**Success Criteria** (what must be TRUE):
  1. Transactions appear in sections with date headers
  2. Recent transactions show relative dates (Today, Yesterday) as section headers
  3. Older transactions show formatted dates (DD/MM/YY format) as section headers
  4. All dates throughout the app display in DD/MM/YY format consistently
  5. Transaction list items show dates in DD/MM/YY format
  6. Transaction detail page shows dates in DD/MM/YY format
**Plans**: 2 plans

Plans:
- [x] 07-01-PLAN.md — Date formatting infrastructure (cached formatters, DD/MM/YY format, relative date detection)
- [x] 07-02-PLAN.md — Grouped transaction list UI (date sections, relative headers, detail view formatting)

#### Phase 8: Multiple Grouping Modes
**Goal**: Users can switch between different ways of organizing transactions
**Depends on**: Phase 7
**Requirements**: GROUP-04, GROUP-05, GROUP-06
**Success Criteria** (what must be TRUE):
  1. User can access grouping mode selector in transaction list view
  2. User can select to group transactions by date (default from Phase 7)
  3. User can select to group transactions by credit card, showing sections for each card
  4. User can select to group transactions by month, showing chronological monthly sections
  5. Switching between grouping modes updates the list immediately
**Plans**: 2 plans

Plans:
- [x] 08-01-PLAN.md — Grouping infrastructure (GroupingMode enum, card/month grouping extensions)
- [x] 08-02-PLAN.md — Grouping UI (mode selector in toolbar, three-way grouping logic, persistence)

#### Phase 9: Visual Formatting & Polish
**Goal**: Users see clear visual indicators and simplified information display
**Depends on**: Phase 8
**Requirements**: FORMAT-04, FORMAT-05, FORMAT-06
**Success Criteria** (what must be TRUE):
  1. Card numbers display only last 4 digits throughout the app (no asterisks)
  2. Card display follows format "CardName ••1234" consistently
  3. Pending transactions show clear visual indicator (badge or icon)
  4. User can immediately distinguish pending from settled transactions
  5. Visual formatting works correctly across all grouping modes
**Plans**: TBD

Plans:
- [ ] 09-01: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. iOS Foundation | v1.0 | 2/2 | Complete | 2026-01-30 |
| 2. Transaction Viewing | v1.0 | 3/3 | Complete | 2026-01-30 |
| 3. Categorization | v1.0 | 5/5 | Complete | 2026-01-31 |
| 4. Billing Cycles | v1.0 | 3/3 | Complete | 2026-01-31 |
| 5. Statistics & Analytics | v1.0 | 3/3 | Complete | 2026-01-31 |
| 6. Search Functionality | v1.1 | 3/3 | Complete | 2026-02-02 |
| 7. Date-Based Grouping | v1.1 | 2/2 | Complete | 2026-02-02 |
| 8. Multiple Grouping Modes | v1.1 | 2/2 | Complete | 2026-02-02 |
| 9. Visual Formatting & Polish | v1.1 | 0/TBD | Not started | - |

---
*Roadmap created: 2026-01-30*
*Last updated: 2026-02-02 — Phase 8 complete (multiple grouping modes, all must-haves verified)*
