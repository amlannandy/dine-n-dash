# Build stage
FROM node:20-alpine AS builder

RUN npm install -g pnpm@8

WORKDIR /app

# Copy manifests first for layer caching
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/types/package.json ./packages/types/
COPY apps/api/package.json ./apps/api/

RUN pnpm install --frozen-lockfile

# Copy source
COPY tsconfig.base.json ./
COPY packages/types/ ./packages/types/
COPY apps/api/ ./apps/api/

# Build the API (types are pure unions — no JS output, nothing to compile)
RUN pnpm --filter api build

# Production stage
FROM node:20-alpine AS runner

RUN npm install -g pnpm@8

WORKDIR /app
ENV NODE_ENV=production

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/types/package.json ./packages/types/
COPY apps/api/package.json ./apps/api/

RUN pnpm install --frozen-lockfile --prod

# Copy compiled output
COPY --from=builder /app/packages/types/dist ./packages/types/dist
COPY --from=builder /app/apps/api/dist ./apps/api/dist

EXPOSE 3000
CMD ["node", "apps/api/dist/main.js"]
