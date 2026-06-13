import dotenv from "dotenv";

dotenv.config();

export default {
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL,
  },
  migrations: {
    seed: "pnpm --filter api exec tsx prisma/seed.ts",
  },
};
