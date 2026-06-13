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
		if (!authHeader?.startsWith("Bearer ")) {
			throw new ApiError(401, "Please authenticate");
		}

		const token = authHeader.split(" ")[1];
		if (!token) {
			throw new ApiError(401, "Please authenticate");
		}

		const decoded = verifyToken(token);
		req.user = {
			id: decoded.id,
			email: decoded.email,
			name: decoded.name,
			role: decoded.role,
		};

		next();
	} catch (_error) {
		next(new ApiError(401, "Please authenticate"));
	}
};
