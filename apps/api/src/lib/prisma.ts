import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import pg from "pg";
import { env } from "../config/env.js";

const isCloudDb =
	env.IS_CLOUD_DB === "true" ||
	env.DATABASE_URL.includes("neon.tech") ||
	env.DATABASE_URL.includes("sslmode=require");

const pool = new pg.Pool({
	connectionString: env.DATABASE_URL,
	ssl: isCloudDb ? { rejectUnauthorized: false } : undefined,
	connectionTimeoutMillis: 15000, // 15s connection timeout to accommodate cold starts
	idleTimeoutMillis: 30000, // Close idle connections after 30s
	max: 10, // Max 10 connections in pool
});

pool.on("error", (err) => {
	console.error("Unexpected error on idle database client:", err);
});

const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });
