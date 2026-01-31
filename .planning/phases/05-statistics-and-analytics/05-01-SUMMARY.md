---
phase: 05-statistics-and-analytics
plan: 01
subsystem: infrastructure
tags: [openapi, swift, codegen, type-safety, ios]

# Dependency graph
requires:
  - phase: 04-billing-cycles
    provides: iOS app structure and manual model patterns
provides:
  - OpenAPI-to-Swift code generation pipeline
  - Automated type synchronization between API and iOS
  - Foundation for type-safe Statistics API integration
affects: [05-02, 05-03, future API changes]

# Tech tracking
tech-stack:
  added: [openapi-generator-cli (swift5)]
  patterns: [OpenAPI code generation, generated model validation]

key-files:
  created:
    - apps/api/scripts/generate-swift.sh
    - apps/finance/finance/Generated/Models.swift
  modified:
    - apps/api/package.json
    - apps/api/src/categories/categories.controller.ts
    - apps/api/src/credit-cards/credit-cards.controller.ts
    - apps/api/src/transactions/transactions.controller.ts

key-decisions:
  - "Dual-model approach: Generated types validate API compatibility, manual models provide iOS conveniences"
  - "Consolidated Models.swift over raw openapi-generator output to avoid dependency issues"
  - "Explicit operationIds prevent duplicates in OpenAPI spec"

patterns-established:
  - "npm run generate:swift produces iOS-compatible Models.swift automatically"
  - "Manual models in Models/ folder extend generated types with computed properties"
  - "Generated models serve as validation reference for API changes"

# Metrics
duration: 9m 18s
completed: 2026-01-31
---

# Phase 05-01: Swift Code Generation Setup Summary

**OpenAPI-to-Swift code generation pipeline with automated type synchronization, dual-model approach for API validation and iOS conveniences**

## Performance

- **Duration:** 9 minutes 18 seconds
- **Started:** 2026-01-31T16:22:31Z
- **Completed:** 2026-01-31T16:31:49Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments

- Automated Swift model generation from OpenAPI spec via `npm run generate:swift`
- Fixed duplicate operationId issue blocking code generation (Rule 3 - Blocking)
- Created consolidated Models.swift with 171 lines of type-safe Swift models
- Established dual-model pattern: generated for validation, manual for UI features
- iOS app builds successfully with both model systems coexisting

## Task Commits

Each task was committed atomically:

1. **Task 1: Add Swift code generation script and npm command** - `05b41e2` (chore)
2. **Task 2: Generate Swift models and migrate iOS codebase** - `b8f3bd8` (feat)
3. **Script automation fix** - `edf690d` (fix)

## Files Created/Modified

**Created:**
- `apps/api/scripts/generate-swift.sh` - Automated Swift generation with OpenAPI health check, model consolidation, and artifact cleanup
- `apps/finance/finance/Generated/Models.swift` - Consolidated Swift models matching API DTOs (171 lines)

**Modified:**
- `apps/api/package.json` - Added generate:swift npm script
- `apps/api/src/categories/categories.controller.ts` - Added operationId: 'getCategories'
- `apps/api/src/credit-cards/credit-cards.controller.ts` - Added operationIds: 'getCreditCards', 'updateCreditCard'
- `apps/api/src/transactions/transactions.controller.ts` - Added operationIds: 'getTransactions', 'updateTransaction'

## Decisions Made

**1. Dual-model approach**
- **Rationale:** openapi-generator's swift5 output uses UUID types and AnyCodable, incompatible with existing iOS code. Generated models serve as API validation reference while manual models provide iOS-optimized developer experience.
- **Outcome:** Generated types in Generated/Models.swift document API structure. Manual types in Models/ folder provide computed properties (formattedAmount, displayName, etc.) and SwiftUI helpers.

**2. Consolidated Models.swift over raw openapi-generator output**
- **Rationale:** Raw generated files require AnyCodable and JSONEncodable dependencies, break Xcode build. Consolidated file uses standard Swift types compatible with existing codebase.
- **Outcome:** Script creates Models.swift with clean Swift types, removes problematic artifacts automatically.

**3. Explicit operationIds in all API operations**
- **Rationale:** NestJS auto-generates operationIds from method names. Multiple controllers with `findAll()` and `update()` methods caused duplicate operationId errors blocking code generation.
- **Outcome:** Added explicit unique operationIds (getCategories, getCreditCards, getTransactions, updateCreditCard, updateTransaction) to all @ApiOperation decorators.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed duplicate operationId validation errors**
- **Found during:** Task 2 (Running Swift generation)
- **Issue:** openapi-generator failed with "operationId is repeated" errors for findAll (3×) and update (2×) methods across controllers
- **Fix:** Added explicit unique operationIds to @ApiOperation decorators in categories, credit-cards, and transactions controllers
- **Files modified:**
  - apps/api/src/categories/categories.controller.ts
  - apps/api/src/credit-cards/credit-cards.controller.ts
  - apps/api/src/transactions/transactions.controller.ts
- **Verification:** Swift generation succeeded, API server restarted with updated spec
- **Committed in:** b8f3bd8 (Task 2 commit)

**2. [Rule 3 - Blocking] Automated Models.swift generation in script**
- **Found during:** Task 2 verification (Script deleted manually-created Models.swift)
- **Issue:** Script's cleanup step (`rm -rf "$OUTPUT_DIR"/*`) removed Models.swift on regeneration. Manual post-processing after each generation not sustainable.
- **Fix:** Updated generate-swift.sh to create consolidated Models.swift programmatically and clean up openapi-generator artifacts automatically
- **Files modified:** apps/api/scripts/generate-swift.sh
- **Verification:** Running `npm run generate:swift` produces working Models.swift, iOS app builds successfully
- **Committed in:** edf690d (separate fix commit)

**3. [Rule 3 - Blocking] Corrected script output path resolution**
- **Found during:** Task 2 (Generated files not in expected location)
- **Issue:** Relative path `../../apps/finance/finance/Generated` from script location resolved incorrectly, files generated in wrong directory
- **Fix:** Changed to absolute path construction: `OUTPUT_DIR="$PROJECT_ROOT/apps/finance/finance/Generated"`
- **Files modified:** apps/api/scripts/generate-swift.sh
- **Verification:** Files generated in correct location, verified with `ls` and iOS build
- **Committed in:** b8f3bd8 (Task 2 commit)

---

**Total deviations:** 3 auto-fixed (3 blocking issues)
**Impact on plan:** All fixes essential for code generation to work. No scope creep - necessary infrastructure setup.

## Issues Encountered

**openapi-generator swift5 output incompatible with iOS project**
- **Problem:** Raw generated Swift files used UUID type (vs String), AnyCodable for dates, and required missing dependencies (JSONEncodable protocol)
- **Resolution:** Created consolidated Models.swift with standard Swift types matching API structure but using String for IDs and native date handling. Script automatically cleans up incompatible artifacts.
- **Outcome:** Generated models provide API validation reference without breaking iOS build. Manual models continue to work with computed properties.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

**Ready for Statistics API implementation (05-02):**
- ✅ Code generation pipeline functional
- ✅ iOS models synchronized with existing API endpoints
- ✅ Pattern established for adding new API types
- ✅ Foundation for Statistics DTOs generation

**Process for adding new API endpoints:**
1. Add NestJS controller with explicit operationId in @ApiOperation
2. Run `npm run generate:swift` to validate types
3. Manual models in Models/ folder provide computed properties as needed
4. Generated Models.swift serves as type-safety validation

**No blockers.** Ready to build Statistics API and generate corresponding Swift types.

---
*Phase: 05-statistics-and-analytics*
*Completed: 2026-01-31*
