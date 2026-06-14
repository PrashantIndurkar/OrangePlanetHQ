import dotenv from "dotenv";
import path from "path";
import { afterAll } from "vitest";

// Load .env.test environment variables before importing Prisma client
dotenv.config({ path: path.resolve(process.cwd(), ".env.test") });

import { prisma } from "../src/lib/prisma.js";

export async function cleanDb() {
	try {
		// Deleting all users will cascade-delete tasks and activity logs
		await prisma.user.deleteMany({});
	} catch (error) {
		console.error("Error during database cleanup:", error);
	}
}

afterAll(async () => {
	console.log("🧼 Cleaning up database tables after test run...");
	await cleanDb();
	await prisma.$disconnect();
});
