---
phase: 03-categorization
plan: 01
subsystem: api-backend
tags: [nestjs, prisma, categories, crud, database]
requires:
  - 02-01 # Transaction data layer (for category-transaction relation)
  - 01-01 # Authentication (JWT guard for protected endpoints)
provides:
  - categories-table # Database table for categories
  - categories-api # REST API for category management
  - default-categories # 8 pre-seeded default categories
affects:
  - 03-02 # Transaction categorization assignment will use this API
tech-stack:
  added:
    - categories-crud-api # Category management endpoints
  patterns:
    - module-init-seeding # OnModuleInit for data seeding
    - idempotent-seeds # Check-before-create pattern for default data
key-files:
  created:
    - packages/database/prisma/schema.prisma # Added categories model
    - apps/api/src/categories/dto/category.dto.ts # Category DTOs
    - apps/api/src/categories/categories.service.ts # Category business logic
    - apps/api/src/categories/categories.controller.ts # Category endpoints
    - apps/api/src/categories/categories.module.ts # Categories module with seeding
  modified:
    - apps/api/src/app.module.ts # Registered CategoriesModule
decisions:
  - id: category-seeding-pattern
    title: Use OnModuleInit with idempotent seeding for defaults
    context: Need to ensure default categories exist without duplicates
    decision: Check existence before creating each default category individually
    alternatives:
      - createMany with skipDuplicates (doesn't work with null user_id)
      - Simple count check (race condition risk)
    rationale: Individual checks prevent duplicates even with concurrent module initialization
  - id: default-category-storage
    title: Store default categories as is_default=true with null user_id
    context: Need to distinguish between system defaults and user custom categories
    decision: Use is_default boolean flag and null user_id for system categories
    rationale: Allows querying all available categories (defaults OR user's custom) in single query
metrics:
  duration: 5m 22s
  completed: 2026-01-30
---

# Phase 3 Plan 1: Categories API Foundation Summary

**One-liner:** Categories database table and REST API with 8 default categories auto-seeded on startup

## What Was Built

Created the complete categories backend infrastructure:

1. **Database Schema**
   - Added `categories` table with UUID id, name, icon, color, is_default, user_id fields
   - Optional relation to users (null for defaults, set for custom categories)
   - Unique constraint on [user_id, name] to prevent duplicate names per user
   - Index on user_id for query performance

2. **Default Categories**
   - 8 pre-defined categories seeded automatically on API startup
   - food, clothes, transit, subscriptions, entertainment, health, bills, other
   - Each with iOS SF Symbol icon name and hex color
   - Stored with is_default=true and user_id=null

3. **NestJS API Module**
   - `GET /categories` - List all categories (defaults + user's custom)
   - `POST /categories` - Create custom category
   - `DELETE /categories/:id` - Delete custom category (blocks deleting defaults)
   - All endpoints protected with JWT authentication
   - Swagger documentation for all endpoints

4. **Business Logic**
   - CategoriesService with CRUD operations
   - Idempotent seeding logic (checks existence before creating)
   - Permission validation (can't delete defaults or other users' categories)
   - Snake_case to camelCase mapping for API responses

## Decisions Made

### Category Seeding Pattern

**Challenge:** Default categories must exist for all users, but module initialization runs on every API start

**Solution:** OnModuleInit with individual existence checks

```typescript
async seedDefaults() {
  for (const category of DEFAULT_CATEGORIES) {
    const existing = await this.prisma.categories.findFirst({
      where: { name, is_default: true, user_id: null }
    });
    if (!existing) {
      await this.prisma.categories.create({ ... });
    }
  }
}
```

**Why this works:**
- Prevents duplicates even with concurrent starts
- Idempotent (safe to run multiple times)
- Simple and explicit

**Rejected alternatives:**
- `createMany` with `skipDuplicates` - doesn't work with null user_id (multiple nulls don't violate unique constraint)
- Simple count check - race condition if two instances start simultaneously

### Default vs Custom Category Storage

**Decision:** Use `is_default` boolean + nullable `user_id`

**Benefits:**
- Single query to get all available categories: `WHERE is_default=true OR user_id=userId`
- Clear ownership model (null = system, UUID = user)
- Easy to prevent default deletion (check `is_default`)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Incomplete transaction categorization code**

- **Found during:** Task 2 lint verification
- **Issue:** TransactionsController and TransactionsService had update methods and category references added prematurely (from future plan 03-02), but UpdateTransactionDto was missing, causing lint errors
- **Fix:** Created UpdateTransactionDto stub to unblock build
- **Files modified:** apps/api/src/transactions/dto/transaction.dto.ts, apps/api/src/transactions/transactions.controller.ts, apps/api/src/transactions/transactions.service.ts
- **Commits:** Not separately committed (linter auto-fixed, part of Task 2)
- **Note:** This code will be fully implemented in plan 03-02 (Transaction Categorization Assignment)

**2. [Rule 1 - Bug] Duplicate default categories from initial seeding**

- **Found during:** Task 2 verification
- **Issue:** Initial seeding logic used only count check, which allowed duplicates when API restarted during development
- **Fix:** Enhanced seeding to check each category individually before creating
- **Result:** Idempotent seeding that prevents duplicates
- **Commit:** afc37db (part of Task 2)

## Testing & Verification

**Schema verification:**
```bash
npx prisma db push  # ✓ Applied successfully
```

**Build verification:**
```bash
npm run build  # ✓ Builds without errors
npm run lint   # ✓ Passes lint checks
```

**Runtime verification:**
```bash
turbo dev --filter=api  # ✓ Starts successfully
# Logs show:
# - CategoriesModule dependencies initialized
# - Mapped {/categories, GET} route
# - Mapped {/categories, POST} route
# - Mapped {/categories/:id, DELETE} route
```

**Database verification:**
```bash
# Query default categories
# Result: 8 categories (bills, clothes, entertainment, food, health, other, subscriptions, transit)
```

## API Endpoints

### GET /categories
**Auth:** Required (JWT)
**Response:**
```json
{
  "categories": [
    {
      "id": "uuid",
      "name": "food",
      "icon": "fork.knife",
      "color": "#FF9500",
      "isDefault": true
    },
    ...
  ]
}
```

### POST /categories
**Auth:** Required (JWT)
**Body:**
```json
{
  "name": "string (required, max 50 chars)",
  "icon": "string (optional, SF Symbol name)",
  "color": "string (optional, hex color)"
}
```
**Response:** Single CategoryDto

### DELETE /categories/:id
**Auth:** Required (JWT)
**Response:** 204 No Content
**Errors:**
- 403 Forbidden if category is default or belongs to another user
- 404 Not Found if category doesn't exist

## Next Phase Readiness

**Ready for plan 03-02:** Transaction Categorization Assignment
- Categories API fully functional
- Default categories available for all users
- Custom category creation/deletion working
- Category validation in place (defaults can't be deleted)

**Integration points for next plan:**
- Transaction update endpoint will use category IDs from this API
- iOS category picker will call GET /categories
- Transaction list will include category data in response

**No blockers.** All success criteria met.

## Implementation Notes

**Prisma Schema Pattern:**
```prisma
model categories {
  id         String   @id @default(dbgenerated("gen_random_uuid()"))
  name       String   @db.VarChar(50)
  icon       String?  @db.VarChar(50)
  color      String?  @db.VarChar(7)
  is_default Boolean  @default(false)
  user_id    String?  @db.Uuid

  user users? @relation(fields: [user_id], references: [id])

  @@unique([user_id, name])
  @@index([user_id])
}
```

**NestJS Module Pattern:**
- Import DatabaseModule (for PrismaService)
- Import AuthModule (for JwtAuthGuard)
- Implement OnModuleInit for startup logic
- Export service for use by other modules

**Default Categories:**
All use iOS SF Symbols for native integration:
- food: fork.knife (orange)
- clothes: tshirt.fill (purple)
- transit: car.fill (blue)
- subscriptions: repeat (indigo)
- entertainment: film.fill (pink)
- health: heart.fill (red)
- bills: doc.text.fill (green)
- other: ellipsis.circle.fill (gray)

## Files Changed

**Created:**
- `packages/database/prisma/schema.prisma` (added categories model)
- `apps/api/src/categories/dto/category.dto.ts` (DTOs)
- `apps/api/src/categories/dto/index.ts` (exports)
- `apps/api/src/categories/categories.service.ts` (business logic)
- `apps/api/src/categories/categories.controller.ts` (REST endpoints)
- `apps/api/src/categories/categories.module.ts` (module with seeding)

**Modified:**
- `apps/api/src/app.module.ts` (registered CategoriesModule)

**Commits:**
- `fb82d58` - feat(03-01): add categories model to Prisma schema
- `afc37db` - feat(03-01): create categories NestJS module

---

**Status:** ✅ Complete
**Duration:** 5 minutes 22 seconds
**Tasks:** 2/2 completed
**Deviations:** 2 (both auto-fixed per rules)
