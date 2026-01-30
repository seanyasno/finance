# Roadmap: Personal Finance Tracker

## Overview

This roadmap delivers a personal finance tracking app from the ground up, building feature-by-feature with complete API and iOS implementations at each phase. Starting with iOS foundation and authentication, we progress through transaction viewing, categorization, billing cycle management, and analytics. Each phase delivers a complete, usable capability before moving to the next.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: iOS Foundation** - iOS app with native UI and secure authentication
- [ ] **Phase 2: Transaction Viewing** - View and filter credit card transactions
- [ ] **Phase 3: Categorization** - Create categories and assign to transactions
- [ ] **Phase 4: Billing Cycles** - Configure billing periods and view cycle-based spending
- [ ] **Phase 5: Statistics & Analytics** - Spending trends and category breakdowns

## Phase Details

### Phase 1: iOS Foundation
**Goal**: Users can authenticate with the NestJS API from a native iOS app
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
- [ ] 01-01-PLAN.md — Networking foundation (API service, auth manager, keychain storage)
- [ ] 01-02-PLAN.md — Authentication UI (login, register, navigation flow)

### Phase 2: Transaction Viewing
**Goal**: Users can view and filter their credit card transactions
**Depends on**: Phase 1
**Requirements**: TRANS-01, TRANS-03, TRANS-04
**Success Criteria** (what must be TRUE):
  1. User can see list of all transactions from database in iOS app
  2. User can filter transactions by date range (start/end dates)
  3. User can filter transactions by credit card
  4. Transaction list displays card name, merchant, amount, and date
**Plans**: TBD

Plans:
- [ ] TBD (to be created during phase planning)

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
**Plans**: TBD

Plans:
- [ ] TBD (to be created during phase planning)

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
**Plans**: TBD

Plans:
- [ ] TBD (to be created during phase planning)

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
**Plans**: TBD

Plans:
- [ ] TBD (to be created during phase planning)

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. iOS Foundation | 0/2 | Planned | - |
| 2. Transaction Viewing | 0/TBD | Not started | - |
| 3. Categorization | 0/TBD | Not started | - |
| 4. Billing Cycles | 0/TBD | Not started | - |
| 5. Statistics & Analytics | 0/TBD | Not started | - |

---
*Roadmap created: 2026-01-30*
*Last updated: 2026-01-30 — Phase 1 planned (2 plans in 2 waves)*
