import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = (
	fileBuffer: Buffer,
): Promise<{ url: string; publicId: string }> => {
	return new Promise((resolve, reject) => {
		const uploadStream = cloudinary.uploader.upload_stream(
			{ folder: "orangeplanet/tasks" },
			(error, result) => {
				if (error || !result) {
					return reject(error || new Error("Cloudinary upload failed"));
				}
				resolve({
					url: result.secure_url,
					publicId: result.public_id,
				});
			},
		);
		uploadStream.end(fileBuffer);
	});
};
