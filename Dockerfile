FROM node:22-slim AS builder

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app

RUN npm install -g pnpm@11

COPY package.json pnpm-lock.yaml ./
RUN HUSKY=0 pnpm install --frozen-lockfile --dangerously-allow-all-builds

COPY . .

RUN pnpm build


FROM node:22-slim AS production

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app

RUN npm install -g pnpm@11

COPY package.json pnpm-lock.yaml ./
COPY --from=builder /app/node_modules ./node_modules

RUN pnpm prune --prod --config.ignore-scripts=true

COPY --from=builder /app/dist ./dist
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]