import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
	// Clean up database before seeding
	await prisma.task.deleteMany();
	await prisma.user.deleteMany();

	console.log("🧹 Database cleaned.");

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

	// 3. Create initial tasks for the regular user
	const tasks = await prisma.task.createMany({
		data: [
			{
				title: "Integrate Prisma and Postgres",
				description: "Set up schema.prisma and migrate tables using Prisma CLI",
				status: "done",
				priority: "high",
				dueDate: new Date(),
				userId: user.id,
			},
			{
				title: "Implement Custom JWT Auth",
				description:
					"Develop custom JWT signup, login, and token verification routes",
				status: "in-progress",
				priority: "urgent",
				dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // tomorrow
				userId: user.id,
			},
			{
				title: "Write Route Guard Middlewares",
				description:
					"Protect REST API routes using authenticated JWT verification middleware",
				status: "todo",
				priority: "medium",
				userId: user.id,
			},
			{
				title: "Add Pagination Controls",
				description:
					"Integrate pagination parameters and page selection buttons on the frontend list",
				status: "backlog",
				priority: "low",
				userId: user.id,
			},
		],
	});

	console.log(`✅ Seeded ${tasks.count} tasks.`);
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
