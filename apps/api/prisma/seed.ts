import fs from "node:fs";
import path from "node:path";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import pg from "pg";

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

const pool = new pg.Pool({ connectionString: databaseUrl });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
	// Check if database already has data
	const userCount = await prisma.user.count();
	if (userCount > 0) {
		console.log("🌱 Database already has users. Skipping seeding.");
		return;
	}

	console.log("🌱 Empty database detected. Running seeding...");

	// Hash standard password for the test users
	const passwordHash = await bcrypt.hash("password123", 10);

	// 1. Create a regular user
	const user = await prisma.user.create({
		data: {
			email: "test@example.com",
			passwordHash,
			name: "Test User",
			role: "user",
		},
	});

	// 2. Create an admin user
	const admin = await prisma.user.create({
		data: {
			email: "admin@example.com",
			passwordHash,
			name: "Admin User",
			role: "admin",
		},
	});

	console.log("👤 Users seeded:", { user: user.email, admin: admin.email });

	const taskItems = [
		{
			issueNumber: 1,
			title: "Integrate Prisma and Postgres",
			description: "Set up schema.prisma and migrate tables using Prisma CLI",
			status: "done",
			priority: "high",
			dueDate: new Date(),
			userId: user.id,
		},
		{
			issueNumber: 2,
			title: "Implement Custom JWT Auth",
			description:
				"Develop custom JWT signup, login, and token verification routes",
			status: "in-progress",
			priority: "urgent",
			dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // tomorrow
			userId: user.id,
		},
		{
			issueNumber: 3,
			title: "Write Route Guard Middlewares",
			description:
				"Protect REST API routes using authenticated JWT verification middleware",
			status: "todo",
			priority: "medium",
			userId: user.id,
		},
		{
			issueNumber: 4,
			title: "Add Pagination Controls",
			description:
				"Integrate pagination parameters and page selection buttons on the frontend list",
			status: "backlog",
			priority: "low",
			userId: user.id,
		},
	];

	for (const t of taskItems) {
		const createdTask = await prisma.task.create({
			data: t,
		});

		await prisma.activityLog.create({
			data: {
				taskId: createdTask.id,
				userId: user.id,
				userName: user.name || user.email,
				userInitials: user.name
					? user.name
							.split(" ")
							.map((n) => n[0])
							.join("")
							.toUpperCase()
							.slice(0, 1)
					: "U",
				actionText: "created this issue",
			},
		});
	}

	console.log(`✅ Seeded ${taskItems.length} tasks with activity logs.`);
}

main()
	.catch((e) => {
		console.error("❌ Seeding failed:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
		await pool.end();
	});
