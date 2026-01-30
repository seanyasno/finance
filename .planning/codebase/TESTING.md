# Testing Patterns

**Analysis Date:** 2026-01-30

## Test Framework

**Runner:**
- Jest 29.5.0
- Config: Inline in `apps/api/package.json`
```json
{
  "jest": {
    "moduleFileExtensions": ["js", "json", "ts"],
    "rootDir": "src",
    "testRegex": ".*\\.test\\.ts$",
    "transform": {
      "^.+\\.(t|j)s$": "ts-jest"
    },
    "collectCoverageFrom": ["**/*.(t|j)s"],
    "coverageDirectory": "../coverage",
    "testEnvironment": "node"
  }
}
```

**Assertion Library:**
- Jest built-in matchers (`.toBe()`, `.toEqual()`, `.toHaveBeenCalledWith()`, etc.)
- `expect()` syntax throughout

**Run Commands:**
```bash
npm run test              # Run all tests
npm run test:watch       # Watch mode for active development
npm run test:cov         # Coverage report
npm run test:debug       # Debug with node inspector
npm run test:e2e         # End-to-end tests (not configured yet)
```

## Test File Organization

**Location:**
- Co-located with source files (same directory)
- Example: `auth.service.ts` and `auth.service.test.ts` in same folder

**Naming:**
- Pattern: `[feature].[layer].test.ts`
- Examples:
  - `auth.service.test.ts`
  - `auth.controller.test.ts`
  - `password.util.test.ts`
- Must match test regex: `.*\.test\.ts$`

**Structure:**
```
src/
├── auth/
│   ├── auth.service.ts
│   ├── auth.service.test.ts
│   ├── auth.controller.ts
│   ├── auth.controller.test.ts
│   ├── dto/
│   ├── guards/
│   ├── strategies/
│   └── utils/
│       ├── password.util.ts
│       └── password.util.test.ts
```

## Test Structure

**Suite Organization:**
```typescript
describe('AuthService', () => {
  let service: AuthService;
  let prismaService: jest.Mocked<PrismaService>;
  let jwtService: jest.Mocked<JwtService>;
  let configService: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    // Module setup
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: createMock<JwtService>(),
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get(PrismaService);
    jwtService = module.get(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      // test body
    });
  });
});
```

**Patterns:**

1. **Setup (beforeEach):**
   - Create NestJS TestingModule using `Test.createTestingModule()`
   - Mock all dependencies with `createMock<T>()` or manual Jest mocks
   - Get service instance via `.get<T>()`
   - Set default mock return values (e.g., `configService.get.mockImplementation()`)

2. **Teardown (afterEach):**
   - Always call `jest.clearAllMocks()` to reset mock state between tests

3. **Assertion Pattern:**
   - Arrange: set up mocks and input data
   - Act: call the function being tested
   - Assert: verify return value and mock calls
```typescript
it('should successfully register a new user', async () => {
  // Arrange
  prismaService.users.findUnique.mockResolvedValue(null);
  prismaService.users.create.mockResolvedValue(mockUser);

  // Act
  const result = await service.register(registerDto, mockResponse);

  // Assert
  expect(prismaService.users.findUnique).toHaveBeenCalledWith({
    where: { email: registerDto.email },
  });
  expect(result).toEqual({
    user: { ... },
    message: 'Registration successful',
  });
});
```

## Mocking

**Framework:**
- Jest built-in mocking
- `@golevelup/ts-jest` for `createMock<T>()` helper (type-safe mocking)

**Patterns:**

1. **Module-level mocking:**
```typescript
import * as passwordUtil from './utils/password.util';

jest.mock('./utils/password.util');

describe('AuthService', () => {
  // Then use:
  (passwordUtil.hashPassword as jest.Mock).mockResolvedValue(hash);
});
```

2. **Service mocking with createMock:**
```typescript
{
  provide: JwtService,
  useValue: createMock<JwtService>(),
}
```

3. **Mocking external module functions:**
```typescript
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('Password Utility', () => {
  const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

  it('should hash password with bcrypt', async () => {
    mockedBcrypt.hash.mockResolvedValue(hashedPassword as never);
    const result = await hashPassword(password);
    expect(mockedBcrypt.hash).toHaveBeenCalledWith(password, 10);
  });
});
```

**What to Mock:**
- External service calls (Prisma, JWT, Config)
- Third-party libraries (bcrypt, database)
- All dependencies injected into service constructor
- HTTP responses and cookies

**What NOT to Mock:**
- Pure utility functions in same module (test directly)
- Business logic of service being tested (unless it's a side-effect)
- Small helper functions unless they're external dependencies

## Test Data & Fixtures

**Mock Objects:**
```typescript
const mockUser = {
  id: 'user-id-123',
  email: 'test@example.com',
  password: '$2b$10$hashedPassword',
  firstName: 'John',
  lastName: 'Doe',
  created_at: new Date('2024-01-01T00:00:00Z'),
  updated_at: new Date('2024-01-01T00:00:00Z'),
};

const mockToken = 'jwt-token-123';
```

**DTO Test Data:**
```typescript
const registerDto: RegisterDto = {
  email: 'test@example.com',
  password: 'password123',
  firstName: 'John',
  lastName: 'Doe',
};
```

**Location:**
- Defined at module level in test file (inside `describe` block)
- Reused across multiple test cases
- Prefixed with `mock` for clarity

## Coverage

**Requirements:** Not enforced (no coverage thresholds found)

**View Coverage:**
```bash
npm run test:cov
```

Coverage artifacts are generated to `../coverage/` directory (relative to API root).

## Test Types

**Unit Tests:**
- Scope: Individual services and utilities
- Approach: Test one unit with all dependencies mocked
- Location: `*.service.test.ts`, `*.util.test.ts`
- Examples:
  - `auth.service.test.ts` - tests AuthService with mocked Prisma, JWT, Config
  - `password.util.test.ts` - tests password utilities with mocked bcrypt
  - `auth.controller.test.ts` - tests controller with mocked AuthService

**Integration Tests:**
- Scope: Not detected in current codebase
- Would test multiple units working together
- Could test AuthService with real database

**E2E Tests:**
- Framework: Not configured
- Config file referenced: `jest --config ./test/jest-e2e.json`
- Not yet implemented

## Common Patterns

**Async Testing:**
```typescript
it('should successfully register a new user', async () => {
  // Use async/await in test functions
  const result = await service.register(registerDto, mockResponse);

  // Use async matchers
  await expect(service.register(...)).rejects.toThrow(...);
});
```

**Error Testing:**
```typescript
it('should throw ConflictException when user already exists', async () => {
  prismaService.users.findUnique.mockResolvedValue(mockUser);

  await expect(
    service.register(registerDto, mockResponse),
  ).rejects.toThrow(
    new ConflictException('User with this email already exists'),
  );

  expect(passwordUtil.hashPassword).not.toHaveBeenCalled();
});
```

**Multiple Mock Return Values:**
```typescript
it('should handle different passwords', async () => {
  mockedBcrypt.hash
    .mockResolvedValueOnce(hash1 as never)
    .mockResolvedValueOnce(hash2 as never);

  const result1 = await hashPassword(password1);
  const result2 = await hashPassword(password2);

  expect(result1).toBe(hash1);
  expect(result2).toBe(hash2);
});
```

**Conditional Mock Behavior:**
```typescript
beforeEach(() => {
  configService.get.mockImplementation((key: string) => {
    switch (key) {
      case 'COOKIE_SECURE':
        return 'false';
      case 'COOKIE_SAME_SITE':
        return 'lax';
      case 'COOKIE_DOMAIN':
        return 'localhost';
      default:
        return undefined;
    }
  });
});
```

**Partial Mock Assertions:**
```typescript
expect(mockResponse.cookie).toHaveBeenCalledWith(
  'auth-token',
  mockToken,
  expect.objectContaining({
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
  }),
);
```

**Testing Null/Undefined Handling:**
```typescript
it('should return null user when user is not provided', async () => {
  // Use `as any` when intentionally testing invalid input
  const result = await controller.getCurrentUser(null as any);
  expect(result).toEqual({ user: null });
});
```

## NestJS Testing Patterns

**Using @nestjs/testing:**
```typescript
import { Test, TestingModule } from '@nestjs/testing';

const module: TestingModule = await Test.createTestingModule({
  controllers: [AuthController],
  providers: [
    {
      provide: AuthService,
      useValue: createMock<AuthService>(),
    },
  ],
}).compile();

controller = module.get<AuthController>(AuthController);
authService = module.get(AuthService);
```

**Controller Testing:**
- Mock all service dependencies
- Test only route handling logic
- Example: `apps/api/src/auth/auth.controller.test.ts`

**Service Testing:**
- Mock all external service dependencies (Prisma, JWT, Config)
- Test business logic
- Example: `apps/api/src/auth/auth.service.test.ts`

---

*Testing analysis: 2026-01-30*
