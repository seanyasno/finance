# Codebase Structure

**Analysis Date:** 2026-01-30

## Directory Layout

```
finance/
├── apps/                                   # Application packages
│   ├── api/                               # Main backend API
│   │   ├── src/
│   │   │   ├── main.ts                   # Entry point
│   │   │   ├── app.module.ts             # Root module
│   │   │   ├── app.controller.ts         # Root controller
│   │   │   ├── app.service.ts            # Root service
│   │   │   └── auth/                     # Authentication module
│   │   │       ├── auth.module.ts
│   │   │       ├── auth.controller.ts
│   │   │       ├── auth.service.ts
│   │   │       ├── auth.decorator.ts     # @CurrentUser decorator
│   │   │       ├── dto/                  # DTOs for validation
│   │   │       ├── guards/               # Auth guards (JwtAuthGuard)
│   │   │       ├── strategies/           # Passport strategies
│   │   │       └── utils/                # Password hashing utilities
│   │   └── package.json
│   │
│   └── transactions-fetcher/             # Bank transaction scraping service
│       ├── src/
│       │   ├── main.ts                   # Entry point
│       │   ├── app.module.ts             # Root module
│       │   ├── app.controller.ts
│       │   ├── config/                   # Configuration & mock data
│       │   │   ├── config.module.ts
│       │   │   └── mock-data/
│       │   ├── scraping/                 # Scraping strategies & orchestration
│       │   │   ├── scraping.module.ts
│       │   │   ├── scraping.service.ts
│       │   │   ├── strategies/           # Bank-specific strategies
│       │   │   │   ├── discount.strategy.ts
│       │   │   │   ├── isracard.strategy.ts
│       │   │   │   ├── max.strategy.ts
│       │   │   │   ├── one-zero.strategy.ts
│       │   │   │   └── visa-cal.strategy.ts
│       │   │   ├── factories/            # Scraper configuration factory
│       │   │   └── types/                # Strategy type definitions
│       │   ├── transactions/             # Transaction orchestration
│       │   │   ├── transactions.module.ts
│       │   │   ├── transactions.controller.ts
│       │   │   ├── transactions.service.ts
│       │   │   ├── helpers/              # Transaction mapping & validation
│       │   │   └── types/                # Transaction types
│       │   ├── database/                 # Database integration layer
│       │   │   ├── database.module.ts
│       │   │   └── services/
│       │   │       ├── transaction-persistence.service.ts
│       │   │       ├── bank-account.service.ts
│       │   │       └── credit-card.service.ts
│       │   └── common/                   # Shared constants & types
│       │       ├── types/
│       │       └── constants/
│       └── package.json
│
├── packages/                              # Shared packages
│   ├── database/                         # Database ORM & schema
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── db-client.ts             # Prisma client instance
│   │   │   ├── prisma.service.ts        # NestJS Prisma service
│   │   │   └── prisma.module.ts         # Global database module
│   │   ├── prisma/
│   │   │   └── schema.prisma            # Prisma schema (users, transactions, etc.)
│   │   └── package.json
│   │
│   ├── libs/                             # Utility functions & types
│   │   ├── src/
│   │   │   ├── index.ts                 # Main export
│   │   │   ├── types/                   # Type utilities & guards
│   │   │   ├── array.ts                 # Array utilities
│   │   │   ├── string.ts                # String utilities
│   │   │   ├── object.ts                # Object utilities
│   │   │   └── error.ts                 # Error handling utilities
│   │   └── package.json
│   │
│   ├── api-client/                       # Auto-generated TypeScript API client
│   │   ├── src/
│   │   │   ├── index.ts                 # Main exports
│   │   │   ├── api.ts                   # API endpoints
│   │   │   ├── configuration.ts
│   │   │   └── base.ts
│   │   └── package.json
│   │
│   ├── eslint-config/                    # Shared ESLint configuration
│   ├── typescript-config/                # Shared TypeScript configuration
│   └── tailwind-config/                  # Shared Tailwind CSS configuration
│
├── .github/                              # GitHub Actions workflows
│   └── workflows/
│
├── .planning/                            # GSD planning documents
│   └── codebase/
│
├── .husky/                               # Git hooks
├── .turbo/                               # Turborepo cache
├── .eslintrc.js                          # Root ESLint config
├── turbo.json                            # Turborepo configuration
├── package.json                          # Root workspace package.json
├── tsconfig.json                         # Root TypeScript config
├── docker-compose.yml                    # Docker Compose for local development
└── CLAUDE.md                             # Claude Code project instructions
```

## Directory Purposes

**apps/**
- Purpose: Standalone NestJS applications with independent entry points
- Contains: Complete applications with controllers, services, modules
- Characteristics: Each app is a separate npm package in the workspace

**apps/api/**
- Purpose: Main backend API for authentication and user management
- Entry point: `apps/api/src/main.ts` (port 3100)
- Key modules: AuthModule, AppModule

**apps/api/src/auth/**
- Purpose: All authentication-related code (login, register, JWT, guards)
- Contains: Controllers, services, strategies, guards, DTOs, decorators
- Key files: `auth.service.ts`, `jwt.strategy.ts`, `jwt-auth.guard.ts`

**apps/transactions-fetcher/**
- Purpose: Standalone service for fetching bank/credit card transactions
- Entry point: `apps/transactions-fetcher/src/main.ts` (port 3200)
- Responsibility: Scrape data and persist to shared database

**apps/transactions-fetcher/src/scraping/**
- Purpose: Strategy-pattern implementation for different banks
- Contains: Service for orchestration, individual strategy implementations
- Pattern: Each bank gets a strategy class (discount, isracard, max, etc.)

**packages/database/**
- Purpose: Centralized database schema and ORM abstraction
- Schema location: `packages/database/prisma/schema.prisma`
- Exported: PrismaService (global), all Prisma types
- Used by: Both API and transactions-fetcher

**packages/libs/**
- Purpose: Shared utility functions and type utilities
- Exports: Type guards, array/object/string helpers, error utilities
- Used by: All applications

**packages/api-client/**
- Purpose: Auto-generated TypeScript client from OpenAPI spec
- Generated by: OpenAPI Generator from Swagger schema
- Regenerated by: `npm run codegen` command

## Key File Locations

**Entry Points:**
- `apps/api/src/main.ts`: API server bootstrap (port 3100)
- `apps/transactions-fetcher/src/main.ts`: Transactions fetcher bootstrap (port 3200)

**Configuration:**
- `turbo.json`: Turborepo tasks and caching rules
- `package.json`: Root workspace configuration
- `tsconfig.json`: Root TypeScript settings
- `docker-compose.yml`: Local PostgreSQL + service orchestration

**Core Logic:**
- `apps/api/src/auth/auth.service.ts`: Authentication business logic
- `apps/transactions-fetcher/src/scraping/scraping.service.ts`: Bank scraping orchestration
- `apps/transactions-fetcher/src/transactions/transactions.service.ts`: Transaction fetch & persist workflow

**Database:**
- `packages/database/prisma/schema.prisma`: All data models (users, transactions, bank_accounts, credit_cards)
- `packages/database/src/prisma.service.ts`: NestJS wrapper for Prisma client

**Testing:**
- `apps/api/src/auth/auth.service.test.ts`: Unit tests for auth service
- `apps/api/src/auth/auth.controller.test.ts`: Unit tests for auth controller
- `apps/api/src/auth/utils/password.util.test.ts`: Tests for password utilities

## Naming Conventions

**Files:**
- Controllers: `{feature}.controller.ts` (e.g., `auth.controller.ts`)
- Services: `{feature}.service.ts` (e.g., `auth.service.ts`)
- Modules: `{feature}.module.ts` (e.g., `auth.module.ts`)
- Strategies: `{name}.strategy.ts` (e.g., `discount.strategy.ts`)
- Guards: `{name}.guard.ts` (e.g., `jwt-auth.guard.ts`)
- DTOs: `{name}.dto.ts` (e.g., `login.dto.ts`)
- Decorators: `{name}.decorator.ts` (e.g., `auth.decorator.ts`)
- Utilities: `{name}.util.ts` (e.g., `password.util.ts`)
- Tests: `{file}.test.ts` (NOT `.spec.ts`)
- Types: `{name}.type.ts` (e.g., `scraping-strategy.type.ts`)

**Directories:**
- Feature folders: lowercase, plural for groups (e.g., `auth`, `strategies`, `services`, `dto`)
- Utilities: `utils/`, `helpers/`, `factories/`, `types/`, `constants/`

## Where to Add New Code

**New API Endpoint:**
- Implementation: `apps/api/src/{feature}/{feature}.controller.ts`
- Service logic: `apps/api/src/{feature}/{feature}.service.ts`
- DTO: `apps/api/src/{feature}/dto/{name}.dto.ts`
- Module: `apps/api/src/{feature}/{feature}.module.ts`
- Import module in: `apps/api/src/app.module.ts`

**New Bank Strategy:**
- File: `apps/transactions-fetcher/src/scraping/strategies/{bank}.strategy.ts`
- Implement: ScrapingStrategy type interface
- Register in: `apps/transactions-fetcher/src/scraping/scraping.service.ts` (strategies map)
- Export from: `apps/transactions-fetcher/src/scraping/scraping.module.ts`

**New Database Model:**
- Schema: `packages/database/prisma/schema.prisma`
- After editing: Run `npx prisma generate` to update types
- Export from: `packages/database/src/index.ts` (auto-exported from @prisma/client)

**New Shared Utility:**
- File: `packages/libs/src/{category}.ts` (e.g., `array.ts`, `string.ts`)
- Export from: `packages/libs/src/index.ts`
- Usage: Import from `@finance/libs`

**New Test:**
- File: `{target-file}.test.ts` in same directory as implementation
- Framework: Jest (configured in app's package.json)
- Run: `cd apps/{app} && npm run test`

## Special Directories

**node_modules/:**
- Purpose: Dependencies cache
- Generated: Yes (by npm install)
- Committed: No (in .gitignore)

**.turbo/**
- Purpose: Turborepo cache and daemon
- Generated: Yes (by turbo)
- Committed: No (in .gitignore)

**dist/**
- Purpose: Compiled JavaScript output
- Generated: Yes (by build task)
- Committed: No (in .gitignore)

**.planning/codebase/**
- Purpose: GSD codebase analysis documents
- Generated: Yes (by GSD mapping commands)
- Committed: Yes (guides future development)

**packages/api-client/src/**
- Purpose: Auto-generated API client
- Generated: Yes (by `npm run codegen` from OpenAPI spec)
- Committed: Yes (regenerated but committed for safety)
- Note: Do not manually edit (changes will be overwritten)

**prisma/**
- Purpose: Database schema and migration files
- Generated: No (schema is manually maintained)
- Committed: Yes (required for development)

---

*Structure analysis: 2026-01-30*
