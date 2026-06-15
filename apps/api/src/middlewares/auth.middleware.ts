import type { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { verifyToken } from "../modules/auth/auth.utils.js";
import { ApiError } from "../utils/api-error.js";

declare global {
	namespace Express {
		interface Request {
			user?: {
				id: string;
				email: string;
				name: string | null;
				role: string;
			};
		}
	}
}

export const authMiddleware = (
	req: Request,
	_res: Response,
	next: NextFunction,
): void => {
	try {
		const authHeader = req.headers.authorization;
		let token: string | undefined;

		if (authHeader?.startsWith("Bearer ")) {
			token = authHeader.split(" ")[1];
		} else if (req.cookies?.token) {
			token = req.cookies.token;
		} else if (req.query?.token) {
			token = req.query.token as string;
		}

		if (!token) {
			throw new ApiError(401, "Missing authentication token");
		}

		const decoded = verifyToken(token);
		if (
			!decoded ||
			typeof decoded !== "object" ||
			typeof decoded.id !== "string" ||
			!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
				decoded.id,
			)
		) {
			throw new ApiError(401, "Invalid authentication token");
		}
		// Fetch the user from DB to verify latest role status (handles manual role escalations dynamically)
		prisma.user
			.findUnique({ where: { id: decoded.id } })
			.then((user) => {
				if (!user) {
					return next(new ApiError(401, "User not found"));
				}
				req.user = {
					id: user.id,
					email: user.email,
					name: user.name,
					role: user.role,
				};
				next();
			})
			.catch((err) => next(err));
	} catch (_error) {
		next(new ApiError(401, "Please authenticate"));
	}
};
