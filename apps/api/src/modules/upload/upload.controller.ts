import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../../utils/api-error.js";
import { uploadToCloudinary } from "./cloudinary.service.js";

export const uploadImageHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		if (!req.user) {
			throw new ApiError(401, "Unauthorized");
		}

		if (!req.file) {
			throw new ApiError(400, "No file uploaded or file rejected by filter");
		}

		const uploadResult = await uploadToCloudinary(req.file.buffer);
		res.status(200).json({
			url: uploadResult.url,
			publicId: uploadResult.publicId,
		});
	} catch (error) {
		next(error);
	}
};
