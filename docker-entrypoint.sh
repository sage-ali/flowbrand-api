#!/bin/sh
set -e

if [ -z "$DATABASE_HOST" ]; then
  echo "ERROR: DATABASE_HOST is not set. Cannot start application."
  exit 1
fi

if [ -z "$REDIS_HOST" ]; then
  echo "ERROR: REDIS_HOST is not set. Redis is required for job queues."
  exit 1
fi

echo "Running database migrations..."
node_modules/.bin/typeorm migration:run -d dist/database/data-source.js

echo "Starting application..."
exec node dist/main.js
