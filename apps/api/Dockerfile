# 1. Base stage for all builds
FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN apk add --no-cache libc6-compat

# 2. Prune stage: extracts only the files needed for the API workspace
FROM base AS pruner
WORKDIR /app
RUN npm install -g turbo@2.9.18
COPY . .
RUN turbo prune --scope=api --docker

# 3. Dependencies installer stage: installs node_modules for all workspaces
FROM base AS deps
WORKDIR /app
COPY --from=pruner /app/out/json/ ./
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --ignore-scripts

# 4. Development stage: used for local development mounts via docker-compose
FROM deps AS development
WORKDIR /app
COPY . .
ENV NODE_ENV=development
ENV PORT=3002
EXPOSE 3002
RUN chmod +x apps/api/docker-entrypoint.sh
CMD ["/app/apps/api/docker-entrypoint.sh"]

# 5. Production builder stage: compiles the code and generates Prisma client
FROM base AS builder
WORKDIR /app
COPY --from=pruner /app/out/json/ ./
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=deps /app/node_modules ./node_modules
COPY --from=pruner /app/out/full/ ./
RUN pnpm --filter api run build

# 6. Production dependencies installer stage: installs only production dependencies
FROM base AS prod-deps
WORKDIR /app
COPY --from=pruner /app/out/json/ ./
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile --ignore-scripts
COPY apps/api/prisma ./apps/api/prisma
RUN npx prisma generate --schema=apps/api/prisma/schema.prisma

# 7. Production runner stage: clean minimal production environment
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3002
EXPOSE 3002

# Establish secure non-root execution context
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs

# Copy only production dependencies and build output
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=prod-deps /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /app/apps/api/prisma.config.js ./apps/api/prisma.config.js
COPY --from=builder /app/apps/api/docker-entrypoint.sh ./apps/api/docker-entrypoint.sh

RUN chmod +x apps/api/docker-entrypoint.sh && \
    chown -R nodejs:nodejs /app

USER nodejs

WORKDIR /app/apps/api
CMD ["./docker-entrypoint.sh"]
