import type { NextFunction, Request, Response } from "express";
import type { z } from "zod";
import { ApiError } from "../utils/api-error.js";

export interface ValidationSchemas {
	body?: z.ZodTypeAny;
	query?: z.ZodTypeAny;
	params?: z.ZodTypeAny;
}

export const validate = (schemas: ValidationSchemas | z.ZodTypeAny) => {
	return async (
		req: Request,
		_res: Response,
		next: NextFunction,
	): Promise<void> => {
		try {
			// Backward compatibility check for single Zod schema validation on body
			if (schemas && "safeParseAsync" in schemas) {
				const result = await schemas.safeParseAsync(req.body);
				if (!result.success) {
					const message = result.error.issues
						.map(
							(issue: z.ZodIssue) =>
								`${issue.path.join(".")}: ${issue.message}`,
						)
						.join(", ");
					next(new ApiError(400, message));
					return;
				}
				req.body = result.data;
				next();
				return;
			}

			const targets = schemas as ValidationSchemas;
			if (targets.params) {
				const parsedParams = await targets.params.parseAsync(req.params);
				Object.defineProperty(req, "params", {
					value: parsedParams,
					writable: true,
					configurable: true,
					enumerable: true,
				});
			}
			if (targets.query) {
				const parsedQuery = await targets.query.parseAsync(req.query);
				Object.defineProperty(req, "query", {
					value: parsedQuery,
					writable: true,
					configurable: true,
					enumerable: true,
				});
			}
			if (targets.body) {
				req.body = await targets.body.parseAsync(req.body);
			}
			next();
		} catch (error: unknown) {
			if (error && typeof error === "object" && "issues" in error) {
				const zodError = error as { issues: z.ZodIssue[] };
				const message = zodError.issues
					.map(
						(issue: z.ZodIssue) => `${issue.path.join(".")}: ${issue.message}`,
					)
					.join(", ");
				next(new ApiError(400, message));
			} else {
				next(error as Error);
			}
		}
	};
};
