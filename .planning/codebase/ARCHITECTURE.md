# Architecture

**Analysis Date:** 2026-01-30

## Pattern Overview

**Overall:** Modular Monorepo with NestJS-based Microservices Architecture

**Key Characteristics:**
- Turborepo-managed monorepo with multiple independent applications
- NestJS as the core framework for all Node.js applications
- Module-based dependency injection with clear separation of concerns
- Strategy pattern for extensible, pluggable business logic
- Shared packages for common functionality (database, utilities, API client)
- JWT-based authentication with cookie-based token storage

## Layers

**API Application (`apps/api`):**
- Purpose: Main backend API providing authentication and user management endpoints
- Location: `apps/api/src`
- Contains: Controllers, services, authentication logic, DTOs, guards, strategies
- Depends on: `@finance/database`, `@nestjs/*`, `passport-jwt`
- Used by: External clients (web, mobile) via REST API

**Transactions Fetcher (`apps/transactions-fetcher`):**
- Purpose: Standalone NestJS service for scraping financial data from Israeli banks
- Location: `apps/transactions-fetcher/src`
- Contains: Scraping strategies, transaction controllers, persistence logic, configuration
- Depends on: `israeli-bank-scrapers`, `@finance/database`
- Used by: Scheduled jobs or manual triggers to fetch and persist transaction data

**Database Package (`packages/database`):**
- Purpose: Shared database abstraction and connection management
- Location: `packages/database/src`
- Contains: Prisma service, module definition, schema management
- Depends on: Prisma ORM, PostgreSQL
- Used by: Both API and transactions-fetcher apps

**Shared Libraries (`packages/libs`):**
- Purpose: Common utility functions and types used across applications
- Location: `packages/libs/src`
- Contains: Type guards, array/object/string utilities, error handling helpers
- Depends on: None (utility-only)
- Used by: All applications

**API Client (`packages/api-client`):**
- Purpose: Auto-generated TypeScript client for API consumption
- Location: `packages/api-client/src`
- Contains: API stubs, configuration, types (auto-generated from OpenAPI spec)
- Depends on: Generated from Swagger/OpenAPI
- Used by: Frontend and external consumers

## Data Flow

**Authentication Flow (Login/Register):**

1. Client sends credentials to `AuthController` (POST /auth/login or /auth/register)
2. `AuthController` validates input via Zod validation pipe
3. `AuthService` queries `PrismaService` to check/create user
4. Password hashing via `password.util` (bcrypt)
5. `JwtService` generates signed JWT token
6. Token set as httpOnly cookie via `setAuthCookie`
7. User data returned in response

**Protected Request Flow (Auth Guard):**

1. Client sends request with `Authorization: Bearer <token>` or cookie
2. `JwtAuthGuard` extracts token from cookies via `JwtStrategy`
3. `JwtStrategy.validate()` decodes token, verifies signature, fetches user from database
4. User object injected into request context
5. `@CurrentUser()` decorator extracts user for handler use
6. If guard validation fails, `UnauthorizedException` thrown

**Transaction Fetch & Persist Flow:**

1. `TransactionsController` receives request (GET /transactions/fetch)
2. `TransactionsService.fetchAllTransactions()` calls `ScrapingService` in parallel for all 5 companies
3. `ScrapingService` delegates to strategy-specific implementations (DiscountStrategy, IsracardStrategy, etc.)
4. Strategy returns mock or real transaction data via `israeli-bank-scrapers`
5. `TransactionPersistenceService` maps and persists transactions to database
6. `BankAccountService` and `CreditCardService` upsert account records
7. Transactions upserted via Prisma transaction to maintain consistency
8. Response returned to controller

**State Management:**

- Request-scoped: User context attached to Express request via Passport
- Module-scoped: Services are singletons managed by NestJS DI container
- Database-scoped: Prisma client manages connection pooling and transactions
- Configuration-scoped: Environment variables loaded globally via ConfigModule

## Key Abstractions

**AuthService:**
- Purpose: Encapsulates authentication business logic (registration, login, logout)
- Examples: `apps/api/src/auth/auth.service.ts`
- Pattern: Injectable service with dependency injection
- Responsibilities: User creation/lookup, password hashing, JWT generation, cookie management

**ScrapingService:**
- Purpose: Abstracts bank scraping logic using strategy pattern
- Examples: `apps/transactions-fetcher/src/scraping/scraping.service.ts`
- Pattern: Strategy pattern with strategy map (CompanyTypes → Strategy implementations)
- Responsibilities: Routing to correct strategy, handling mock vs. real data, error handling

**ScrapingStrategy (Type):**
- Purpose: Contract for individual bank/credit card scraping implementations
- Examples: `apps/transactions-fetcher/src/scraping/strategies/*.ts`
- Pattern: Structural typing with interface-like contract
- Methods: `getCredentials()`, `getOptions()`, `getMockData()`

**TransactionPersistenceService:**
- Purpose: Handles transaction mapping and database persistence
- Examples: `apps/transactions-fetcher/src/database/services/transaction-persistence.service.ts`
- Pattern: Repository pattern with transaction support
- Responsibilities: Upsert logic, transaction mapping, account management

**PrismaService:**
- Purpose: NestJS wrapper around Prisma client with lifecycle management
- Examples: `packages/database/src/prisma.service.ts`
- Pattern: Provider with OnModuleInit/OnModuleDestroy hooks
- Responsibilities: Connection lifecycle, transaction management, global availability

**DatabaseModule:**
- Purpose: Global module providing database access to all applications
- Examples: `packages/database/src/prisma.module.ts`
- Pattern: Global NestJS module with @Global() decorator
- Characteristics: Exported once at root, available to all consumers without explicit import

## Entry Points

**API Server:**
- Location: `apps/api/src/main.ts`
- Triggers: `npm run dev` or production runtime
- Responsibilities: Bootstrap NestJS app, configure middleware (helmet, CORS, cookies), setup Swagger documentation, listen on port 3100

**Transactions Fetcher Server:**
- Location: `apps/transactions-fetcher/src/main.ts`
- Triggers: `npm run dev` or production runtime
- Responsibilities: Bootstrap NestJS app, listen on port 3200, expose transaction endpoints

**App Modules:**
- `apps/api/src/app.module.ts`: Root module importing ConfigModule, AuthModule
- `apps/transactions-fetcher/src/app.module.ts`: Root module importing ConfigModule, TransactionsModule

## Error Handling

**Strategy:** NestJS exception filters with HTTP status mapping

**Patterns:**

- `BadRequestException`: Invalid input, validation errors (DTO validation pipe)
- `UnauthorizedException`: Authentication failures, invalid credentials, missing/expired tokens
- `ConflictException`: Resource conflicts (duplicate user email)
- Custom error propagation: Thrown errors from services → automatically mapped to HTTP responses
- Async error handling: try/catch in service methods, thrown errors bubble to exception filters

## Cross-Cutting Concerns

**Logging:** Console-based (console.log, console.error) in services and strategies; no structured logging framework

**Validation:**
- Zod schemas at module level (via nestjs-zod)
- ZodValidationPipe registered globally in AppModule
- DTOs define request/response validation

**Authentication:**
- JWT-based with Passport.js
- Strategy: JwtStrategy extracts token from httpOnly cookies
- Guard: JwtAuthGuard enforces authentication on protected routes
- Decorator: @CurrentUser() injects authenticated user into handlers

**Configuration:**
- ConfigModule loads .env variables globally
- Services access via ConfigService.get()
- Critical configs: JWT_SECRET, FRONTEND_URL, DATABASE_URL, DIRECT_URL

**Dependency Injection:**
- NestJS providers system
- Singletons by default (application-scoped)
- Explicit exports for cross-module consumption
- Global modules (DatabaseModule) available everywhere

---

*Architecture analysis: 2026-01-30*
