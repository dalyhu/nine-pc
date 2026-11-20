# syntax=docker/dockerfile:1.4

FROM node:22-slim AS base

WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV CI=true

RUN npm config set registry http://10.83.222.200/repository/npm/ \
  && corepack enable \
  && corepack prepare pnpm@8.6.5 --activate

# 仅依赖变更时重建此层
FROM base AS deps

COPY package.json pnpm-lock.yaml ./

RUN --mount=type=cache,id=x9-web-pc-pnpm-store,target=/pnpm/store \
  pnpm config set store-dir /pnpm/store \
  && pnpm install --frozen-lockfile

# 源码变更时重建此层
FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY package.json pnpm-lock.yaml ./
COPY . .

RUN --mount=type=cache,id=x9-web-pc-pnpm-store,target=/pnpm/store \
  pnpm config set store-dir /pnpm/store \
  && pnpm run build

# 仅导出静态资源，供 CI 直接 --output 到宿主机
FROM scratch AS export

COPY --from=builder /app/dist /
