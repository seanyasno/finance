# Technology Stack

**Analysis Date:** 2026-01-30

## Languages

**Primary:**
- TypeScript 5.1.3 - Used across all applications and packages (backend, scraper, shared libraries)

**Secondary:**
- JavaScript - Runtime for Node.js environments

## Runtime

**Environment:**
- Node.js 18+ (per package.json engines configuration)

**Package Manager:**
- npm 10.2.0
- Lockfile: `package-lock.json` (standard npm lockfile)

## Frameworks

**Core (Backend):**
- NestJS 10.4.1 - Framework for `apps/api` and `apps/transactions-fetcher`
  - `@nestjs/core` 10.0.0 - Core NestJS functionality
  - `@nestjs/common` 10.4.1 - Common decorators and utilities
  - `@nestjs/platform-express` 10.0.0 - Express adapter for NestJS

**Authentication:**
- `@nestjs/jwt` 11.0.0 - JWT token generation and validation
- `@nestjs/passport` 11.0.5 - Passport integration for authentication strategies
- `passport` 0.7.0 - Authentication middleware
- `passport-jwt` 4.0.1 - JWT strategy for Passport

**API Documentation:**
- `@nestjs/swagger` 7.3.1 - Swagger/OpenAPI documentation
- `nestjs-zod` 3.0.0 - Zod validation integration with NestJS

**Configuration:**
- `@nestjs/config` 4.0.2 - Configuration management from environment variables

**Testing (Backend):**
- `@nestjs/testing` 10.0.0 - NestJS testing utilities
- `jest` 29.5.0 - Test runner
- `ts-jest` 29.1.0 - TypeScript support for Jest
- `@golevelup/ts-jest` 0.7.0 - Enhanced Jest TypeScript support
- `jest-mock-extended` 4.0.0 - Advanced mocking for Jest
- `supertest` 7.1.3 - HTTP assertion library for testing Express/NestJS

## Database & ORM

**Database:**
- PostgreSQL 16 (via Docker) - Primary relational database
- Prisma 6.11.1 - ORM for database operations (`@prisma/client` 6.11.1)

**Database Package:**
- `@finance/database` - Custom package containing Prisma schema and database utilities
  - Located: `packages/database/`
  - Exports: PrismaService and database types

## Validation & Data Transformation

**Validation:**
- Zod 3.23.8 - Schema validation for API requests/responses
- `class-validator` 0.14.1 - Class-based validation (NestJS compatibility)
- `class-transformer` 0.5.1 - DTO transformation and serialization

## Security & Middleware

**Security:**
- bcrypt 6.0.0 - Password hashing and verification
- helmet 8.1.0 - Security HTTP headers middleware
- cookie-parser 1.4.7 - Cookie parsing middleware

## Code Scraping (transactions-fetcher)

**Web Scraping:**
- `israeli-bank-scrapers` 6.7.0 - Bank and credit card transaction scraping
- `puppeteer` 24.15.0 - Headless browser automation
- `enquirer` 2.4.1 - CLI prompts for interactive user input

## Monorepo & Build

**Monorepo:**
- Turborepo 2.5.4 - Monorepo task orchestration and caching

**Build Tools:**
- TypeScript 5.1.3 - Language compiler
- `tsup` 8.1.0 - Bundle builder for libraries
- `nest build` (via `@nestjs/cli` 10.3.2) - NestJS application bundler

**CLI:**
- `@nestjs/cli` 10.3.2 - NestJS command-line interface
- `@nestjs/schematics` 10.0.0 - Code generation templates

## Code Quality

**Linting:**
- ESLint 8.42.0 - JavaScript/TypeScript linting
- `@typescript-eslint/eslint-plugin` 6.0.0 - TypeScript-specific rules
- `@typescript-eslint/parser` 6.0.0 - TypeScript parser for ESLint
- `eslint-plugin-prettier` 5.0.0 - Prettier integration
- `eslint-plugin-turbo` 2.5.4 - Turborepo-specific linting rules
- `@finance/eslint-config` - Custom shared ESLint configuration

**Formatting:**
- Prettier 3.2.4 - Code formatter

**Pre-commit Hooks:**
- Husky 8.0.3 - Git hooks management
- `lint-staged` 15.2.7 - Run linters on staged files

## Shared Packages

**Custom Libraries:**
- `@finance/libs` - Shared utilities and helpers
- `@finance/typescript-config` - Shared TypeScript configuration
- `@finance/api-client` - Generated TypeScript API client (via OpenAPI codegen)
- `@finance/eslint-config` - Shared ESLint rules and configuration

## Code Generation

**API Client Generation:**
- `@openapitools/openapi-generator-cli` 2.13.4 - OpenAPI code generator
- Generated from: `http://localhost:3100/api-json` (Swagger endpoint)
- Output: TypeScript Axios client in `packages/api-client/src`

## Development Dependencies

**Type Definitions:**
- `@types/node` 20.14.9 - Node.js type definitions
- `@types/express` 4.17.17 - Express framework types
- `@types/bcrypt` 6.0.0 - bcrypt type definitions
- `@types/jest` 29.5.12 - Jest type definitions
- `@types/passport-jwt` 4.0.1 - Passport JWT type definitions
- `@types/cookie-parser` 1.4.9 - cookie-parser type definitions
- `@types/supertest` 6.0.3 - supertest type definitions

**Development Utilities:**
- `ts-loader` 9.4.3 - TypeScript loader for Webpack
- `ts-node` 10.9.1 - TypeScript execution for Node.js
- `tsconfig-paths` 4.2.0 - TypeScript path alias support
- `source-map-support` 0.5.21 - Source map debugging support
- `reflect-metadata` 0.1.13 - Metadata reflection for decorators

## Configuration Files

**TypeScript:**
- `tsconfig.json` - Extends `@finance/typescript-config/base.json`
- `tsconfig.build.json` (per-app) - Build configuration with path mappings

**Environment:**
- `.env` - Runtime environment variables
- `.env.example` - Example environment variables template
- Key apps with env configs:
  - `apps/api/.env.example` - API server configuration
  - `packages/database/.env.example` - Database connection configuration

**Docker:**
- `docker-compose.yml` - PostgreSQL 16 service definition
  - Database: `finance` on `localhost:5432`
  - Credentials: postgres/postgres

## Platform Requirements

**Development:**
- Node.js 18+ required
- npm 10.2.0
- Docker and docker-compose (for PostgreSQL)
- Unix-like system recommended (bash scripts in package.json)

**Production:**
- Node.js 18+ runtime
- PostgreSQL 16+ database (or compatible)
- Environment variables for configuration

---

*Stack analysis: 2026-01-30*
