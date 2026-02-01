# Personal Finance Tracker

## What This Is

A personal finance management app to track credit card spending by category across billing cycles. Backend API (NestJS) serves transaction data, statistics, and category management. Native iOS app provides the interface for viewing spending patterns, categorizing transactions, and analyzing trends.

## Core Value

Being able to categorize transactions to understand where money goes each month.

## Current Milestone: v1.1 Transactions Page

**Goal:** Enhance transaction list UI with search, flexible grouping, improved formatting, and better visual indicators

**Target features:**
- Search transactions by merchant, amount, or notes
- Multiple view modes (grouped by date, by card, by month)
- Improved date formatting (DD/MM/YY)
- Simplified card number display (last 4 digits only)
- Visual indicators for pending transactions
- Pull-to-refresh capability

## Requirements

### Validated

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

### Active

- [ ] Search transactions by merchant name, amount, or notes
- [ ] Group transactions by date (today, yesterday, this week, earlier)
- [ ] Group transactions by credit card
- [ ] Group transactions by month (chronological)
- [ ] Switch between different grouping views
- [ ] Display dates in DD/MM/YY format throughout app
- [ ] Display card numbers as last 4 digits only
- [ ] Show visual indicator for pending transactions
- [ ] Pull-to-refresh transaction list

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
*Last updated: 2026-02-01 after v1.1 milestone start*
