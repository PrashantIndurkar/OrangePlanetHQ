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
  echo "🛠️ Running development database setup (db push)..."
  pnpm --filter api exec prisma db push --accept-data-loss
  
  echo "⚙️ Generating Prisma Client..."
  pnpm --filter api exec prisma generate
  
  echo "🌱 Seeding database (if empty)..."
  # Run the seed script via pnpm from apps/api context
  pnpm --filter api run db:seed
  
  echo "📸 Starting Prisma Studio in the background on port 5555..."
  pnpm --filter api exec prisma studio --port 5555 --browser none &
  
  echo "🚀 Starting development server..."
  exec pnpm --filter api run dev
fi
