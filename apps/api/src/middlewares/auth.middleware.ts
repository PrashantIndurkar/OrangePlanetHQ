import type { NextFunction, Request, Response } from "express";
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
			throw new ApiError(401, "Please authenticate");
		}

		const decoded = verifyToken(token);
		if (
			!decoded ||
			typeof decoded !== "object" ||
			typeof decoded.id !== "string"
		) {
			throw new ApiError(401, "Please authenticate");
		}
		// Fetch the user from DB to verify latest role status (handles manual role escalations dynamically)
		import("../lib/prisma.js")
			.then(({ prisma }) => {
				prisma.user
					.findUnique({ where: { id: decoded.id } })
					.then((user) => {
						if (!user) {
							return next(new ApiError(401, "Please authenticate"));
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
			})
			.catch((err) => next(err));
	} catch (_error) {
		next(new ApiError(401, "Please authenticate"));
	}
};
