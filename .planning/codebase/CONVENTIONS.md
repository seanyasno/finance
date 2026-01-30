# Coding Conventions

**Analysis Date:** 2026-01-30

## Naming Patterns

**Files:**
- PascalCase for classes and services: `auth.service.ts`, `auth.controller.ts`, `password.util.ts`
- kebab-case for module/feature folders: `auth/`, `dto/`, `guards/`, `strategies/`, `utils/`
- Test files: `.test.ts` suffix (not `.spec.ts`): `auth.service.test.ts`, `password.util.test.ts`
- DTO files: `*.dto.ts`: `register.dto.ts`, `login.dto.ts`, `auth-response.dto.ts`
- Utility files: `.util.ts`: `password.util.ts`

**Functions:**
- camelCase for function names: `hashPassword()`, `verifyPassword()`, `generateJwtToken()`
- Private functions prefixed with `private`: `private generateJwtToken()`, `private setAuthCookie()`
- Async functions use standard async/await pattern, no callback naming conventions

**Variables:**
- camelCase: `mockUser`, `registerDto`, `mockResponse`, `existingUser`, `hashedPassword`
- Descriptive names, avoid single letters: use `email` not `e`, `error` not `err`, `response` not `res`
- Boolean variables: `isPasswordValid`, `isNullOrUndefined()`
- Mock/test data: `mock` prefix: `mockUser`, `mockToken`, `mockResponse`, `mockResult`

**Types/Interfaces:**
- PascalCase for types and interfaces: `RegisterDto`, `LoginDto`, `AuthUser`, `AuthService`
- DTO classes extend `createZodDto()`: `export class RegisterDto extends createZodDto(RegisterSchema) {}`
- Schema objects use uppercase snake_case: `RegisterSchema`, `LoginSchema`
- Response DTOs: `AuthResponseDto`, `UserResponseDto`, `MessageResponseDto`

## Code Style

**Formatting:**
- Tool: Prettier 3.2.4
- Settings:
  - Single quotes: `true`
  - Trailing comma: `'all'`
  - Semicolons: included
  - Tab width: 2 spaces (default)

**Linting:**
- Tool: ESLint with TypeScript support
- Base config: `@finance/eslint-config/library.js` for libraries, custom config for apps
- Key rules in API (`apps/api/.eslintrc.js`):
  - `@typescript-eslint/interface-name-prefix`: off
  - `@typescript-eslint/explicit-function-return-type`: off
  - `@typescript-eslint/explicit-module-boundary-types`: off
  - `@typescript-eslint/no-explicit-any`: off (relaxed in API, but discouraged in production code)
- Plugins: `@typescript-eslint/eslint-plugin`, `eslint-plugin-prettier`
- Only warnings used (not errors) in some configs

## Import Organization

**Order:**
1. NestJS core imports (from `@nestjs/*`)
2. Third-party libraries (Express, external packages)
3. Local project imports (from `@finance/*`)
4. Relative local imports (`./*` or `./utils/*`)

**Example from `auth.service.ts`:**
```typescript
import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { PrismaService } from '@finance/database';
import { RegisterDto, LoginDto } from './dto';
import { hashPassword, verifyPassword } from './utils/password.util';
```

**Path Aliases:**
- `@finance/database` → `packages/database`
- `@finance/libs` → `packages/libs`
- `@finance/typescript-config` → `packages/typescript-config`
- `@finance/eslint-config` → `packages/eslint-config`

**Barrel Files:**
- Used for DTO exports: `apps/api/src/auth/dto/index.ts`
```typescript
export * from './register.dto';
export * from './login.dto';
export * from './auth-response.dto';
```

## Error Handling

**Patterns:**
- Use NestJS built-in exceptions: `BadRequestException`, `UnauthorizedException`, `ConflictException`
- Example from `auth.service.ts`:
```typescript
if (existingUser) {
  throw new ConflictException('User with this email already exists');
}

if (!user) {
  throw new UnauthorizedException('Invalid email or password');
}
```
- Validation errors automatically handled by Zod via `ZodValidationPipe`
- Strategy validation throws appropriate errors: `throw new UnauthorizedException('...')`

## Logging

**Framework:** Console (no structured logging library detected)

**Patterns:**
- Bootstrap logs: `console.log()` in `main.ts`
- Error validation logs optional
- No debug logging pattern enforced

## Comments

**JSDoc/TSDoc:**
- Used for utility functions with `@param` and `@returns` tags
- Example from `password.util.ts`:
```typescript
/**
 * Hashes a plain text password using bcrypt
 * @param password - The plain text password to hash
 * @returns The hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}
```

**When to Comment:**
- Explain WHY, not WHAT: e.g., "// 7 days" for cookie maxAge
- Functional steps in complex methods: "// Check if user already exists"
- Configuration choices: "// Set auth cookie", "// Clear auth cookie"
- Inline comments for complex logic or non-obvious decisions

**Minimal inline comments:**
- Code should be self-documenting through good naming
- Only comment non-obvious business logic or workarounds

## Function Design

**Size:**
- Prefer small, focused functions under 30 lines
- Services use private helper methods for common operations
- Example: `private generateJwtToken()`, `private setAuthCookie()`, `private clearAuthCookie()`

**Parameters:**
- Use destructuring for object parameters in DTOs
- Example from `auth.service.ts`:
```typescript
async register(
  { email, password, firstName, lastName }: RegisterDto,
  response: Response,
)
```
- Pass response object when side-effects needed (cookie setting)
- Limit parameters: refactor to objects if more than 3 parameters

**Return Values:**
- Use typed return objects
- Example:
```typescript
return {
  user: {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    createdAt: user.created_at.toISOString(),
  },
  message: 'Registration successful',
};
```
- Include response DTOs for all controller endpoints

## Module Design

**Exports:**
- NestJS modules export services and guards for use elsewhere
- Example from `auth.module.ts`:
```typescript
@Module({
  imports: [...],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard],
  exports: [AuthService, JwtAuthGuard, JwtStrategy],
})
```

**Nested Modules:**
- Use feature-based folder structure: `auth/`, `auth/dto/`, `auth/guards/`, `auth/strategies/`, `auth/utils/`
- Barrel exports via index.ts for clean imports

**Decoration:**
- Use NestJS decorators for cross-cutting concerns
- Controllers: `@Controller()`, `@Post()`, `@Get()`, `@UseGuards()`
- Services: `@Injectable()`
- Custom decorators for auth: `@CurrentUser()`
- Documentation: `@ApiTags()`, `@ApiOperation()`, `@ApiResponse()`, `@ApiBearerAuth()`

## TypeScript Configuration

**Strict Mode:**
- `noImplicitAny: true`
- `strictNullChecks: true`
- `strictBindCallApply: true`
- `forceConsistentCasingInFileNames: true`
- `noFallthroughCasesInSwitch: true`

**Type Preferences:**
- Use `type` over `interface` (as per CLAUDE.md)
- Avoid `as` and `any` (relaxed in API config but discouraged)
- Use explicit types for service dependencies
- Generics used in test setup: `Test.createTestingModule<T>()`, `createMock<T>()`

---

*Convention analysis: 2026-01-30*
