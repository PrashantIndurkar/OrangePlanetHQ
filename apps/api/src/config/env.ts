import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";
import { z } from "zod";

// Load env files
if (process.env.NODE_ENV === "test") {
	dotenv.config({ path: path.resolve(process.cwd(), ".env.test") });
}
dotenv.config({ path: path.resolve(process.cwd(), "../../.env") });
dotenv.config();

// Helper to check if running inside a Docker container
const isRunningInDocker = (): boolean => {
	if (
		process.env.RUNNING_IN_DOCKER === "true" ||
		process.env.DOCKER === "true"
	) {
		return true;
	}
	try {
		return (
			fs.existsSync("/.dockerenv") ||
			fs.readFileSync("/proc/self/cgroup", "utf8").includes("docker")
		);
	} catch {
		return false;
	}
};

let databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
	const nodeEnv = process.env.NODE_ENV || "development";
	if (nodeEnv !== "development" && nodeEnv !== "test") {
		throw new Error(
			"❌ DATABASE_URL environment variable is required in production environments.",
		);
	}
	if (isRunningInDocker()) {
		databaseUrl = "postgresql://postgres:postgres@db:5432/stride";
	} else {
		databaseUrl =
			nodeEnv === "test"
				? "postgresql://postgres:postgres@localhost:5433/stride_test"
				: "postgresql://postgres:postgres@localhost:5433/stride";
	}
} else if (!isRunningInDocker() && databaseUrl.includes("@db:5432")) {
	databaseUrl = databaseUrl.replace("@db:5432", "@localhost:5433");
}

process.env.DATABASE_URL = databaseUrl;

const envSchema = z.object({
	PORT: z.coerce.number().default(3001),
	DATABASE_URL: z.string().url(),
	JWT_SECRET: z.string().min(8, "JWT_SECRET must be at least 8 characters"),
	IS_CLOUD_DB: z.coerce.boolean().default(false),
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),
	API_URL: z.string().url().optional(),
	RENDER_EXTERNAL_URL: z.string().url().optional(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
	console.error("❌ Invalid environment variables:", _env.error.format());
	process.exit(1);
}

export const env = _env.data;
