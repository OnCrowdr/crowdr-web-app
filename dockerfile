# syntax=docker/dockerfile:1.4
################################
# 1) deps stage: install deps
################################
FROM node:23.9-bullseye-slim AS deps

# Create app dir
WORKDIR /app

# Copy package manifests first to leverage Docker cache
COPY package.json package-lock.json* ./

# Install all dependencies (dev+prod) for building
RUN npm ci --legacy-peer-deps

################################
# 2) builder stage: build the production .next
################################
FROM node:18-bullseye-slim AS builder
WORKDIR /app

# Copy node_modules from deps
COPY --from=deps /app/node_modules ./node_modules

# Copy source
COPY . .

# Build the Next.js app
ENV NODE_ENV=production
RUN npm run build

################################
# 3) runner stage: minimal runtime image
################################
FROM node:18-bullseye-slim AS runner
WORKDIR /app

# Create non-root user
# (UID 1000 is conventional; adjust if needed)
RUN useradd --create-home --uid 1000 nextjs

# Only copy what is needed to run
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
# If you use next.config.js at runtime, copy it too:
COPY --from=builder /app/next.config.js ./next.config.js

# set permissions, switch to non-root
RUN chown -R nextjs:nextjs /app
USER nextjs

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

# Start the Next.js server
CMD ["npm", "run", "start"]