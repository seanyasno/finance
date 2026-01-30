# Personal Finance Tracker

## What This Is

A personal finance management app to track credit card spending by category across billing cycles. Backend API (NestJS) serves transaction data, statistics, and category management. Native iOS app provides the interface for viewing spending patterns, categorizing transactions, and analyzing trends.

## Core Value

Being able to categorize transactions to understand where money goes each month.

## Requirements

### Validated

- ✓ Transaction scraping from Israeli credit cards — existing
- ✓ User authentication with JWT — existing
- ✓ Transaction persistence in PostgreSQL — existing
- ✓ Monorepo structure with Turborepo — existing

### Active

- [ ] View list of all transactions from database
- [ ] Manually assign categories to transactions (clothes, food, transit, subscriptions, etc.)
- [ ] Add optional notes to transactions
- [ ] Configure billing cycle date per credit card
- [ ] View spending by individual card billing cycle
- [ ] View combined spending across all cards in their billing cycles
- [ ] View spending by calendar month (1st to end of month)
- [ ] Calculate monthly spending totals
- [ ] Display bar chart of spending for last 5 months
- [ ] Compare spending trends month-over-month
- [ ] iOS app with native design patterns for all views

### Out of Scope

- Bank account data — Credit cards only for now
- Auto-categorization or AI-based category suggestions — Manual tagging only
- Rules-based categorization (e.g., "Starbucks = Food") — Keep it simple
- Web frontend — iOS only
- Real-time transaction syncing — Scraper runs on demand
- Budget setting or alerts — Pure tracking/analysis only
- Multi-user or family accounts — Personal use only

## Context

**Existing codebase:**
- NestJS API (`apps/api`) with JWT authentication working
- Transaction scraper service (`apps/transactions-fetcher`) pulling from 5 Israeli credit card companies (Discount, OneZero, Isracard, Max, Visa Cal)
- PostgreSQL database with Prisma ORM
- Monorepo managed by Turborepo
- Database schema includes users, transactions, bank_accounts, credit_cards

**Technology ecosystem:**
- Backend: NestJS, TypeScript, Prisma, PostgreSQL
- New: Swift/SwiftUI for iOS app
- israeli-bank-scrapers library handles actual transaction fetching

**Starting state:**
- Transactions already exist in database from scraper
- Auth system functional (login, register, JWT tokens)
- Need to extend API with transaction/category/statistics endpoints
- Need to build iOS app from scratch

## Constraints

- **Tech Stack**: NestJS backend (maintain existing patterns), Swift for iOS
- **Design**: Native iOS components and patterns — no custom UI framework
- **Data Source**: Credit card transactions only (exclude bank accounts)
- **Categorization**: Manual user tagging — no automation
- **Development**: Feature-by-feature (build API + iOS for each capability before moving to next)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Credit cards only (exclude bank accounts) | Banks are just balance tracking; credit cards have spending patterns and billing cycles that matter for analysis | — Pending |
| Manual categorization only | Start simple; can add auto-categorization later once patterns are established | — Pending |
| Three billing cycle views (per-card, combined, calendar) | Different cards have different billing dates; need flexibility to analyze by actual billing cycle or by calendar month | — Pending |
| Feature-by-feature development (API + iOS together) | Ship complete features so each piece is immediately usable | — Pending |
| Native iOS design | Leverage platform conventions for familiar, polished UX | — Pending |

---
*Last updated: 2026-01-30 after initialization*
