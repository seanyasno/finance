# Docker Compose with PostgreSQL for Local Development

**Date:** 2026-01-21
**Status:** Approved

## Overview

Add a docker-compose configuration to enable local PostgreSQL development without relying on remote Supabase or external database services.

## Requirements

- Single PostgreSQL container for local development
- Simple, predictable credentials
- Data persistence across container restarts
- Integration with existing Turborepo monorepo structure
- Work with existing Prisma setup in `packages/database`

## Architecture

### Docker Compose Setup

**File:** `docker-compose.yml` (project root)

**Service:** PostgreSQL 16 (Alpine)
- **Image:** `postgres:16-alpine`
- **Container name:** `finance-postgres`
- **Port:** `5432:5432` (host:container)
- **Restart policy:** `unless-stopped`
- **Health check:** pg_isready check every 10s

### Database Configuration

**Credentials:**
- Database: `finance`
- User: `postgres`
- Password: `postgres`
- Port: `5432`

**Connection String:**
```
postgresql://postgres:postgres@localhost:5432/finance
```

### Data Persistence

**Strategy:** Named Docker volume

- **Volume name:** `postgres-data`
- **Mount point:** `/var/lib/postgresql/data`
- **Behavior:**
  - Data persists across `docker-compose down`
  - Data removed only with `docker-compose down -v`

## Files to Create/Update

### New Files
1. `docker-compose.yml` - Main compose configuration

### Files to Update
1. `packages/database/.env.example` - Add local database URL
2. `apps/api/.env.example` - Add local database URL
3. Developer updates their own `.env` files with local URLs

## Developer Workflow

### Initial Setup
```bash
# 1. Start PostgreSQL
npm run docker:up

# 2. Apply Prisma schema
cd packages/database
npm run db:push

# 3. Start development servers
npm run dev
```

### Daily Workflow
```bash
# Start database
npm run docker:up

# Start apps
npm run dev

# Stop database (data persists)
npm run docker:down
```

### Reset Database
```bash
# Stop and remove all data
npm run docker:down -v

# Start fresh
npm run docker:up
cd packages/database && npm run db:push
```

## Integration Points

### Existing npm Scripts
The `package.json` already defines:
- `docker:build` - Not needed for PostgreSQL
- `docker:up` - Should use `docker-compose up -d` (detached)
- `docker:down` - Stops containers

### Prisma Integration
After starting docker-compose:
```bash
cd packages/database
npm run db:push      # Apply schema
npm run db:studio    # Open Prisma Studio (optional)
```

### Environment Variables
Update in both:
- `packages/database/.env`
- `apps/api/.env`

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/finance"
DIRECT_URL="postgresql://postgres:postgres@localhost:5432/finance"
```

## Supabase Handling

Since choosing PostgreSQL-only approach (no local Supabase):
- Supabase env vars can be commented out for local development
- Or kept with dummy values if needed to prevent errors
- Authentication will need to be handled separately for local dev

## Considerations

### Port Conflicts
If PostgreSQL already running locally on 5432:
- Either stop local PostgreSQL
- Or change port mapping to `5433:5432` in docker-compose

### Future Enhancements
Could add later:
- pgAdmin for database GUI
- Additional services (Redis, etc.)
- Multiple database environments (test, dev)

## Trade-offs

**Chosen Approach: Simple Docker Compose**

Pros:
- Minimal setup, easy to understand
- Works with existing Prisma tooling
- Data persistence with named volumes
- No vendor lock-in

Cons:
- Requires manual Prisma schema application
- No Supabase auth for local testing
- Developers need Docker installed

**Alternative Approaches Not Chosen:**
- Full Supabase local stack (too complex for current needs)
- Ephemeral data (loses data between restarts)
- Remote database only (requires internet, shared state)

## Success Criteria

- ✓ Developers can run `npm run docker:up` and have PostgreSQL ready
- ✓ Database data persists across container restarts
- ✓ Prisma migrations work with local database
- ✓ No conflicts with existing development workflow
- ✓ Simple enough for new team members to onboard
