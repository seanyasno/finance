# Use the official Node.js 18 Alpine image as the base
FROM node:18-alpine AS base

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine
# for more information on why libc6-compat might be needed
RUN apk add --no-cache libc6-compat
RUN apk update

# Set working directory
WORKDIR /app

# Install Turbo globally
RUN npm install -g turbo@^2.5.4

################################################################################
# BUILDER: Prepare the monorepo
################################################################################
FROM base AS builder

# Copy entire monorepo
COPY . .

# Generate a partial monorepo with a pruned lockfile for the target workspace
RUN turbo prune api --docker

################################################################################
# INSTALLER: Install dependencies and build the application
################################################################################
FROM base AS installer

WORKDIR /app

# Copy lockfile and package.json files
COPY --from=builder /app/out/json/ .

# Install dependencies based on the preferred package manager
RUN npm ci

# Copy source code of isolated subworkspace
COPY --from=builder /app/out/full/ .

# Build the project
RUN turbo build --filter=api...

################################################################################
# RUNNER: Create production image
################################################################################
FROM node:18-alpine AS runner
WORKDIR /app

# Install PostgreSQL client
RUN apk add --no-cache postgresql-client

# Don't run production as root
RUN addgroup --system --gid 1001 nestjs
RUN adduser --system --uid 1001 nestjs
USER nestjs

COPY --from=installer --chown=nestjs:nestjs /app .

WORKDIR /app/apps/api

EXPOSE 8080
CMD [ "npm", "run", "start" ]