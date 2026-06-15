import type { Request } from "express";
import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (
	_req: Request,
	file: Express.Multer.File,
	callback: multer.FileFilterCallback,
) => {
	const allowedMimeTypes = [
		"image/jpeg",
		"image/png",
		"image/webp",
		"image/gif",
	];
	if (allowedMimeTypes.includes(file.mimetype)) {
		callback(null, true);
	} else {
		callback(
			new Error(
				"Invalid file type. Only JPEG, PNG, WEBP, and GIF are allowed.",
			),
		);
	}
};

export const uploadSingleImage = multer({
	storage,
	limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
	fileFilter,
}).single("file");
