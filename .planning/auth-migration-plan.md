# Authentication Migration Plan: Supabase to Native NestJS JWT

## Overview
Migrate authentication from Supabase to native NestJS JWT authentication with email/password and store user data in PostgreSQL database.

## Requirements
- ✅ Keep email/password authentication
- ✅ Implement native NestJS JWT auth (remove Supabase)
- ✅ Add password field to users table (with bcrypt hashing)
- ✅ Add firstName/lastName fields to users table (move from metadata)
- ✅ Maintain existing API contract and cookie-based JWT tokens
- ✅ Update all tests to reflect new implementation

## Current State Analysis

### Existing Architecture
- **Auth Service**: Uses SupabaseService for register/login/logout
- **JWT Strategy**: Validates Supabase JWT tokens from cookies
- **JWT Guard**: Protects routes (currently only `/auth/me`)
- **Database**: Users table with id, email, created_at, updated_at
- **Cookie**: `auth-token` cookie with Supabase JWT
- **User metadata**: firstName/lastName stored in Supabase user_metadata

### Dependencies to Remove
- `@supabase/supabase-js` package
- `SupabaseService` class
- Supabase environment variables (SUPABASE_URL, SUPABASE_ANON_KEY, etc.)

### Dependencies to Add
- `bcrypt` for password hashing
- `@types/bcrypt` for TypeScript support

---

## Implementation Plan

### Phase 1: Database Schema Migration
**Goal**: Update Prisma schema to support local authentication

**Tasks**:
1. Update `packages/database/prisma/schema.prisma`:
   - Add `password` field to users model (String, required)
   - Add `firstName` field to users model (String, optional)
   - Add `lastName` field to users model (String, optional)
   - Make `email` field required and unique

2. Generate Prisma migration:
   ```bash
   cd packages/database && npx prisma migrate dev --name add_auth_fields
   ```

3. Update Prisma client:
   ```bash
   cd packages/database && npx prisma generate
   ```

**Schema Changes**:
```prisma
model users {
  id            String          @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  created_at    DateTime        @default(now()) @db.Timestamptz(6)
  updated_at    DateTime        @default(now()) @db.Timestamptz(6)
  email         String          @unique @db.VarChar(255)
  password      String          @db.VarChar(255)
  firstName     String?         @db.VarChar(100)
  lastName      String?         @db.VarChar(100)
  transactions  transactions[]
  bank_accounts bank_accounts[]
  credit_cards  credit_cards[]

  @@schema("public")
}
```

**Validation Criteria**:
- Migration runs successfully without data loss
- Existing users table structure is preserved
- New fields are added correctly

---

### Phase 2: Install Dependencies and Remove Supabase
**Goal**: Update package dependencies

**Tasks**:
1. Install new dependencies:
   ```bash
   cd apps/api && npm install bcrypt
   cd apps/api && npm install -D @types/bcrypt
   ```

2. Remove Supabase dependency:
   ```bash
   cd apps/api && npm uninstall @supabase/supabase-js
   ```

3. Update `.env.example`:
   - Remove Supabase variables
   - Add `JWT_SECRET` variable
   - Keep cookie configuration

**New Environment Variables**:
```env
# JWT Configuration
JWT_SECRET=your-random-secret-key-min-32-chars

# Cookie Configuration (keep existing)
COOKIE_DOMAIN=localhost
COOKIE_SECURE=false
COOKIE_SAME_SITE=lax
COOKIE_MAX_AGE=604800000
```

**Validation Criteria**:
- Dependencies install without errors
- Environment variables are documented

---

### Phase 3: Create Password Hashing Utilities
**Goal**: Create secure password hashing and verification

**Tasks**:
1. Create `apps/api/src/auth/utils/password.util.ts`:
   - `hashPassword(password: string): Promise<string>` - Hash password with bcrypt (salt rounds: 10)
   - `verifyPassword(password: string, hash: string): Promise<boolean>` - Verify password

2. Add unit tests in `apps/api/src/auth/utils/password.util.test.ts`

**Implementation Notes**:
- Use bcrypt salt rounds: 10 (good balance of security and performance)
- Ensure async/await for all bcrypt operations
- Add proper error handling

**Validation Criteria**:
- Password hashing works correctly
- Password verification works for correct and incorrect passwords
- Tests pass with 100% coverage

---

### Phase 4: Update Auth Service
**Goal**: Replace Supabase authentication with native implementation

**Tasks**:
1. Remove `SupabaseService` dependency from `auth.service.ts`

2. Inject `PrismaService` from `@finance/database`

3. Rewrite `register()` method:
   - Check if user with email already exists
   - Hash password using `hashPassword()`
   - Create user in database with Prisma
   - Generate JWT token with user payload
   - Set auth cookie
   - Return user data (without password)

4. Rewrite `login()` method:
   - Find user by email using Prisma
   - Verify password using `verifyPassword()`
   - Generate JWT token
   - Set auth cookie
   - Return user data (without password)

5. Update `logout()` method:
   - Keep existing implementation (clears cookie)

6. Add private method `generateJwtToken(userId: string, email: string)`:
   - Use `@nestjs/jwt` JwtService
   - Payload: `{ sub: userId, email, iat, exp }`
   - Expiration: 7 days (matching cookie maxAge)

7. Update cookie methods to remain the same

**Implementation Notes**:
- Never return password in responses
- Use consistent error messages for security
- Generate JWT with same structure as Supabase for compatibility

**Validation Criteria**:
- Register creates user with hashed password
- Login verifies credentials correctly
- JWT tokens are valid and decode correctly
- Cookies are set with correct options

---

### Phase 5: Update Auth Module
**Goal**: Update module configuration for native JWT

**Tasks**:
1. Update `apps/api/src/auth/auth.module.ts`:
   - Remove `SupabaseService` from providers
   - Update `JwtModule.registerAsync()` to use `JWT_SECRET` instead of `SUPABASE_JWT_SECRET`
   - Import `DatabaseModule` for Prisma access
   - Keep existing providers: `AuthService`, `JwtStrategy`, `JwtAuthGuard`

2. Delete `apps/api/src/auth/supabase.service.ts`

**Module Configuration**:
```typescript
JwtModule.registerAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    secret: configService.get<string>('JWT_SECRET'),
    signOptions: { expiresIn: '7d' },
  }),
  inject: [ConfigService],
})
```

**Validation Criteria**:
- Module imports correctly
- JWT service is available in AuthService
- No Supabase references remain

---

### Phase 6: Update JWT Strategy
**Goal**: Update JWT validation for native tokens

**Tasks**:
1. Update `apps/api/src/auth/strategies/jwt.strategy.ts`:
   - Change secret from `SUPABASE_JWT_SECRET` to `JWT_SECRET`
   - Keep cookie extraction logic
   - Update `validate()` method payload structure if needed
   - Return user object: `{ id, email }`

**Implementation Notes**:
- JWT payload structure: `{ sub: userId, email, iat, exp }`
- Extract from 'auth-token' cookie (no change)
- Validate expiration

**Validation Criteria**:
- Strategy validates JWT tokens correctly
- User object is attached to request
- Invalid tokens are rejected

---

### Phase 7: Update Auth Decorator and Types
**Goal**: Update user type to include firstName/lastName

**Tasks**:
1. Update `apps/api/src/auth/auth.decorator.ts`:
   - Update `AuthUser` interface to include `firstName` and `lastName` (optional)
   - Remove `user_metadata` field

**Updated Interface**:
```typescript
export interface AuthUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}
```

2. Update `@CurrentUser()` decorator if needed (should work as-is)

**Validation Criteria**:
- AuthUser interface matches database schema
- Type checking works correctly

---

### Phase 8: Update DTOs
**Goal**: Update response DTOs to reflect new user structure

**Tasks**:
1. Review `apps/api/src/auth/dto/auth-response.dto.ts`:
   - Ensure schemas match new user structure (firstName, lastName as fields)
   - Remove any Supabase-specific metadata references

2. Verify RegisterDto and LoginDto still work (should be unchanged)

**Validation Criteria**:
- DTOs validate correctly
- API documentation (Swagger) is accurate

---

### Phase 9: Update Tests
**Goal**: Update all auth tests for new implementation

**Tasks**:
1. Update `apps/api/src/auth/auth.service.test.ts`:
   - Mock `PrismaService` instead of `SupabaseService`
   - Mock `JwtService` for token generation
   - Test register with password hashing
   - Test login with password verification
   - Test error cases (user exists, invalid password, user not found)
   - Mock bcrypt functions

2. Update `apps/api/src/auth/auth.controller.test.ts`:
   - Update mocks to match new service implementation
   - Test all endpoints with new data structure

3. Create `apps/api/src/auth/utils/password.util.test.ts`:
   - Test password hashing
   - Test password verification
   - Test edge cases

**Testing Strategy**:
- Use `jest.mock()` for bcrypt
- Use `createMock` from `@golevelup/ts-jest` for Prisma and JWT services
- Ensure 100% code coverage for auth module

**Validation Criteria**:
- All tests pass
- Code coverage meets project standards
- Tests are maintainable and clear

---

### Phase 10: Update Environment Variables and Documentation
**Goal**: Complete environment setup for new auth system

**Tasks**:
1. Update `apps/api/.env.example`:
   - Remove all Supabase variables
   - Add JWT_SECRET with example/instructions
   - Keep database and cookie variables

2. Update local `.env` file (if needed):
   - Generate secure JWT_SECRET (32+ characters)
   - Remove Supabase credentials

3. Update README or docs if they reference Supabase auth

**Validation Criteria**:
- Environment variables are documented
- Example values are provided
- Security notes are included

---

### Phase 11: Integration Testing
**Goal**: Verify end-to-end authentication flow

**Tasks**:
1. Manual testing:
   - Test user registration with email/password
   - Test login with correct credentials
   - Test login with incorrect password
   - Test accessing protected route `/auth/me`
   - Test logout
   - Verify cookies are set correctly

2. E2E tests (if applicable):
   - Create E2E test for complete auth flow

3. Test API client generation:
   - Run `npm run codegen` to ensure OpenAPI spec is correct
   - Verify TypeScript client types are updated

**Validation Criteria**:
- All auth flows work end-to-end
- Protected routes require authentication
- JWT tokens are valid and secure
- API client is generated correctly

---

## Migration Checklist

### Pre-Migration
- [ ] Backup database
- [ ] Document current Supabase configuration
- [ ] Review existing users (if any)

### During Migration
- [ ] Run database migration
- [ ] Install new dependencies
- [ ] Remove Supabase code
- [ ] Implement password hashing
- [ ] Update auth service
- [ ] Update auth module
- [ ] Update JWT strategy
- [ ] Update tests
- [ ] Update environment variables

### Post-Migration
- [ ] Verify all tests pass
- [ ] Test authentication flows manually
- [ ] Generate API client
- [ ] Update documentation
- [ ] Remove Supabase environment variables from production

---

## Security Considerations

### Password Security
- Use bcrypt with salt rounds: 10
- Never log or expose passwords
- Never return password in API responses
- Validate password strength (min 6 chars, already in DTO)

### JWT Security
- Use strong secret (32+ random characters)
- Set appropriate expiration (7 days)
- Use HTTP-only cookies
- Configure CORS properly
- Use secure cookies in production

### Database Security
- Hash passwords before storing
- Use parameterized queries (Prisma handles this)
- Validate all inputs with Zod schemas

---

## Rollback Plan

If issues arise during migration:

1. **Database Rollback**:
   ```bash
   cd packages/database && npx prisma migrate rollback
   ```

2. **Code Rollback**:
   - Revert to previous commit
   - Restore Supabase dependencies

3. **Environment Rollback**:
   - Restore Supabase environment variables

---

## Testing Strategy

### Unit Tests
- Password hashing utilities
- Auth service methods (register, login)
- JWT strategy validation
- Controller endpoints

### Integration Tests
- Full registration flow
- Full login flow
- Protected route access
- Logout flow

### E2E Tests
- User registration → login → access protected resource → logout

---

## Dependencies

### New Dependencies
- `bcrypt`: ^5.1.1
- `@types/bcrypt`: ^5.0.2

### Existing Dependencies (Keep)
- `@nestjs/jwt`: ^11.0.0
- `@nestjs/passport`: ^11.0.5
- `passport-jwt`: ^4.0.1
- `@finance/database`: * (Prisma)

### Dependencies to Remove
- `@supabase/supabase-js`: ^2.50.5

---

## API Contract (No Changes)

The API endpoints and responses remain the same for frontend compatibility:

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user
- `GET /auth/me` - Get current user (protected)

Response format remains consistent:
```typescript
{
  user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    createdAt?: string;
  },
  message?: string;
}
```

---

## Success Criteria

✅ Supabase completely removed from codebase
✅ Users can register with email/password
✅ Passwords are securely hashed with bcrypt
✅ Users can login with email/password
✅ JWT tokens are generated and validated correctly
✅ Protected routes work with JWT guard
✅ All tests pass with good coverage
✅ API contract remains unchanged (no breaking changes)
✅ firstName/lastName stored in database (not metadata)
✅ Environment variables updated and documented
✅ Code is clean, well-tested, and maintainable
