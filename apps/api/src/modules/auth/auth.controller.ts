import type { NextFunction, Request, Response } from "express";
import { prisma } from "../../lib/prisma.js";
import { ApiError } from "../../utils/api-error.js";
import { comparePassword, generateToken, hashPassword } from "./auth.utils.js";

export const signup = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const { email, password, name, skipSeed } = req.body;

		// Check if user already exists
		const existingUser = await prisma.user.findUnique({
			where: { email },
		});
		if (existingUser) {
			throw new ApiError(400, "Email is already registered");
		}

		// Hash password and save user
		const passwordHash = await hashPassword(password);
		const { user, token } = await prisma.$transaction(async (tx) => {
			const newUser = await tx.user.create({
				data: {
					email,
					passwordHash,
					name,
				},
			});

			const dummyTasksData = skipSeed
				? []
				: Array.from({ length: 26 }, (_, idx) => {
						const num = idx + 1;
						const statuses: (
							| "backlog"
							| "todo"
							| "in-progress"
							| "done"
							| "canceled"
						)[] = ["backlog", "todo", "in-progress", "done", "canceled"];
						const priorities: (
							| "urgent"
							| "high"
							| "medium"
							| "low"
							| "no-priority"
						)[] = ["no-priority", "low", "medium", "high", "urgent"];

						const status = statuses[idx % statuses.length];
						const priority = priorities[idx % priorities.length];

						let dueDate: Date | null = null;
						if (idx % 4 === 1) {
							dueDate = new Date(); // Today
						} else if (idx % 4 === 2) {
							const tomorrow = new Date();
							tomorrow.setDate(tomorrow.getDate() + 1);
							dueDate = tomorrow;
						} else if (idx % 4 === 3) {
							const overdue = new Date();
							overdue.setDate(overdue.getDate() - 2);
							dueDate = overdue;
						}

						return {
							issueNumber: num,
							title: `Default Assessment Issue #${num}`,
							description: `This is dummy task #${num} automatically created to verify server-side searching, sorting, pagination, and filters.`,
							status,
							priority,
							dueDate,
							userId: newUser.id,
						};
					});

			for (const taskData of dummyTasksData) {
				const task = await tx.task.create({
					data: taskData,
				});

				await tx.activityLog.create({
					data: {
						taskId: task.id,
						userId: newUser.id,
						userName: newUser.name || newUser.email,
						userInitials: newUser.name
							? newUser.name
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

			const userToken = generateToken({
				id: newUser.id,
				email: newUser.email,
				name: newUser.name,
				role: newUser.role,
			});

			return { user: newUser, token: userToken };
		});

		res.status(201).json({
			user: {
				id: user.id,
				email: user.email,
				name: user.name,
				role: user.role,
			},
			token,
		});
	} catch (error) {
		next(error);
	}
};

export const login = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const { email, password } = req.body;

		// Fetch user
		const user = await prisma.user.findUnique({
			where: { email },
		});
		if (!user) {
			throw new ApiError(401, "Invalid email or password");
		}

		// Compare password
		const isPasswordMatch = await comparePassword(password, user.passwordHash);
		if (!isPasswordMatch) {
			throw new ApiError(401, "Invalid email or password");
		}

		// Generate token
		const token = generateToken({
			id: user.id,
			email: user.email,
			name: user.name,
			role: user.role,
		});

		res.status(200).json({
			user: {
				id: user.id,
				email: user.email,
				name: user.name,
				role: user.role,
			},
			token,
		});
	} catch (error) {
		next(error);
	}
};

export const me = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		if (!req.user) {
			throw new ApiError(401, "Not authenticated");
		}

		const user = await prisma.user.findUnique({
			where: { id: req.user.id },
		});

		if (!user) {
			throw new ApiError(404, "User not found");
		}

		res.status(200).json({
			user: {
				id: user.id,
				email: user.email,
				name: user.name,
				role: user.role,
			},
		});
	} catch (error) {
		next(error);
	}
};
