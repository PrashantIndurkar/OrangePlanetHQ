#!/bin/sh
set -e

# Wait for DB to be ready
echo "Checking database connection..."

if [ "$NODE_ENV" = "production" ]; then
  echo "🚀 Running production database migrations..."
  npx prisma migrate deploy --schema=prisma/schema.prisma
  
  echo "🎬 Starting production server..."
  exec node dist/server.js
else
  # Ensure we run commands inside the api package directory context
  cd /app/apps/api

  echo "🛠️ Running development database setup (db push)..."
  npx prisma db push --accept-data-loss
  
  echo "⚙️ Generating Prisma Client..."
  npx prisma generate
  
  echo "🌱 Seeding database (if empty)..."
  npx tsx prisma/seed.ts
  
  echo "📸 Starting Prisma Studio in the background on port 5555..."
  npx prisma studio --port 5555 --browser none &
  
  echo "🚀 Starting development server..."
  exec npx tsx watch src/server.ts
fi
