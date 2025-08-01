# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a Turborepo monorepo containing a finance application with authentication features:

- **apps/api**: NestJS backend API
- **packages/api-client**: TypeScript client for the API, used in the frontend, generated from OpenAPI spec
- **packages/libs**: Shared libraries and utilities
- **packages/database**: Database package for shared database logic and schema and types

## Common Commands

### Development
```bash
# Start all apps in development mode
turbo dev

# Start only the web app
trubo dev --filter=web

# Start only the API
turbo dev --filter=api
```

### Building
```bash
# Build all apps
turbo build

# Build web app only
turbo build --filter=web

# Build API only
turbo build --filter=api
```

### Testing
```bash
# Run API tests
cd apps/api && npm run test

# Run API tests in watch mode
cd apps/api && npm run test:watch

# Run API e2e tests
cd apps/api && npm run test:e2e

# Run web app unit tests
cd apps/web && npm run test

# Run web app unit tests in watch mode
cd apps/web && npm run test:watch

# Run web app e2e tests with Cypress (interactive)
cd apps/web && npm run e2e:open

# Run web app e2e tests with Cypress (headless)
cd apps/web && npm run e2e
```

### Linting and Formatting
```bash
# Lint all apps
npm run lint

# Format all files
npm run format

# Lint specific app
cd apps/web && npm run lint
cd apps/api && npm run lint
```

### Docker
```bash
# Build Docker containers
npm run docker:build

# Start containers
npm run docker:up

# Stop containers
npm run docker:down
```

## Architecture Overview

[//]: # (### Frontend &#40;apps/web&#41;)

[//]: # (- **Router**: TanStack Router with file-based routing in `src/routes/`)

[//]: # (- **State Management**: TanStack Query for server state, React Context for auth)

[//]: # (- **Authentication**: Supabase auth with protected routes and persistent sessions)

[//]: # (- **UI**: Tailwind CSS with DaisyUI components)

[//]: # (- **Data Fetching**: Custom hooks in `src/hooks/requests/` using TanStack Query)

[//]: # (- **Component Structure**: Organized by feature with co-located types and hooks)

[//]: # (- **Icons**: Uses `react-icons` for icons)

[//]: # (- **Components Files Naming**: Components are named with kebab-case, e.g., `pokemon-card.tsx`, `pokemon-list.tsx`)

[//]: # (- **Forms**: Uses `react-hook-form` for form handling and validation with zod adapted for type safety)

### Backend (apps/api)
- **Framework**: NestJS with TypeScript
- **API Documentation**: Swagger/OpenAPI with code generation
- **Database**: Uses `@finance/database` package
- **Code Generation**: `npm run codegen` generates TypeScript client from OpenAPI spec

### Patterns
- **Monorepo**: Managed with Turborepo for efficient builds and shared dependencies
- **Code Generation**: Uses OpenAPI for API client generation, ensuring type safety
- **Shared Libraries**: Common utilities and types in `packages/libs`
- **Zod Validation**: Uses Zod for schema validation in API requests and responses

### TypeScript Usage and Patterns
- **Strict Mode**: TypeScript is configured in strict mode for type safety
- **as & any Usage**: Avoided in favor of explicit types
- **Type vs Interface**: Prefer `type` over `interface` for defining types, especially for complex objects
- **Generics**: Extensively used for reusable components and hooks
- **Utility Types**: Utilizes TypeScript utility types like `Partial`, `Pick`, and `Record` for type transformations
- **Variables naming**: Consistent naming conventions across the codebase, don't write short variable names like `e`, `err`, `res`, etc. Use descriptive names like `event`, `error`, `response`, etc.

### Key Frontend Patterns
- **Component Organization**: Each major component has its own folder with types, hooks, and constants
- **Custom Hooks**: Extensive use of custom hooks for data fetching (`use-finance.ts`, `use-auth.ts`, etc.)
- **Error Handling**: Error boundaries and Suspense for loading states
- **Authentication Flow**: Context-based auth with automatic redirects

### Type Safety in Tests
- **Minimize `any` usage**: Only use for mocking external dependencies
- **Avoid `as` for business objects**: Use factory functions instead
- **Leverage TypeScript**: Tests should catch type errors too
- **Document exceptions**: If you must use `any`, add a comment explaining why
- **Use `@ts-expect-error`**: For testing invalid inputs, be explicit:

```typescript
// @ts-expect-error: Testing invalid input handling
const result = createTeam({ invalidField: 'value' });
```

### Testing
- **Test files naming**: Test files should be named with .test and no other format.


### Code Generation
- API client generation: `cd apps/api && npm run codegen`
- Route tree generation: Automatic via TanStack Router plugin