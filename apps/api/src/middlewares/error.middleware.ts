import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env.js";
import { ApiError } from "../utils/api-error.js";

export const errorHandler = (
	err: any,
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	let { statusCode, message } = err;

	if (!(err instanceof ApiError)) {
		statusCode = err.statusCode || 500;
		message = err.message || "Internal Server Error";
	}

	res.locals["errorMessage"] = err.message;

	const response = {
		code: statusCode,
		message,
		...(env.NODE_ENV === "development" && { stack: err.stack }),
	};

	if (env.NODE_ENV === "development") {
		console.error(err);
	}

	res.status(statusCode).json(response);
};
