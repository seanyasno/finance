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
RUN turbo prune web --docker

################################################################################
# INSTALLER: Install dependencies and build the application
################################################################################
FROM base AS installer

WORKDIR /app

# Accept build arguments
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Copy lockfile and package.json files
COPY --from=builder /app/out/json/ .

# Install dependencies based on the preferred package manager
RUN npm ci

# Install the missing rollup binary for Alpine (if needed)
RUN npm install @rollup/rollup-linux-x64-musl --save-optional || true

# Copy source code of isolated subworkspace
COPY --from=builder /app/out/full/ .

# Build the project
RUN turbo build --filter=web...

################################################################################
# RUNNER: Create production image
################################################################################
FROM nginx:alpine AS runner

# Copy nginx configuration
RUN echo 'server {' > /etc/nginx/conf.d/default.conf && \
    echo '    listen 8080;' >> /etc/nginx/conf.d/default.conf && \
    echo '    server_name localhost;' >> /etc/nginx/conf.d/default.conf && \
    echo '    location / {' >> /etc/nginx/conf.d/default.conf && \
    echo '        root /usr/share/nginx/html;' >> /etc/nginx/conf.d/default.conf && \
    echo '        index index.html index.htm;' >> /etc/nginx/conf.d/default.conf && \
    echo '        try_files $uri $uri/ /index.html;' >> /etc/nginx/conf.d/default.conf && \
    echo '    }' >> /etc/nginx/conf.d/default.conf && \
    echo '}' >> /etc/nginx/conf.d/default.conf

# Copy built application from installer stage
COPY --from=installer /app/apps/web/dist /usr/share/nginx/html

# Expose port 8080
EXPOSE 8080

# Start nginx
CMD ["nginx", "-g", "daemon off;"]