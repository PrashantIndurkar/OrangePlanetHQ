import type { NextFunction, Request, Response } from "express";
import { prisma } from "../../lib/prisma.js";
import { ApiError } from "../../utils/api-error.js";
import { seedInitialTasks } from "../tasks/tasks.seeder.js";
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
		const { user, token } = await prisma.$transaction(
			async (tx) => {
				const newUser = await tx.user.create({
					data: {
						email,
						passwordHash,
						name,
					},
				});

				if (!skipSeed) {
					await seedInitialTasks(
						tx,
						newUser.id,
						newUser.name || "Unknown User",
						newUser.email,
					);
				}

				const userToken = generateToken({
					id: newUser.id,
					email: newUser.email,
					name: newUser.name,
					role: newUser.role,
				});

				return { user: newUser, token: userToken };
			},
			{ maxWait: 20000, timeout: 35000 },
		);

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
