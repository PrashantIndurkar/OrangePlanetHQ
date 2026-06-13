import type { NextFunction, Request, Response } from "express";
import type { z } from "zod";
import { ApiError } from "../utils/api-error.js";

export const validate = (schema: z.ZodTypeAny) => {
	return async (
		req: Request,
		_res: Response,
		next: NextFunction,
	): Promise<void> => {
		const result = await schema.safeParseAsync(req.body);
		if (!result.success) {
			const message = result.error.issues
				.map((issue: z.ZodIssue) => `${issue.path.join(".")}: ${issue.message}`)
				.join(", ");
			next(new ApiError(400, message));
			return;
		}
		req.body = result.data;
		next();
	};
};
