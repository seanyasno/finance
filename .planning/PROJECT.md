# Personal Finance Tracker

## What This Is

A personal finance management app to track credit card spending by category across billing cycles. Backend API (NestJS) serves transaction data, statistics, and category management. Native iOS app provides the interface for viewing spending patterns, categorizing transactions, and analyzing trends.

## Core Value

Being able to categorize transactions to understand where money goes each month.

## Requirements

### Validated

**v1.0 MVP:**
- ✓ Transaction scraping from Israeli credit cards — v1.0
- ✓ User authentication with JWT — v1.0
- ✓ Transaction persistence in PostgreSQL — v1.0
- ✓ Monorepo structure with Turborepo — v1.0
- ✓ View list of all transactions from database — v1.0
- ✓ Manually assign categories to transactions — v1.0
- ✓ Add optional notes to transactions — v1.0
- ✓ Configure billing cycle date per credit card — v1.0
- ✓ View spending by individual card billing cycle — v1.0
- ✓ View combined spending across all cards in their billing cycles — v1.0
- ✓ View spending by calendar month (1st to end of month) — v1.0
- ✓ Calculate monthly spending totals — v1.0
- ✓ Display bar chart of spending for last 5 months — v1.0
- ✓ Compare spending trends month-over-month — v1.0
- ✓ iOS app with native design patterns for all views — v1.0

**v1.1 Transactions Page:**
- ✓ Search transactions by merchant name, amount, or notes — v1.1 (debounced with 300ms delay)
- ✓ Group transactions by date with relative labels (Today/Yesterday) — v1.1
- ✓ Group transactions by credit card — v1.1
- ✓ Group transactions by month (chronological) — v1.1
- ✓ Switch between different grouping views — v1.1 (persistent selection)
- ✓ Display dates in DD/MM/YY format throughout app — v1.1 (cached formatters)
- ✓ Display card numbers as last 4 digits only — v1.1 ("CardName 1234" format)
- ✓ Show visual indicator for pending transactions — v1.1 (orange clock icon)
- ✓ Pull-to-refresh transaction list — v1.1 (maintains search state)

### Active

No requirements currently in progress. Next milestone to be defined.

### Out of Scope

- Bank account data — Credit cards only for now
- Auto-categorization or AI-based category suggestions — Manual tagging only
- Rules-based categorization (e.g., "Starbucks = Food") — Keep it simple
- Web frontend — iOS only
- Real-time transaction syncing — Scraper runs on demand
- Budget setting or alerts — Pure tracking/analysis only
- Multi-user or family accounts — Personal use only

## Context

**Current State (as of v1.1):**
- **Codebase:** 7,146 lines (Swift + TypeScript)
- **Tech Stack:** NestJS API, Swift/SwiftUI iOS app, PostgreSQL with Prisma
- **Shipped Features:**
  - Complete authentication flow (login/register/JWT)
  - Transaction viewing with search and multiple grouping modes
  - Category management with custom and default categories
  - Billing cycle configuration per credit card
  - Statistics and analytics with 5-month trends
- **Architecture:** Monorepo managed by Turborepo

**Recent Milestone (v1.1):**
- Enhanced transaction list with real-time search (merchant, amount, notes)
- Multiple grouping modes (date, card, month) with persistent selection
- Visual polish: DD/MM/YY formatting, simplified card display, pending indicators
- Performance: Cached date formatters, efficient Dictionary grouping

**Known Issues:**
- Custom category creation broken (03-05): Categories created in database but not appearing in iOS UI
- Amount search uses two queries (raw SQL + Prisma) - works but could optimize later

## Constraints

- **Tech Stack**: NestJS backend (maintain existing patterns), Swift for iOS
- **Design**: Native iOS components and patterns — no custom UI framework
- **Data Source**: Credit card transactions only (exclude bank accounts)
- **Categorization**: Manual user tagging — no automation
- **Development**: Feature-by-feature (build API + iOS for each capability before moving to next)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Credit cards only (exclude bank accounts) | Banks are just balance tracking; credit cards have spending patterns and billing cycles that matter for analysis | ✓ Good - Focus maintained through v1.1 |
| Manual categorization only | Start simple; can add auto-categorization later once patterns are established | ✓ Good - Simple tagging works well |
| Three billing cycle views (per-card, combined, calendar) | Different cards have different billing dates; need flexibility to analyze by actual billing cycle or by calendar month | ✓ Good - Flexibility appreciated |
| Feature-by-feature development (API + iOS together) | Ship complete features so each piece is immediately usable | ✓ Good - Clean integration pattern |
| Native iOS design | Leverage platform conventions for familiar, polished UX | ✓ Good - SwiftUI patterns work well |
| Debounced search (300ms) | Balance responsiveness with performance | ✓ Good - Matches iOS conventions |
| Cached date formatters | Prevent scrolling performance degradation | ✓ Good - Smooth scrolling maintained |
| Dictionary grouping pattern | Efficient native grouping without re-computation | ✓ Good - Clean SwiftUI integration |
| Card format "CardName 1234" (no asterisks) | Simplified visual presentation | ✓ Good - Cleaner appearance |

---
*Last updated: 2026-02-02 after v1.1 milestone completion*
