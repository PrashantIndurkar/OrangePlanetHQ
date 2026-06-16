import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";

// Load root env first, then package level env
if (process.env.NODE_ENV === "test") {
	dotenv.config({ path: path.resolve(process.cwd(), ".env.test") });
}
dotenv.config({ path: path.resolve(process.cwd(), "../../.env") });
dotenv.config();

// Helper to check if running inside a Docker container
const isRunningInDocker = () => {
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

export default {
	schema: "prisma/schema.prisma",
	datasource: {
		url: process.env.DIRECT_URL || databaseUrl,
	},
	migrations: {
		seed: "pnpm --filter api exec tsx prisma/seed.ts",
	},
};
