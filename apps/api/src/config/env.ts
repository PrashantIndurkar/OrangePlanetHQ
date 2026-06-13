import dotenv from "dotenv";
import path from "path";
import { z } from "zod";

// Load env files from the root of the workspace
dotenv.config({ path: path.resolve(process.cwd(), "../../.env") });
// Fallback to local if not loaded
dotenv.config();

const envSchema = z.object({
	PORT: z.coerce.number().default(3001),
	DATABASE_URL: z.string().url(),
	JWT_SECRET: z.string().min(8, "JWT_SECRET must be at least 8 characters"),
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
	console.error("❌ Invalid environment variables:", _env.error.format());
	process.exit(1);
}

export const env = _env.data;
