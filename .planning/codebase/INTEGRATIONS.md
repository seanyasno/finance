# External Integrations

**Analysis Date:** 2026-01-30

## APIs & External Services

**Bank & Credit Card Scraping:**
- `israeli-bank-scrapers` (npm package) - Scrapes transactions from Israeli financial institutions
  - Supported providers: Discount, One Zero, Isracard, Max, Visa Cal
  - SDK/Client: `israeli-bank-scrapers` v6.7.0
  - Used in: `apps/transactions-fetcher/`
  - Files: `apps/transactions-fetcher/src/scraping/scraping.service.ts`
  - Authentication: Bank username/password (stored in user preferences)

**Browser Automation:**
- Puppeteer (npm package) - Headless browser for web scraping
  - SDK/Client: `puppeteer` v24.15.0
  - Used by: `israeli-bank-scrapers` for navigating bank websites

## Data Storage

**Primary Database:**
- PostgreSQL 16 (self-hosted)
  - Connection: Via environment variable `DATABASE_URL`
  - Connection format: `postgresql://user:password@host:port/database`
  - Client: Prisma 6.11.1 (`@prisma/client`)
  - Schema location: `packages/database/prisma/schema.prisma`
  - Docker service: `finance-postgres` (defined in `docker-compose.yml`)
  - Host: `localhost:5432` (development)
  - Database name: `finance`
  - Default credentials (dev): postgres/postgres

**File Storage:**
- Local filesystem only - No external file storage service detected

**Caching:**
- None detected - No Redis or caching service configured

## Authentication & Identity

**Auth Provider:**
- Custom JWT-based authentication (self-hosted)
  - Implementation: JWT tokens with Passport strategy
  - Location: `apps/api/src/auth/`
  - Framework: `@nestjs/jwt` 11.0.0 + `@nestjs/passport` 11.0.5
  - Strategy: `passport-jwt` v4.0.1
  - JWT Secret: Environment variable `JWT_SECRET`
  - Cookie-based: Tokens stored in HTTP-only cookies for security

**Password Management:**
- bcrypt v6.0.0 for hashing and verification
- Location: `apps/api/src/auth/utils/password.util.ts`

**Session Configuration (Cookies):**
- Environment variables (in `apps/api/.env.example`):
  - `COOKIE_DOMAIN` - Domain restriction (default: localhost)
  - `COOKIE_SECURE` - HTTPS-only flag (false in dev, true in prod)
  - `COOKIE_SAME_SITE` - SameSite attribute (lax/strict/none)
  - `COOKIE_MAX_AGE` - Expiration time in milliseconds (default: 7 days / 604800000ms)
  - Cookie name: `auth-token`

## Monitoring & Observability

**Error Tracking:**
- Not detected - No external error tracking service (Sentry, DataDog, etc.) configured

**Logs:**
- Console logging only - `console.error()` used in error handlers
  - Location: `apps/transactions-fetcher/src/scraping/scraping.service.ts`
  - No structured logging service detected

## CI/CD & Deployment

**Hosting:**
- Not detected - No hosting platform configuration found (no Vercel, Railway, etc.)

**CI Pipeline:**
- Not detected - No CI configuration (GitHub Actions, GitLab CI, etc.) found

**Docker:**
- Docker Compose support for local development
  - File: `docker-compose.yml`
  - Services: PostgreSQL 16
  - Commands: `npm run docker:build`, `npm run docker:up`, `npm run docker:down`

## Environment Configuration

**Required env vars for API (`apps/api/.env`):**
- `DATABASE_URL` - PostgreSQL connection string
- `DIRECT_URL` - Direct PostgreSQL connection (for Prisma migrations)
- `JWT_SECRET` - Minimum 32 characters, required for token signing
- `FRONTEND_URL` - CORS origin for frontend (default: http://localhost:5173)
- `COOKIE_DOMAIN` - Domain for auth cookies
- `COOKIE_SECURE` - Boolean flag for HTTPS-only cookies
- `COOKIE_SAME_SITE` - SameSite attribute (lax/strict/none)
- `COOKIE_MAX_AGE` - Session timeout in milliseconds

**Required env vars for Database (`packages/database/.env`):**
- `DATABASE_URL` - PostgreSQL connection string
- `DIRECT_URL` - Direct PostgreSQL connection (non-pooled)

**Secrets location:**
- `.env` files (not committed to git)
- `DATABASE_URL` contains credentials
- `JWT_SECRET` stored in environment

## Webhooks & Callbacks

**Incoming:**
- Not detected - No webhook endpoints configured

**Outgoing:**
- Not detected - No outgoing webhook integrations found

## Data Models & Schema

**Core Entities (via Prisma):**

**Users:**
- Location: `packages/database/prisma/schema.prisma`
- Fields: id, email, password (hashed), firstName, lastName, created_at, updated_at
- Relations: transactions, bank_accounts, credit_cards

**Transactions:**
- Fields: id, description, timestamp, notes, metadata, is_recurring, status, installments
- Amount tracking: original_amount/currency, charged_amount/currency
- Source: bank_account or credit_card
- Status enum: completed, pending
- Relations: user, bank_account, credit_card

**Bank Accounts:**
- Fields: id, account_number, balance, company
- Company enum: discount, oneZero
- Relations: user, transactions

**Credit Cards:**
- Fields: id, card_number, company
- Company enum: max, isracard, visaCal
- Relations: user, transactions

## API Endpoints & OpenAPI

**API Documentation:**
- Swagger/OpenAPI endpoint: `http://localhost:3100/api`
- OpenAPI JSON spec: `http://localhost:3100/api-json`

**OpenAPI Code Generation:**
- Tool: `@openapitools/openapi-generator-cli` v2.13.4
- Command: `npm run codegen` (from `apps/api`)
- Output: TypeScript Axios client in `packages/api-client/src`
- Generator: typescript-axios

**CORS Configuration:**
- Enabled in `apps/api/src/main.ts`
- Origin: `process.env.FRONTEND_URL` or `http://localhost:5173`
- Credentials: true (allows cookies)

## Security Headers

**Implemented (via helmet):**
- `helmet` v8.1.0 middleware in `apps/api/src/main.ts`
- Sets secure HTTP headers to prevent common vulnerabilities

---

*Integration audit: 2026-01-30*
